import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Text as SvgText, Rect } from 'react-native-svg';
import { Colors } from '../constants/colors';

// Real Portugal national outline (simplified from public boundary data,
// same equirectangular + cos-latitude-corrected projection as the other maps).
const OUTLINE = 'M42.9,44.5 L62.8,26.4 L85.2,16.0 L98.9,50.9 L131.3,50.8 L140.7,41.8 L172.6,44.3 L187.9,80.1 L162.6,99.4 L161.9,155.0 L153.0,165.4 L150.8,199.1 L127.1,205.0 L149.1,247.7 L134.0,294.6 L152.9,315.8 L145.3,335.2 L125.0,361.9 L129.6,385.5 L107.6,404.0 L78.7,394.0 L50.4,401.8 L58.8,346.0 L53.6,302.2 L29.1,295.6 L16.0,268.6 L20.4,221.9 L42.2,196.0 L46.1,167.2 L57.5,124.4 L56.3,94.1 L45.4,68.5 L42.9,44.5 Z';

// Real Douro DOC wine region, traced along the river through Mesão Frio, Peso da
// Régua, Pinhão and Vila Nova de Foz Côa to the Spanish border — the actual
// legally-defined wine region, not just the smaller "Alto Douro" UNESCO core zone.
const REGION_PATH = "M109.9,102.8 L110.5,102.9 L111.2,102.9 L111.8,102.9 L120.5,102.2 L121.0,102.1 L121.6,102.0 L122.2,101.8 L126.2,100.5 L129.8,99.7 L142.8,107.0 L143.3,107.3 L143.9,107.5 L144.4,107.7 L160.9,112.0 L161.6,112.1 L162.3,112.2 L163.0,112.2 L163.7,112.1 L164.3,112.0 L165.0,111.8 L165.6,111.6 L166.2,111.2 L166.8,110.9 L167.4,110.4 L167.8,109.9 L168.3,109.4 L168.7,108.9 L169.0,108.3 L169.3,107.6 L169.5,107.0 L169.6,106.3 L169.7,105.6 L169.7,104.9 L169.6,104.2 L169.5,103.6 L169.3,102.9 L169.1,102.3 L168.7,101.7 L168.4,101.1 L167.9,100.5 L167.4,100.1 L166.9,99.6 L166.4,99.2 L165.8,98.9 L165.1,98.6 L164.5,98.4 L148.8,94.4 L134.3,86.2 L133.7,85.9 L133.0,85.6 L132.3,85.4 L131.6,85.3 L130.9,85.3 L130.2,85.3 L129.4,85.5 L122.8,86.9 L122.0,87.1 L118.5,88.3 L111.6,88.8 L104.8,87.6 L104.1,87.5 L103.4,87.5 L102.7,87.5 L102.0,87.7 L101.4,87.8 L100.7,88.1 L100.1,88.4 L99.5,88.7 L99.0,89.2 L98.5,89.6 L98.0,90.1 L97.6,90.7 L97.3,91.3 L97.0,91.9 L96.8,92.6 L96.6,93.2 L96.5,93.9 L96.5,94.6 L96.5,95.3 L96.7,96.0 L96.8,96.6 L97.1,97.3 L97.4,97.9 L97.7,98.5 L98.2,99.0 L98.6,99.5 L99.1,100.0 L99.7,100.4 L100.3,100.7 L100.9,101.0 L101.6,101.2 L102.2,101.4 L109.9,102.8 Z";

// Illustrated terrain cues — real mountain range positions flanking the Douro
// (not literal elevation data; same convention as France/Italy/Spain).
const MOUNTAINS: { name: string; points: [number, number][] }[] = [
  { name: 'Serra do Marão', points: [[91.3, 74.6]] },
  { name: 'Serra da Estrela', points: [[114.2, 138.6]] },
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

export default function PortugalRegionMap({ onSelectRegion }: Props) {
  const [pressed, setPressed] = useState(false);

  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" viewBox="0 0 280 420" preserveAspectRatio="xMidYMid meet">
        <Rect x={0} y={0} width={280} height={420} fill={Colors.cream} />
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
          fill={'#B54B3A'}
          fillOpacity={pressed ? 0.65 : 0.88}
          stroke={Colors.cream}
          strokeWidth={1.5}
          strokeLinejoin="round"
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          onPress={() => onSelectRegion('douro')}
        />

        <Path d={OUTLINE} fill="none" stroke={Colors.text} strokeWidth={1.5} strokeOpacity={0.4} />

        <SvgText
          x={133.3}
          y={78}
          fontSize={11}
          fontWeight="800"
          fill={Colors.white}
          textAnchor="middle"
          stroke={Colors.text}
          strokeWidth={0.35}
          pointerEvents="none"
        >
          Douro Valley
        </SvgText>
        <SvgText
          x={133.3}
          y={89}
          fontSize={7}
          fontWeight="500"
          fill={Colors.white}
          textAnchor="middle"
          stroke={Colors.text}
          strokeWidth={0.25}
          pointerEvents="none"
        >
          Port · Touriga Nacional
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
