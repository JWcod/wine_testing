import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Text as SvgText, Rect, Line } from 'react-native-svg';
import { Colors } from '../constants/colors';

// Real Australia national outline (simplified from public boundary data,
// same equirectangular + cos-latitude-corrected projection as the other maps).
const OUTLINE = 'M195.5,36.1 L197.6,41.2 L201.4,38.7 L203.4,41.5 L206.2,44.0 L205.6,46.9 L206.9,52.4 L207.8,55.7 L209.3,56.5 L210.9,62.0 L210.3,65.4 L212.3,69.8 L218.7,73.2 L222.9,76.2 L226.9,79.1 L226.1,80.6 L229.5,84.7 L231.8,91.7 L234.2,90.3 L236.6,93.1 L238.0,92.1 L239.0,99.0 L243.3,103.0 L246.0,105.4 L250.7,110.7 L252.3,115.9 L252.5,119.6 L252.1,123.6 L254.9,129.1 L254.6,134.9 L253.5,137.9 L251.9,143.7 L252.0,147.4 L250.9,152.0 L248.3,157.9 L243.9,161.1 L241.7,166.1 L239.7,169.3 L237.9,174.9 L235.7,178.2 L234.1,183.0 L233.4,187.5 L233.7,189.6 L230.3,191.8 L223.6,192.0 L218.2,194.7 L215.4,197.2 L211.8,200.0 L206.9,197.1 L203.3,196.0 L204.2,192.6 L201.0,193.8 L195.8,198.5 L190.6,196.8 L187.3,195.7 L183.9,195.3 L178.1,193.4 L174.3,189.4 L173.2,184.5 L171.8,181.2 L168.9,178.6 L163.2,177.8 L165.1,174.6 L163.7,169.8 L160.8,174.3 L155.5,175.5 L158.6,171.9 L159.5,168.2 L161.8,165.0 L161.3,160.2 L156.5,165.7 L152.8,168.0 L150.5,173.1 L145.9,170.4 L146.0,167.0 L142.3,162.3 L139.2,159.9 L140.3,158.4 L132.7,154.4 L128.5,154.3 L122.8,151.1 L112.2,151.7 L104.5,154.0 L97.7,156.2 L92.1,155.8 L85.8,159.1 L80.6,160.6 L79.5,164.0 L77.3,166.6 L72.2,166.8 L68.5,167.4 L63.3,166.2 L59.0,166.9 L54.9,167.2 L51.4,170.6 L49.7,170.3 L46.7,172.2 L43.8,174.2 L39.5,174.0 L35.5,174.0 L29.2,169.8 L26.0,168.6 L26.2,164.9 L29.1,164.0 L30.1,162.5 L29.9,160.2 L30.6,155.7 L30.0,151.9 L26.8,145.3 L25.8,141.6 L26.1,137.9 L23.7,133.7 L23.6,131.8 L21.0,129.2 L20.2,124.1 L16.8,119.0 L16.0,116.2 L18.6,119.0 L16.6,113.0 L19.6,114.9 L21.3,117.4 L21.2,114.1 L18.3,109.0 L17.7,106.9 L16.3,105.0 L17.0,101.2 L18.2,99.6 L19.0,96.4 L18.4,92.6 L20.8,87.9 L21.3,92.9 L23.8,88.4 L28.6,86.2 L31.5,83.5 L36.0,81.1 L38.7,80.6 L40.4,81.4 L45.0,79.0 L48.6,78.2 L49.5,76.8 L51.1,76.2 L54.4,76.4 L60.6,74.5 L63.9,71.6 L65.4,68.1 L68.9,64.8 L69.1,62.2 L69.3,58.7 L73.4,53.2 L75.9,58.8 L78.5,57.5 L76.4,54.5 L78.2,51.3 L80.8,52.7 L81.6,47.8 L84.8,44.6 L86.2,42.0 L89.2,40.9 L89.3,39.1 L91.9,39.9 L92.0,38.2 L94.6,37.3 L97.5,36.4 L101.9,39.4 L105.2,43.2 L108.9,43.3 L112.7,43.9 L111.4,40.3 L114.3,35.1 L117.0,33.4 L116.0,31.8 L118.6,28.1 L122.2,25.8 L125.2,26.6 L130.2,25.4 L130.1,22.1 L125.8,19.9 L128.9,19.0 L132.9,20.6 L136.0,23.3 L141.0,24.9 L142.7,24.3 L146.4,26.3 L149.9,24.4 L152.1,25.0 L153.5,23.7 L156.2,26.9 L154.6,30.4 L152.4,33.0 L150.3,33.2 L151.0,35.8 L149.3,39.1 L147.2,42.3 L147.6,44.1 L152.3,47.7 L156.9,49.7 L160.0,52.0 L164.2,55.8 L165.9,55.8 L169.0,57.5 L169.9,59.5 L175.6,61.7 L179.5,59.5 L180.7,56.0 L181.9,53.1 L182.6,49.5 L184.4,44.4 L183.6,41.3 L184.0,39.4 L183.3,35.7 L184.1,30.8 L185.3,29.4 L184.3,27.3 L185.8,23.8 L186.9,20.3 L187.1,18.4 L189.3,16.0 L190.9,19.2 L191.3,23.2 L192.8,24.0 L193.1,26.8 L195.2,30.1 L195.7,33.7 L195.5,36.1 Z';

const REGION_PATH = "M169.0,170.8 L169.0,171.1 L169.0,171.2 L169.0,171.4 L169.3,171.4 L169.3,171.5 L169.4,171.9 L169.3,171.9 L169.3,172.3 L168.9,172.3 L168.8,172.4 L168.9,172.4 L168.6,172.6 L168.4,172.5 L168.4,172.5 L168.3,172.4 L168.3,172.3 L168.1,172.4 L168.1,172.3 L167.9,172.3 L168.0,172.2 L167.9,172.2 L167.9,172.2 L167.9,172.1 L167.9,172.1 L167.8,171.9 L167.7,171.9 L167.6,171.9 L167.6,171.9 L167.4,171.7 L167.4,171.7 L167.1,171.6 L167.1,171.6 L167.2,171.6 L167.1,171.5 L167.2,171.5 L167.1,171.5 L167.0,171.4 L167.1,171.4 L167.0,171.3 L167.1,171.3 L167.1,171.2 L166.9,171.2 L166.9,171.1 L166.9,171.1 L167.0,171.0 L167.0,171.0 L167.1,171.0 L167.2,170.9 L167.2,170.9 L167.2,171.0 L167.3,171.0 L167.4,171.0 L167.4,170.9 L167.5,171.0 L167.6,170.9 L167.6,171.0 L167.6,171.0 L167.6,171.0 L167.6,171.1 L167.8,171.0 L167.9,171.1 L167.9,171.1 L167.9,171.1 L168.0,171.0 L168.1,170.9 L168.0,170.8 L168.1,170.8 L168.2,170.6 L168.2,170.6 L168.3,170.5 L168.2,170.5 L168.3,170.4 L168.2,170.3 L168.4,170.3 L168.7,170.1 L169.0,170.0 L169.0,170.0 L169.0,170.2 L169.1,170.2 L169.4,170.5 L169.3,170.5 L169.3,170.6 L169.2,170.6 L169.1,170.8 L169.0,170.8 Z";

// Illustrated terrain cue — the Great Dividing Range, eastern Australia's
// defining mountain chain (Barossa Ranges sit right on top of the tiny
// highlighted valley itself, so a separate local marker would just cover it).
const MOUNTAINS: { name: string; points: [number, number][] }[] = [
  { name: 'Great Dividing Range', points: [[206.9, 56.2], [220.4, 98.9], [243.8, 128.0], [232.1, 163.5], [223.3, 189.4]] },
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

export default function AustraliaRegionMap({ onSelectRegion }: Props) {
  const [pressed, setPressed] = useState(false);

  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" viewBox="0 0 330 216" preserveAspectRatio="xMidYMid meet">
        <Rect x={0} y={0} width={330} height={216} fill={Colors.cream} />
        <Path d={OUTLINE} fill={Colors.parchment} stroke={Colors.textMuted} strokeWidth={1.5} />

        <Path
          d={REGION_PATH}
          fill={'#722F37'}
          fillOpacity={pressed ? 0.65 : 0.88}
          stroke={Colors.cream}
          strokeWidth={1.5}
          strokeLinejoin="round"
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          onPress={() => onSelectRegion('barossa-valley')}
        />

        <Path d={OUTLINE} fill="none" stroke={Colors.text} strokeWidth={1.5} strokeOpacity={0.4} />

        {/* Barossa Valley is genuinely tiny next to all of Australia — a leader ties the label back to the real shape */}
        <Line
          x1={168.4}
          y1={171}
          x2={200}
          y2={148}
          stroke={Colors.text}
          strokeWidth={0.6}
          strokeOpacity={0.45}
          pointerEvents="none"
        />

        <SvgText
          x={204}
          y={145}
          fontSize={11}
          fontWeight="800"
          fill={Colors.text}
          textAnchor="start"
          pointerEvents="none"
        >
          Barossa Valley
        </SvgText>
        <SvgText
          x={204}
          y={156}
          fontSize={7}
          fontWeight="500"
          fill={Colors.textSecondary}
          textAnchor="start"
          pointerEvents="none"
        >
          Shiraz
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
