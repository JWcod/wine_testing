"""
Image upload and serving endpoints.

Images are stored locally at backend/storage/images/.
The returned photo_url is a full URL the iPhone app can use to display the image.

TODO: replace with cloud storage (S3, Cloudflare R2) when going beyond local testing.
"""
import uuid
from pathlib import Path

import aiofiles
from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.wine_record import WineRecord

router = APIRouter(prefix="/images", tags=["images"])

STORAGE_DIR = Path(__file__).resolve().parent.parent.parent / "storage" / "images"
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".heic", ".webp"}
MAX_SIZE_BYTES = 20 * 1024 * 1024  # 20 MB


@router.post("/upload")
async def upload_image(request: Request, file: UploadFile = File(...)):
    """
    Upload an image and return its stored path + a URL ready for use.

    Returns:
        { "photo_path": "storage/images/<uuid>.<ext>", "photo_url": "http://<host>/images/<uuid>.<ext>" }
    """
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{suffix}'. Allowed: {sorted(ALLOWED_EXTENSIONS)}",
        )

    content = await file.read()
    if len(content) > MAX_SIZE_BYTES:
        raise HTTPException(status_code=413, detail="File too large (max 20 MB)")

    filename = f"{uuid.uuid4().hex}{suffix}"
    dest = STORAGE_DIR / filename
    STORAGE_DIR.mkdir(parents=True, exist_ok=True)

    async with aiofiles.open(dest, "wb") as f:
        await f.write(content)

    # Build a URL the iPhone can use on the same Wi-Fi network
    base_url = str(request.base_url).rstrip("/")
    photo_url = f"{base_url}/images/{filename}"
    photo_path = f"storage/images/{filename}"

    return {"photo_path": photo_path, "photo_url": photo_url}


@router.get("/{filename}")
def serve_image(filename: str):
    """Serve a stored image file."""
    # Prevent path traversal
    safe_filename = Path(filename).name
    image_path = STORAGE_DIR / safe_filename
    if not image_path.exists():
        raise HTTPException(status_code=404, detail="Image not found")
    return FileResponse(image_path)


@router.patch("/attach/{wine_id}")
def attach_photo_to_wine(
    wine_id: int,
    photo_path: str,
    db: Session = Depends(get_db),
):
    """
    Convenience endpoint: attach an already-uploaded photo_path to a wine record.
    Call this after /images/upload returns a photo_path.
    """
    wine = db.get(WineRecord, wine_id)
    if not wine:
        raise HTTPException(status_code=404, detail="Wine record not found")
    wine.photo_path = photo_path
    db.commit()
    return {"ok": True, "photo_path": photo_path}
