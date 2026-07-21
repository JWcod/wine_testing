import { Winery } from '../types';

export const famousWineries: Winery[] = [
  {
    id: 'chateau-petrus',
    name: 'Château Pétrus',
    region: 'Pomerol, Bordeaux',
    country: 'France',
    latitude: 44.9244,
    longitude: -0.2113,
    description:
      'Château Pétrus is perhaps the most prestigious and expensive wine in the world. This tiny estate in Pomerol produces fewer than 3,000 cases per year from almost pure Merlot on a unique iron-rich clay plateau.',
    history:
      'The estate gained modern fame under Madame Loubat in the mid-20th century and achieved legendary status in the 1960s and 1970s. Négociant Jean-Pierre Moueix took management in 1945 and built its global reputation. Its 2000 vintage regularly fetches over $5,000 per bottle at auction.',
    specialties: ['Pétrus (single wine — Merlot dominant)'],
    website: 'https://www.petrus.fr',
  },
  {
    id: 'domaine-romanee-conti',
    name: 'Domaine de la Romanée-Conti',
    region: 'Vosne-Romanée, Burgundy',
    country: 'France',
    latitude: 47.1629,
    longitude: 4.959,
    description:
      'Domaine de la Romanée-Conti (DRC) is the most revered wine producer in the world. Its flagship Romanée-Conti Grand Cru routinely sells for $15,000–$30,000+ per bottle. The domain is jointly owned by the Villaine and de Villaine families.',
    history:
      'The Romanée-Conti vineyard was owned by the Prince of Conti in the 18th century. The modern Domaine was established in 1942 when Henri Leroy joined the de Villaine family. DRC remained ungrafted until 1945, producing legendary pre-phylloxera-style wines in its final years.',
    specialties: [
      'Romanée-Conti Grand Cru',
      'La Tâche Grand Cru',
      'Richebourg Grand Cru',
      'Romanée-St-Vivant Grand Cru',
      'Échézeaux Grand Cru',
    ],
    website: 'https://www.romanee-conti.fr',
  },
  {
    id: 'opus-one',
    name: 'Opus One',
    region: 'Oakville, Napa Valley',
    country: 'USA',
    latitude: 38.4094,
    longitude: -122.3969,
    description:
      'Opus One is a joint venture between Robert Mondavi and Baron Philippe de Rothschild of Château Mouton Rothschild, launched in 1978. It was a landmark collaboration between New World and Old World wine royalty.',
    history:
      'The partnership was announced at a state dinner at the White House in 1979 and produced its first vintage (1979) in Mondavi\'s facilities before building its iconic gravity-flow winery. Opus One helped legitimise Napa Valley on the world fine wine stage.',
    specialties: ['Opus One (Cabernet Sauvignon-dominant Bordeaux blend)', 'Overture (second wine)'],
    website: 'https://www.opusonewinery.com',
  },
  {
    id: 'sassicaia',
    name: 'Tenuta San Guido (Sassicaia)',
    region: 'Bolgheri, Tuscany',
    country: 'Italy',
    latitude: 43.1741,
    longitude: 10.7222,
    description:
      'Sassicaia was the first "Super Tuscan" wine, created by Marchese Mario Incisa della Rocchetta in 1944 using Cabernet Sauvignon cuttings from Château Lafite. It now has its own DOC — the only single-estate DOC in Italy.',
    history:
      'Sassicaia was initially produced only for family use. Its 1968 vintage was commercially released in 1974 and immediately won acclaim, fundamentally changing perceptions of Italian wine quality. In 1994 it gained DOC status, and in 2013 it was granted its own dedicated DOC: Bolgheri Sassicaia DOC.',
    specialties: ['Sassicaia (Cabernet Sauvignon / Cabernet Franc blend)', 'Guidalberto (second wine)'],
    website: 'https://www.sassicaia.com',
  },
  {
    id: 'krug',
    name: 'Krug',
    region: 'Reims, Champagne',
    country: 'France',
    latitude: 49.0597,
    longitude: 4.0244,
    description:
      'Krug is Champagne\'s most prestigious house, founded in 1843 by Joseph Krug. Every Krug Champagne, including its non-vintage Grande Cuvée, is aged in small oak barrels — a uniquely labour-intensive approach at this scale.',
    history:
      'Joseph Krug rejected the conventions of his time, believing every vintage deserved the same care as a prestige cuvée. He created a meticulous reserve wine system allowing him to blend across many vintages. The estate remains in family hands after more than 175 years and is now part of LVMH.',
    specialties: [
      'Grande Cuvée (multi-vintage blend)',
      'Vintage Champagne',
      'Krug Rosé',
      'Clos du Mesnil (Blanc de Blancs)',
      'Clos d\'Ambonnay (Blanc de Noirs)',
    ],
    website: 'https://www.krug.com',
  },
  {
    id: 'cvne',
    name: 'CVNE (Compañía Vinícola del Norte de España)',
    region: 'Haro, Rioja Alta',
    country: 'Spain',
    latitude: 42.4638,
    longitude: -2.4495,
    description:
      'Founded in 1879, CVNE is one of Rioja\'s oldest and most distinguished wine houses. Its Imperial and Viña Real Reservas and Gran Reservas are benchmarks for traditional Rioja style.',
    history:
      'Founded by two brothers, Eusebio and Raimundo Real de Asúa, CVNE was one of the first Rioja producers to export internationally. Its bodega in Haro was designed by Gustave Eiffel\'s engineering company and was declared a Historic Site. The fifth generation of the family now runs the estate.',
    specialties: ['Imperial Gran Reserva', 'Viña Real Gran Reserva', 'Contino Viña del Olivo'],
    website: 'https://www.cvne.com',
  },
  {
    id: 'penfolds',
    name: 'Penfolds',
    region: 'Barossa Valley, South Australia',
    country: 'Australia',
    latitude: -34.53,
    longitude: 138.96,
    description:
      'Penfolds is Australia\'s most iconic wine producer, founded in 1844. Its Grange Hermitage (now simply "Grange") is often called Australia\'s first growth and is one of the most collected wines in the world.',
    history:
      'Dr Christopher Rawson Penfold established the estate at Magill outside Adelaide. Chief winemaker Max Schubert created Grange in 1951, inspired by visits to Bordeaux. Dismissed by the board initially, Grange survived and became Australia\'s most celebrated wine, achieving Registered Heritage Icon status.',
    specialties: [
      'Grange (Shiraz, multi-region)',
      'RWT Barossa Valley Shiraz',
      'Bin 707 Cabernet Sauvignon',
      'Yattarna Chardonnay',
    ],
    website: 'https://www.penfolds.com',
  },
  {
    id: 'chateau-margaux',
    name: 'Château Margaux',
    region: 'Margaux, Bordeaux',
    country: 'France',
    latitude: 45.0381,
    longitude: -0.674,
    description:
      'Château Margaux is one of Bordeaux\'s five first growths (Premier Grand Cru Classé) and is often regarded as producing the most "feminine" and perfumed wines on the Left Bank.',
    history:
      'The Margaux estate has produced wine for over 500 years. After a difficult period in the 1960s–70s, André Mentzelopoulos purchased the château in 1977 and dramatically raised quality. Today under his daughter Corinne Mentzelopoulos, Margaux regularly achieves perfect scores from critics.',
    specialties: [
      'Château Margaux (Grand Vin)',
      'Pavillon Rouge du Château Margaux (second wine)',
      'Pavillon Blanc du Château Margaux (white)',
    ],
    website: 'https://www.chateau-margaux.com',
  },
];
