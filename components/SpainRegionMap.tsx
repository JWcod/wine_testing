import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Ellipse, Text as SvgText, Defs, ClipPath, Rect, G } from 'react-native-svg';
import { Colors } from '../constants/colors';

// Real Spain national outline (same projection as France/Italy/USA).
const SPAIN_OUTLINE =
  'M23.7,68.8 L24.8,48.6 L16.0,36.4 L46.5,16.0 L72.9,21.1 L101.8,20.9 L124.8,25.7 L142.7,24.3 L177.5,25.2 ' +
  'L186.1,36.2 L225.8,49.0 L233.6,42.9 L257.9,55.7 L282.8,52.0 L284.0,68.4 L263.6,87.3 L236.0,93.2 L234.0,102.7 ' +
  'L220.8,118.4 L212.5,141.4 L220.9,157.5 L208.4,170.1 L203.7,188.5 L187.5,194.1 L172.2,215.9 L144.8,216.3 ' +
  'L124.3,215.8 L110.8,225.7 L102.6,236.4 L92.0,234.1 L84.0,224.5 L77.9,208.3 L57.8,203.9 L56.0,194.5 ' +
  'L64.0,183.9 L67.0,176.3 L59.5,167.9 L65.5,149.3 L56.8,132.4 L66.1,130.0 L67.0,116.7 L70.5,112.5 L70.8,90.5 ' +
  'L80.8,82.9 L74.7,68.7 L62.2,67.7 L58.5,71.3 L45.7,71.3 L40.3,57.5 L31.5,61.6 Z';

export interface SpainRegion {
  id: string;
  name: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rotation: number;
  color: string;
  labelDx?: number;
  labelDy?: number;
}

const REGIONS: SpainRegion[] = [
  { id: 'rioja', name: 'Rioja', cx: 165.7, cy: 52.2, rx: 19.4, ry: 9.9, rotation: -10, color: '#B54B3A' },
  { id: 'ribera-del-duero', name: 'Ribera del Duero', cx: 138.7, cy: 73.9, rx: 23.7, ry: 9.9, rotation: -6, color: Colors.primary, labelDy: 22 },
  { id: 'priorat', name: 'Priorat', cx: 235.7, cy: 88.0, rx: 7.5, ry: 9.9, rotation: 0, color: Colors.gold, labelDx: 20 },
];

interface Props {
  onSelectRegion: (regionId: string) => void;
}

export default function SpainRegionMap({ onSelectRegion }: Props) {
  const [pressedId, setPressedId] = useState<string | null>(null);
  const handlePressIn = useCallback((id: string) => setPressedId(id), []);
  const handlePressOut = useCallback(() => setPressedId(null), []);

  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" viewBox="0 0 300 260" preserveAspectRatio="xMidYMid meet">
        <Defs>
          <ClipPath id="spainClip"><Path d={SPAIN_OUTLINE} /></ClipPath>
        </Defs>

        <Rect x={0} y={0} width={300} height={260} fill={Colors.cream} />
        <Path d={SPAIN_OUTLINE} fill={Colors.parchment} stroke={Colors.textMuted} strokeWidth={1.5} />

        <G clipPath="url(#spainClip)">
          {REGIONS.map(region => (
            <Ellipse
              key={region.id}
              cx={region.cx}
              cy={region.cy}
              rx={region.rx}
              ry={region.ry}
              fill={region.color}
              fillOpacity={pressedId === region.id ? 0.65 : 0.88}
              stroke={Colors.cream}
              strokeWidth={2}
              rotation={region.rotation}
              origin={`${region.cx}, ${region.cy}`}
              onPressIn={() => handlePressIn(region.id)}
              onPressOut={handlePressOut}
              onPress={() => onSelectRegion(region.id)}
            />
          ))}
        </G>

        <Path d={SPAIN_OUTLINE} fill="none" stroke={Colors.text} strokeWidth={1.5} strokeOpacity={0.4} />

        {REGIONS.map(region => (
          <SvgText
            key={`label-${region.id}`}
            x={region.cx + (region.labelDx ?? 0)}
            y={region.cy + (region.labelDy ?? 4)}
            fontSize={11}
            fontWeight="700"
            fill={region.id === 'priorat' ? Colors.text : Colors.white}
            textAnchor={region.labelDx ? (region.labelDx > 0 ? 'start' : 'end') : 'middle'}
            stroke={region.id === 'priorat' ? 'none' : Colors.text}
            strokeWidth={0.4}
            pointerEvents="none"
          >
            {region.name}
          </SvgText>
        ))}
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
