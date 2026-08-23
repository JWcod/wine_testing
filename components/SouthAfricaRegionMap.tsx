import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Text as SvgText, Rect, Line } from 'react-native-svg';
import { Colors } from '../constants/colors';

// Real South Africa national outline (simplified from public boundary data,
// same equirectangular + cos-latitude-corrected projection as the other maps).
const OUTLINE = 'M240.0,136.5 L237.1,138.9 L230.9,147.5 L226.7,156.1 L218.4,168.1 L201.7,185.5 L191.3,195.6 L180.1,203.2 L164.7,209.8 L157.2,210.6 L155.3,215.3 L146.3,212.8 L139.0,216.0 L123.0,212.8 L114.1,214.8 L107.9,213.9 L92.7,220.6 L80.1,223.2 L71.0,229.6 L64.3,230.0 L58.0,224.0 L53.1,223.7 L46.7,216.2 L46.0,218.5 L44.0,214.0 L44.1,204.1 L39.3,192.9 L44.1,189.8 L43.7,176.9 L34.0,161.2 L26.6,146.9 L26.6,146.9 L16.0,125.0 L23.1,116.7 L28.9,121.3 L31.4,128.5 L38.0,129.7 L47.3,132.9 L55.2,131.7 L68.4,123.1 L68.4,61.0 L72.4,63.5 L81.1,79.5 L79.8,89.7 L83.1,95.6 L93.7,93.9 L101.0,86.4 L108.0,81.4 L111.6,73.3 L118.8,69.4 L125.1,71.5 L132.1,76.2 L144.1,77.0 L153.6,73.1 L155.1,67.8 L157.6,59.8 L165.7,58.5 L170.1,52.1 L175.0,40.9 L188.3,28.4 L209.2,16.0 L215.2,16.2 L222.3,19.0 L227.3,17.0 L235.1,18.7 L242.2,42.4 L246.0,54.3 L243.4,73.0 L244.7,79.1 L237.2,76.0 L233.0,77.2 L231.6,82.1 L227.5,88.4 L227.7,94.2 L236.5,103.3 L245.1,101.5 L248.1,94.1 L259.3,94.2 L255.6,106.4 L253.9,120.4 L250.1,128.0 L240.0,136.5 Z';

// Real Stellenbosch Local Municipality boundary (OpenStreetMap administrative
// relation) — the actual wine region roughly matches this municipal area, not
// just the small historic town centre polygon used in the previous version.
const REGION_PATH = "M56.6,213.4 L57.3,213.9 L57.3,213.9 L57.3,213.9 L57.6,214.0 L57.8,213.9 L58.3,213.8 L58.8,214.5 L58.2,215.4 L58.0,215.3 L57.6,215.7 L57.3,215.5 L57.0,215.6 L55.8,216.4 L55.6,216.6 L55.0,216.8 L54.7,216.6 L54.5,216.4 L54.4,216.3 L54.1,216.2 L54.0,216.4 L54.0,216.4 L54.0,216.5 L53.7,216.7 L53.6,216.7 L53.5,216.7 L53.5,216.8 L53.1,216.7 L53.2,216.8 L53.2,216.9 L52.9,217.0 L52.5,216.9 L52.3,217.1 L52.5,217.1 L52.4,217.3 L52.3,217.1 L52.1,217.1 L51.7,217.0 L51.8,216.9 L51.6,216.8 L51.6,216.8 L51.5,216.7 L51.4,216.6 L51.4,216.5 L51.5,216.4 L51.4,216.3 L51.5,216.3 L51.3,216.0 L51.4,216.0 L51.2,215.7 L51.3,215.7 L51.2,215.6 L51.3,215.2 L51.4,215.1 L51.3,215.1 L51.2,215.0 L50.9,214.9 L51.0,214.6 L51.0,214.6 L51.0,214.6 L51.0,214.5 L51.3,214.4 L51.3,214.4 L51.4,214.3 L51.5,214.4 L51.5,214.3 L51.4,214.1 L51.4,213.9 L51.5,213.7 L51.5,213.4 L51.8,213.4 L51.8,213.3 L52.5,213.1 L52.6,212.8 L52.6,212.8 L52.7,213.0 L53.7,212.8 L53.7,212.8 L53.8,212.8 L53.7,212.9 L53.7,213.0 L53.6,213.3 L53.6,213.6 L53.5,213.6 L54.0,214.1 L54.2,214.2 L54.4,214.0 L54.5,214.1 L54.7,213.9 L54.7,213.8 L54.8,213.6 L54.9,213.8 L55.0,213.8 L55.1,213.7 L55.5,213.6 L55.6,213.5 L55.6,213.6 L55.7,213.5 L55.9,213.5 L56.0,213.9 L56.1,213.8 L56.6,213.4 Z";

// Illustrated terrain cues — real Cape Fold Belt (Stellenbosch's own mountain
// system, points placed clear of the region shape/label) and Drakensberg.
const MOUNTAINS: { name: string; points: [number, number][] }[] = [
  { name: 'Cape Fold Belt', points: [[53.6, 189.9], [105.3, 213.5]] },
  { name: 'Drakensberg', points: [[207.0, 139.6], [199.6, 122.9]] },
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

export default function SouthAfricaRegionMap({ onSelectRegion }: Props) {
  const [pressed, setPressed] = useState(false);

  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" viewBox="0 0 280 246" preserveAspectRatio="xMidYMid meet">
        <Rect x={0} y={0} width={280} height={246} fill={Colors.cream} />
        <Path d={OUTLINE} fill={Colors.parchment} stroke={Colors.textMuted} strokeWidth={1.5} />

        {/* Terrain — real mountain range positions */}
        {MOUNTAINS.map(range => (
          <React.Fragment key={range.name}>
            {range.points.map(([x, y], i) => (
              <MountainPeak key={`${range.name}-${i}`} x={x} y={y} />
            ))}
          </React.Fragment>
        ))}

        <Path
          d={REGION_PATH}
          fill={'#B89E51'}
          fillOpacity={pressed ? 0.65 : 0.88}
          stroke={Colors.cream}
          strokeWidth={1.5}
          strokeLinejoin="round"
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          onPress={() => onSelectRegion('stellenbosch')}
        />

        <Path d={OUTLINE} fill="none" stroke={Colors.text} strokeWidth={1.5} strokeOpacity={0.4} />

        {/* Stellenbosch is genuinely tiny next to all of South Africa — a leader ties the label back to the real shape */}
        <Line
          x1={54.4}
          y1={215.0}
          x2={92}
          y2={188}
          stroke={Colors.text}
          strokeWidth={0.6}
          strokeOpacity={0.45}
          pointerEvents="none"
        />

        <SvgText
          x={96}
          y={185}
          fontSize={11}
          fontWeight="800"
          fill={Colors.text}
          textAnchor="start"
          pointerEvents="none"
        >
          Stellenbosch
        </SvgText>
        <SvgText
          x={96}
          y={196}
          fontSize={7}
          fontWeight="500"
          fill={Colors.textSecondary}
          textAnchor="start"
          pointerEvents="none"
        >
          Cabernet · Pinotage
        </SvgText>
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
