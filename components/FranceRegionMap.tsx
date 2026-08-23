import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Text as SvgText, Defs, ClipPath, Rect, G } from 'react-native-svg';
import { Colors } from '../constants/colors';

// Real France national outline (simplified from public boundary data,
// equirectangular projection corrected for longitude compression at ~47°N).
const FRANCE_OUTLINE =
  'M200.5,44.9 L215.9,60.2 L227.2,57.6 L246.5,72.4 L251.4,75.2 L257.8,74.5 L268.2,83.0 L300.0,89.0 ' +
  'L288.8,111.1 L286.0,134.2 L280.0,139.7 L269.9,136.7 L270.6,144.9 L254.5,163.1 L254.2,177.8 ' +
  'L264.7,172.7 L272.3,186.9 L271.4,196.1 L277.9,208.2 L270.2,218.1 L275.9,243.1 L287.9,247.2 ' +
  'L285.3,261.3 L265.4,279.5 L221.9,270.8 L189.7,281.3 L187.2,300.8 L161.6,305.0 L136.8,290.3 ' +
  'L128.8,297.3 L88.2,282.6 L79.4,270.0 L90.8,250.6 L95.0,186.1 L72.2,152.2 L55.9,135.8 L22.2,123.4 ' +
  'L20.0,99.8 L48.6,92.7 L85.7,101.0 L78.7,64.4 L99.5,78.3 L150.9,53.1 L157.5,26.5 L176.8,20.0 ' +
  'L180.0,31.4 L190.2,31.9 L200.5,44.9 Z';

// Real pre-2016 French region boundaries (data.gouv.fr via gregoiredavid/france-geojson,
// public open data) for the four wine regions that map cleanly onto a historical
// administrative region: Alsace, Champagne-Ardenne, Bourgogne, Aquitaine (≈ Bordeaux).
// Same projection as FRANCE_OUTLINE, so they align exactly.
const PATH_CHAMPAGNE = "M210.3,77.9 L211.3,71.1 L210.1,69.5 L212.1,69.0 L215.0,65.1 L214.1,64.3 L215.1,61.6 L214.7,58.5 L219.4,59.2 L224.9,57.3 L225.0,54.2 L227.7,51.7 L229.3,52.6 L227.0,58.4 L229.1,60.0 L228.4,63.8 L231.4,63.6 L235.3,67.1 L237.8,67.2 L239.0,68.4 L238.6,69.7 L240.3,69.6 L237.4,72.0 L234.3,70.4 L232.9,73.2 L233.9,76.9 L232.2,78.7 L232.8,80.7 L230.5,81.9 L231.4,82.7 L230.3,83.6 L231.8,87.6 L230.9,88.8 L232.4,88.7 L231.5,90.1 L232.5,90.4 L229.8,92.7 L230.2,94.7 L229.2,96.0 L231.8,97.9 L231.8,102.1 L232.9,101.4 L240.4,106.6 L242.0,108.3 L240.3,109.2 L241.4,109.6 L241.0,111.2 L243.2,110.7 L247.7,115.5 L245.6,119.2 L248.8,120.8 L249.0,123.4 L250.3,122.7 L251.3,124.8 L246.9,127.7 L246.9,132.0 L240.6,132.5 L239.5,135.1 L237.3,135.6 L235.6,132.2 L234.4,133.3 L232.3,131.3 L230.9,132.0 L229.8,129.1 L231.5,127.7 L229.5,124.5 L228.0,124.9 L228.7,123.8 L226.9,123.0 L227.0,121.6 L222.3,121.0 L221.4,121.7 L221.8,122.9 L216.5,123.1 L216.0,124.3 L214.0,122.8 L212.1,124.2 L207.5,124.3 L207.4,122.1 L206.3,122.4 L206.7,121.4 L203.9,116.5 L202.2,117.4 L200.2,115.8 L201.1,113.1 L198.6,110.1 L196.9,110.2 L196.2,108.1 L196.0,106.4 L197.1,105.8 L196.4,104.8 L199.8,101.9 L197.5,101.4 L198.0,99.3 L196.3,97.5 L197.3,96.5 L196.5,95.8 L198.2,95.5 L198.1,93.9 L202.5,89.0 L200.4,88.3 L201.6,87.0 L201.2,84.7 L204.0,84.4 L201.9,82.6 L201.8,79.3 L206.3,78.4 L207.9,76.3 L210.3,77.9 Z";
const PATH_BURGUNDY = "M203.9,169.2 L200.7,161.9 L199.7,164.5 L197.6,165.5 L197.1,163.6 L195.0,164.4 L193.4,163.5 L191.9,164.6 L188.3,161.5 L189.2,153.3 L187.9,152.1 L187.1,145.8 L184.7,143.6 L186.0,140.1 L184.1,136.6 L187.0,135.8 L185.8,132.2 L184.2,131.1 L184.3,129.7 L188.0,128.8 L187.8,125.0 L190.3,122.8 L190.2,120.9 L188.0,117.5 L186.1,116.6 L188.6,113.8 L187.8,111.9 L188.6,110.2 L195.8,109.0 L198.6,110.1 L201.3,113.5 L200.2,115.8 L201.6,115.9 L202.2,117.4 L203.9,116.5 L203.8,117.6 L206.7,121.4 L206.3,122.4 L207.4,122.1 L207.5,124.3 L212.1,124.2 L214.0,123.8 L214.0,122.8 L216.0,124.3 L216.5,123.1 L221.8,122.9 L221.4,121.7 L222.3,121.0 L227.0,121.6 L226.9,123.0 L228.7,123.8 L228.0,124.9 L229.5,124.5 L231.5,127.7 L229.8,129.1 L230.7,129.6 L230.9,132.0 L232.3,131.3 L234.4,133.3 L235.6,132.2 L235.5,133.2 L237.3,134.1 L237.3,135.6 L238.8,134.5 L240.4,135.0 L241.0,133.8 L242.2,134.7 L242.4,137.2 L239.8,139.2 L241.4,139.8 L241.2,141.6 L242.6,141.7 L242.0,144.0 L243.1,144.4 L240.4,151.2 L237.9,152.8 L238.6,153.9 L237.2,156.1 L241.8,158.9 L241.8,159.8 L238.9,160.3 L240.2,161.7 L239.6,162.9 L241.3,166.0 L239.5,168.5 L240.9,171.1 L237.7,172.1 L235.3,169.9 L232.8,170.9 L230.2,170.0 L226.8,180.9 L225.5,180.7 L225.8,179.1 L224.6,178.3 L225.2,177.6 L224.6,176.8 L223.2,178.1 L218.5,177.0 L217.8,180.6 L215.8,181.5 L214.1,180.3 L209.3,181.1 L207.1,179.7 L207.2,177.4 L209.7,176.0 L209.1,173.7 L209.6,171.7 L203.9,169.2 Z";
const PATH_ALSACE = "M280.1,111.8 L279.8,110.9 L277.4,110.5 L278.1,109.6 L277.6,109.0 L278.4,106.2 L277.8,105.7 L278.5,105.7 L277.2,104.9 L279.5,104.8 L281.6,102.7 L282.5,100.5 L281.6,100.5 L281.1,99.5 L282.7,97.1 L281.2,95.7 L281.4,95.3 L280.6,95.4 L279.8,94.4 L277.5,96.4 L277.2,96.0 L277.7,95.8 L276.8,95.3 L276.9,94.5 L277.8,94.0 L274.8,93.0 L274.5,91.6 L276.5,91.0 L277.4,87.2 L278.3,87.4 L278.0,87.6 L278.6,89.4 L282.2,90.4 L283.0,91.4 L285.7,90.6 L288.0,91.6 L289.8,87.8 L291.9,88.1 L293.4,87.5 L294.9,88.4 L296.4,87.7 L299.7,89.8 L302.9,90.6 L300.9,92.9 L299.7,95.9 L297.3,97.3 L297.1,98.4 L294.4,101.0 L293.5,102.7 L293.5,105.3 L292.7,106.0 L291.9,109.0 L292.2,111.3 L291.1,112.1 L290.4,114.7 L289.0,116.9 L288.3,119.2 L288.3,120.7 L289.5,122.7 L288.0,125.9 L288.2,127.0 L287.4,128.9 L287.8,130.7 L287.0,131.7 L288.8,134.9 L286.8,136.8 L287.4,137.2 L286.7,137.4 L287.0,138.1 L286.6,138.6 L285.3,138.1 L285.0,138.7 L285.8,138.9 L284.3,140.3 L281.2,140.7 L279.5,139.8 L280.2,138.3 L278.6,138.0 L278.9,137.3 L277.6,135.1 L275.9,134.8 L276.7,132.6 L276.5,130.8 L272.8,128.9 L272.3,127.9 L274.0,126.7 L273.5,125.5 L274.1,124.8 L273.8,124.5 L274.5,121.9 L275.8,121.1 L277.4,118.4 L277.6,117.7 L277.1,117.4 L277.5,116.4 L280.1,111.8 Z";
const PATH_BORDEAUX = "M153.3,218.4 L152.4,218.8 L153.1,222.9 L149.8,225.8 L150.3,227.4 L146.6,229.6 L145.7,232.8 L143.0,233.7 L144.8,239.1 L142.1,240.2 L141.1,239.1 L140.5,241.3 L142.3,242.4 L140.1,245.4 L141.0,246.9 L138.7,246.7 L138.9,247.8 L136.2,250.5 L134.2,248.8 L128.0,251.6 L124.1,251.3 L122.5,252.7 L122.6,254.6 L120.5,251.9 L116.0,254.7 L117.2,255.7 L116.3,257.6 L117.0,259.9 L115.1,263.6 L119.2,264.9 L120.9,268.5 L119.9,268.7 L119.8,270.4 L121.3,269.3 L121.9,272.5 L120.3,273.9 L120.9,275.0 L119.8,278.0 L117.0,280.0 L117.3,282.0 L115.0,283.5 L114.4,288.5 L112.7,290.2 L110.3,289.3 L108.8,290.8 L105.2,287.0 L104.7,284.8 L100.5,285.2 L93.5,282.3 L92.4,281.4 L93.3,279.9 L91.9,280.2 L91.4,282.8 L89.6,282.2 L88.9,280.8 L90.1,279.5 L90.7,275.5 L87.6,274.2 L85.9,275.5 L85.5,273.9 L83.1,274.0 L81.9,272.4 L86.0,269.6 L89.4,262.8 L93.5,233.7 L95.0,230.0 L99.2,230.4 L95.7,226.3 L93.5,231.0 L95.8,203.4 L97.2,200.9 L103.4,207.6 L104.8,211.6 L106.1,211.3 L105.5,208.4 L108.4,207.9 L108.8,209.4 L112.1,210.1 L112.9,214.3 L120.3,215.8 L121.5,212.4 L124.2,212.2 L127.2,209.3 L126.8,207.2 L128.0,204.1 L130.8,203.3 L132.5,201.0 L132.4,198.9 L135.2,195.9 L138.4,197.4 L137.9,199.0 L139.2,200.3 L140.5,198.8 L143.8,199.3 L145.2,201.8 L147.0,201.9 L146.0,203.5 L149.7,205.0 L149.1,206.0 L150.4,207.1 L148.6,208.6 L148.4,210.2 L149.5,211.2 L148.4,212.4 L149.8,212.9 L149.0,213.9 L149.8,214.4 L152.5,214.9 L151.7,215.6 L153.3,218.4 Z";

// Loire Valley: the UNESCO "Val de Loire" boundary only covers a narrow core
// heritage stretch, far smaller than the actual wine region (Muscadet near the
// coast through Anjou, Touraine, all the way to Sancerre) — so like Rhône/Mosel,
// this traces a ribbon along the real river course through the region's defining
// towns (Nantes → Sancerre) instead of that undersized official boundary.
const PATH_LOIRE = "M104.3,152.0 L105.2,151.8 L106.0,151.4 L106.8,151.0 L109.0,149.6 L114.7,153.3 L115.4,153.8 L116.2,154.2 L117.1,154.4 L117.9,154.6 L118.8,154.8 L119.7,154.8 L120.6,154.7 L128.7,153.8 L129.5,153.7 L130.2,153.5 L130.9,153.3 L139.5,150.0 L139.9,149.8 L154.5,143.4 L155.3,143.1 L156.0,142.6 L156.6,142.2 L163.4,136.6 L167.8,139.9 L177.3,149.8 L178.0,150.4 L178.7,151.0 L179.4,151.5 L180.2,151.8 L181.0,152.2 L181.9,152.4 L182.7,152.5 L183.6,152.6 L184.5,152.6 L185.4,152.5 L186.2,152.3 L187.1,152.0 L187.9,151.6 L188.7,151.2 L189.4,150.7 L190.0,150.1 L190.6,149.4 L191.2,148.7 L191.7,148.0 L192.0,147.2 L192.4,146.4 L192.6,145.5 L192.7,144.7 L192.8,143.8 L192.8,142.9 L192.7,142.0 L192.5,141.2 L192.2,140.3 L191.8,139.5 L191.4,138.7 L190.9,138.0 L190.3,137.4 L180.3,127.0 L179.8,126.5 L179.3,126.0 L168.7,117.9 L168.0,117.5 L167.2,117.0 L166.4,116.7 L165.6,116.4 L164.8,116.2 L163.9,116.1 L163.0,116.1 L162.2,116.2 L161.3,116.3 L160.5,116.5 L159.7,116.8 L158.9,117.2 L158.2,117.6 L157.5,118.1 L146.1,127.5 L132.9,133.3 L125.6,136.1 L121.8,136.5 L114.1,131.5 L113.3,131.0 L112.5,130.6 L111.6,130.3 L110.7,130.1 L109.8,130.0 L108.9,130.0 L108.0,130.1 L107.1,130.3 L106.2,130.5 L105.3,130.9 L104.5,131.3 L98.6,134.9 L84.9,138.4 L84.0,138.6 L83.2,139.0 L82.5,139.4 L81.7,139.9 L81.0,140.4 L80.4,141.1 L79.9,141.8 L79.4,142.5 L79.0,143.3 L78.6,144.1 L78.4,144.9 L78.2,145.8 L78.1,146.7 L78.1,147.6 L78.2,148.4 L78.4,149.3 L78.6,150.2 L79.0,151.0 L79.4,151.7 L79.9,152.5 L80.4,153.2 L81.1,153.8 L81.8,154.3 L82.5,154.8 L83.3,155.2 L84.1,155.6 L84.9,155.8 L85.8,156.0 L86.7,156.1 L87.6,156.1 L88.4,156.0 L89.3,155.8 L104.3,152.0 Z";

// Rhône Valley: no single administrative or heritage boundary exists (it's a river
// corridor split into northern/southern sub-zones), so this traces a ribbon along
// the real river course through the region's defining towns (Vienne → Avignon).
const PATH_RHONE = "M220.3,208.7 L220.3,209.9 L221.1,220.6 L218.4,231.2 L218.2,231.9 L218.1,232.6 L218.1,233.3 L218.1,234.0 L219.4,247.6 L219.5,248.3 L219.8,249.6 L219.5,251.9 L219.4,252.7 L219.4,253.5 L219.5,254.2 L219.7,255.0 L219.9,255.8 L220.2,256.5 L220.6,257.2 L221.0,257.8 L221.5,258.4 L222.1,259.0 L222.7,259.5 L223.4,259.9 L224.0,260.3 L224.8,260.6 L225.5,260.8 L226.3,260.9 L227.1,261.0 L227.9,261.0 L228.6,260.9 L229.4,260.7 L230.2,260.5 L230.9,260.2 L231.6,259.8 L232.2,259.4 L232.8,258.9 L233.4,258.3 L233.9,257.7 L234.3,257.0 L234.7,256.4 L235.0,255.6 L235.2,254.9 L235.3,254.1 L235.8,250.5 L235.9,249.6 L235.9,248.8 L235.8,247.9 L235.3,245.7 L234.2,233.8 L236.9,223.3 L237.1,222.5 L237.2,221.6 L237.2,220.7 L236.3,209.3 L236.8,202.8 L236.8,202.0 L236.7,201.2 L236.6,200.4 L236.4,199.7 L236.1,198.9 L235.7,198.2 L235.3,197.6 L234.8,197.0 L234.3,196.4 L233.7,195.9 L233.1,195.4 L232.4,195.0 L231.7,194.7 L230.9,194.5 L230.1,194.3 L229.4,194.2 L228.6,194.2 L227.8,194.3 L227.0,194.4 L226.3,194.6 L225.5,194.9 L224.8,195.3 L224.2,195.7 L223.6,196.2 L223.0,196.7 L222.5,197.3 L222.0,197.9 L221.6,198.6 L221.3,199.3 L221.1,200.1 L220.9,200.9 L220.8,201.6 L220.3,208.7 Z";

interface FranceRegion {
  id: string; name: string; path: string; color: string;
  labelX: number; labelY: number; labelDx?: number; labelDy?: number;
}

// Alsace/Champagne/Burgundy/Bordeaux use real pre-2016 French region boundaries
// (which align with wine identity far better than the 2016-merged mega-regions);
// Loire Valley and Rhône Valley are traced along their real river course through
// defining towns, since no single official boundary covers either full region.
const REGIONS: FranceRegion[] = [
  { id: 'champagne', name: 'Champagne', path: PATH_CHAMPAGNE, color: Colors.gold, labelX: 221.5, labelY: 98.2 },
  { id: 'alsace', name: 'Alsace', path: PATH_ALSACE, color: '#D9B88F', labelX: 285.3, labelY: 111.2, labelDx: 22 },
  { id: 'loire-valley', name: 'Loire Valley', path: PATH_LOIRE, color: '#8A9A6B', labelX: 137.5, labelY: 139.4 },
  { id: 'burgundy', name: 'Burgundy', path: PATH_BURGUNDY, color: '#A0533E', labelX: 212.9, labelY: 146.3 },
  { id: 'bordeaux', name: 'Bordeaux', path: PATH_BORDEAUX, color: Colors.primary, labelX: 116.1, labelY: 239.9 },
  { id: 'rhone-valley', name: 'Rhône Valley', path: PATH_RHONE, color: '#B54B3A', labelX: 227.9, labelY: 227.6 },
];

// Illustrated terrain cues — real rivers (not already drawn as a wine-region
// ribbon) and real mountain range positions, so the map reads as a place with
// geography rather than flat color blobs. Not literal elevation data (see
// project notes); rivers are traced through real waypoints, mountain peaks are
// placed at real range locations.
const RIVERS: { name: string; path: string }[] = [
  { name: 'Garonne', path: 'M153.1,264.3 L125.7,244.9 L108.5,224.2 L99.3,206.0' },
  { name: 'Rhine', path: 'M288.8,136.1 L292.3,103.1 L304.2,88.6' },
];

const MOUNTAINS: { name: string; points: [number, number][] }[] = [
  { name: 'Alps', points: [[272.9, 192.1], [264.7, 212.5], [275.7, 248.1]] },
  { name: 'Pyrenees', points: [[123.5, 293.4], [154.4, 296.7], [110.3, 286.9]] },
  { name: 'Massif Central', points: [[183.1, 202.8], [194.1, 219.0], [176.5, 231.9]] },
  { name: 'Vosges', points: [[275.7, 118.7], [278.0, 125.1]] },
];

/** A small triangular peak glyph — the classic cartographic "mountain" mark. */
function MountainPeak({ x, y }: { x: number; y: number }) {
  const w = 5.5, h = 6;
  return (
    <Path
      d={`M${x - w / 2},${y + h / 2} L${x},${y - h / 2} L${x + w / 2},${y + h / 2} Z`}
      fill={Colors.textMuted}
      fillOpacity={0.4}
      stroke={Colors.textMuted}
      strokeOpacity={0.5}
      strokeWidth={0.4}
      pointerEvents="none"
    />
  );
}

interface Props {
  onSelectRegion: (regionId: string) => void;
}

export default function FranceRegionMap({ onSelectRegion }: Props) {
  const [pressedId, setPressedId] = useState<string | null>(null);

  const handlePressIn = useCallback((id: string) => setPressedId(id), []);
  const handlePressOut = useCallback(() => setPressedId(null), []);

  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" viewBox="0 0 340 380" preserveAspectRatio="xMidYMid meet">
        <Defs>
          <ClipPath id="franceClip">
            <Path d={FRANCE_OUTLINE} />
          </ClipPath>
        </Defs>

        <Rect x={0} y={0} width={340} height={380} fill={Colors.cream} />

        {/* Landmass */}
        <Path d={FRANCE_OUTLINE} fill={Colors.parchment} stroke={Colors.textMuted} strokeWidth={1.5} />

        {/* Terrain — real rivers + real mountain range positions, clipped to the coastline */}
        <G clipPath="url(#franceClip)">
          {RIVERS.map(river => (
            <Path
              key={river.name}
              d={river.path}
              fill="none"
              stroke={Colors.riverBlue}
              strokeWidth={1.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.75}
              pointerEvents="none"
            />
          ))}
          {MOUNTAINS.map(range => (
            <React.Fragment key={range.name}>
              {range.points.map(([x, y], i) => (
                <MountainPeak key={`${range.name}-${i}`} x={x} y={y} />
              ))}
            </React.Fragment>
          ))}
        </G>

        {/* Region shapes, clipped to the coastline so nothing spills into the sea */}
        <G clipPath="url(#franceClip)">
          {REGIONS.map(region => {
            const isPressed = pressedId === region.id;
            return (
              <Path
                key={region.id}
                d={region.path}
                fill={region.color}
                fillOpacity={isPressed ? 0.65 : 0.88}
                stroke={Colors.cream}
                strokeWidth={2}
                strokeLinejoin="round"
                onPressIn={() => handlePressIn(region.id)}
                onPressOut={handlePressOut}
                onPress={() => onSelectRegion(region.id)}
              />
            );
          })}
        </G>

        {/* France border on top, crisp */}
        <Path d={FRANCE_OUTLINE} fill="none" stroke={Colors.text} strokeWidth={1.5} strokeOpacity={0.4} />

        {/* Labels (unrotated, always legible) */}
        {REGIONS.map(region => {
          return (
            <SvgText
              key={`label-${region.id}`}
              x={region.labelX + (region.labelDx ?? 0)}
              y={region.labelY + (region.labelDy ?? 4)}
              fontSize={11}
              fontWeight="700"
              fill={Colors.white}
              textAnchor="middle"
              stroke={Colors.text}
              strokeWidth={0.4}
              pointerEvents="none"
            >
              {region.name}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
});
