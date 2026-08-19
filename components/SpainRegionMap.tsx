import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Text as SvgText, Defs, ClipPath, Rect, G, Line } from 'react-native-svg';
import { Colors } from '../constants/colors';

// Real Spain national outline (same projection as France/Italy/USA).
const SPAIN_OUTLINE =
  'M23.7,68.8 L24.8,48.6 L16.0,36.4 L46.5,16.0 L72.9,21.1 L101.8,20.9 L124.8,25.7 L142.7,24.3 L177.5,25.2 ' +
  'L186.1,36.2 L225.8,49.0 L233.6,42.9 L257.9,55.7 L282.8,52.0 L284.0,68.4 L263.6,87.3 L236.0,93.2 L234.0,102.7 ' +
  'L220.8,118.4 L212.5,141.4 L220.9,157.5 L208.4,170.1 L203.7,188.5 L187.5,194.1 L172.2,215.9 L144.8,216.3 ' +
  'L124.3,215.8 L110.8,225.7 L102.6,236.4 L92.0,234.1 L84.0,224.5 L77.9,208.3 L57.8,203.9 L56.0,194.5 ' +
  'L64.0,183.9 L67.0,176.3 L59.5,167.9 L65.5,149.3 L56.8,132.4 L66.1,130.0 L67.0,116.7 L70.5,112.5 L70.8,90.5 ' +
  'L80.8,82.9 L74.7,68.7 L62.2,67.7 L58.5,71.3 L45.7,71.3 L40.3,57.5 L31.5,61.6 Z';

// Rioja: no single official DOCa boundary polygon was found in open data (it spans
// three Spanish autonomous communities), so this is traced along the Ebro valley
// through the region's defining towns (Haro to Alfaro) — a researched approximation.
const PATH_RIOJA = "M154.1,57.5 L154.9,57.7 L157.8,58.5 L161.5,60.1 L166.3,63.1 L167.0,63.5 L167.8,63.9 L168.6,64.2 L172.1,65.1 L175.6,67.6 L176.3,68.1 L177.1,68.5 L178.0,68.8 L178.8,69.1 L179.7,69.2 L180.6,69.3 L181.4,69.3 L182.3,69.2 L183.2,69.0 L184.0,68.7 L184.8,68.3 L185.6,67.9 L186.3,67.4 L187.0,66.8 L187.6,66.2 L188.1,65.5 L188.6,64.8 L189.0,64.0 L189.3,63.1 L189.6,62.3 L189.7,61.4 L189.8,60.5 L189.8,59.7 L189.7,58.8 L189.5,57.9 L189.2,57.1 L188.8,56.3 L188.4,55.5 L187.9,54.8 L187.3,54.1 L186.7,53.5 L186.0,53.0 L181.2,49.6 L180.3,49.0 L179.4,48.6 L178.5,48.2 L174.8,47.2 L170.5,44.5 L169.9,44.2 L169.3,43.9 L164.3,41.7 L163.6,41.4 L162.8,41.2 L159.5,40.4 L156.7,39.4 L155.9,39.1 L155.0,39.0 L154.1,38.9 L153.2,38.9 L152.4,39.0 L151.5,39.2 L150.7,39.5 L149.9,39.8 L149.1,40.2 L148.3,40.7 L147.7,41.3 L147.1,41.9 L146.5,42.6 L146.0,43.4 L145.6,44.2 L145.3,45.0 L145.0,45.8 L144.9,46.7 L144.8,47.6 L144.8,48.5 L144.9,49.3 L145.1,50.2 L145.4,51.0 L145.7,51.8 L146.1,52.6 L146.6,53.4 L147.2,54.0 L147.8,54.6 L148.5,55.2 L149.3,55.7 L150.1,56.1 L150.9,56.4 L154.1,57.5 Z";

// Ribera del Duero: same situation as Rioja (no official boundary polygon in open
// data). Traced along the Duero valley through defining towns (San Esteban de
// Gormaz to Tudela de Duero).
const PATH_RIBERA = "M129.9,83.7 L130.6,83.7 L131.2,83.6 L131.9,83.4 L132.5,83.2 L133.1,82.9 L133.7,82.6 L135.5,81.4 L137.3,81.6 L141.9,83.3 L142.5,83.5 L143.2,83.6 L148.4,84.4 L149.1,84.5 L149.8,84.5 L150.5,84.4 L151.2,84.3 L151.8,84.1 L152.5,83.8 L153.1,83.5 L153.6,83.1 L154.2,82.7 L154.7,82.2 L155.1,81.7 L155.5,81.1 L155.8,80.5 L156.1,79.9 L156.3,79.2 L156.4,78.6 L156.5,77.9 L156.5,77.2 L156.4,76.5 L156.3,75.8 L156.1,75.2 L155.8,74.5 L155.5,73.9 L155.1,73.4 L154.7,72.8 L154.2,72.3 L153.7,71.9 L153.1,71.5 L152.5,71.2 L151.9,70.9 L151.2,70.7 L150.6,70.6 L146.1,69.9 L141.3,68.1 L140.8,68.0 L140.2,67.8 L139.6,67.7 L134.5,67.2 L133.8,67.2 L133.1,67.2 L132.5,67.3 L131.8,67.5 L131.2,67.7 L130.6,68.0 L130.0,68.3 L127.8,69.7 L119.3,69.7 L118.6,69.7 L117.9,69.8 L117.3,70.0 L116.6,70.2 L116.0,70.5 L115.4,70.9 L114.9,71.3 L114.4,71.8 L113.9,72.3 L113.5,72.8 L113.1,73.4 L112.8,74.0 L112.6,74.7 L112.4,75.3 L112.3,76.0 L112.3,76.7 L112.3,77.4 L112.4,78.1 L112.6,78.7 L112.8,79.4 L113.1,80.0 L113.5,80.6 L113.9,81.1 L114.4,81.6 L114.9,82.1 L115.4,82.5 L116.0,82.9 L116.6,83.2 L117.3,83.4 L117.9,83.6 L118.6,83.7 L119.3,83.7 L129.9,83.7 Z";

// Priorat: real Catalan comarca boundary (OpenStreetMap administrative relation) —
// the wine region and the comarca are the same area.
const PATH_PRIORAT = "M236.7,83.4 L236.7,83.6 L237.1,84.1 L238.0,83.8 L238.1,84.0 L238.0,84.4 L238.7,84.6 L238.8,85.0 L238.7,85.3 L238.9,85.5 L239.2,85.2 L239.4,85.3 L239.4,85.9 L239.5,86.3 L239.5,86.3 L239.4,86.2 L238.8,86.7 L238.3,86.8 L238.1,86.9 L238.2,87.3 L238.3,87.6 L238.4,87.9 L238.2,88.1 L238.0,88.1 L237.5,88.1 L237.4,88.3 L237.4,88.5 L238.0,88.6 L237.9,88.7 L238.0,89.0 L237.7,89.7 L237.7,90.0 L237.5,90.3 L237.4,90.5 L237.1,90.5 L236.9,90.5 L236.4,90.2 L236.3,90.3 L236.4,90.4 L236.5,90.4 L236.7,90.8 L236.4,90.9 L236.3,90.9 L236.2,91.2 L236.3,91.2 L236.3,91.5 L236.1,91.6 L236.1,91.6 L236.1,91.8 L235.8,91.8 L235.7,91.7 L235.5,91.6 L235.4,91.4 L235.1,91.3 L235.0,91.0 L234.9,91.3 L234.7,91.2 L234.6,91.1 L234.4,90.9 L234.3,90.7 L233.8,90.7 L233.9,90.6 L233.7,90.2 L233.6,90.1 L233.6,90.1 L233.5,90.0 L233.4,90.0 L233.4,89.9 L233.5,89.9 L233.5,89.8 L233.1,89.0 L233.1,88.8 L232.7,88.4 L232.7,88.3 L232.9,88.2 L233.2,88.0 L233.3,88.0 L233.3,87.9 L233.7,87.5 L233.3,87.3 L233.3,87.0 L233.2,86.8 L233.4,86.6 L233.5,86.4 L233.6,86.3 L233.6,86.1 L233.5,85.7 L233.6,85.6 L233.7,85.5 L233.8,85.3 L233.9,85.3 L233.9,85.1 L234.2,84.9 L234.7,84.8 L234.7,84.7 L234.7,84.5 L234.9,84.2 L235.5,84.3 L235.6,84.4 L235.8,84.3 L236.0,84.4 L236.1,84.4 L236.4,83.5 L236.7,83.4 Z";

export interface SpainRegion {
  id: string;
  name: string;
  path: string;
  color: string;
  labelX: number;
  labelY: number;
  labelDx?: number;
  labelDy?: number;
}

const REGIONS: SpainRegion[] = [
  { id: 'rioja', name: 'Rioja', path: PATH_RIOJA, color: '#B54B3A', labelX: 167.5, labelY: 53.7 },
  { id: 'ribera-del-duero', name: 'Ribera del Duero', path: PATH_RIBERA, color: Colors.primary, labelX: 134.4, labelY: 76.3, labelDy: 20 },
  { id: 'priorat', name: 'Priorat', path: PATH_PRIORAT, color: Colors.gold, labelX: 236.0, labelY: 87.4, labelDx: 26 },
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
            <Path
              key={region.id}
              d={region.path}
              fill={region.color}
              fillOpacity={pressedId === region.id ? 0.65 : 0.88}
              stroke={Colors.cream}
              strokeWidth={2}
              strokeLinejoin="round"
              onPressIn={() => handlePressIn(region.id)}
              onPressOut={handlePressOut}
              onPress={() => onSelectRegion(region.id)}
            />
          ))}
        </G>

        <Path d={SPAIN_OUTLINE} fill="none" stroke={Colors.text} strokeWidth={1.5} strokeOpacity={0.4} />

        {/* Priorat is genuinely tiny (Spain's smallest DOQa) — a leader line ties its label back to the shape */}
        <Line
          x1={236.0}
          y1={87.4}
          x2={257}
          y2={87.4}
          stroke={Colors.text}
          strokeWidth={0.6}
          strokeOpacity={0.45}
          pointerEvents="none"
        />

        {REGIONS.map(region => (
          <SvgText
            key={`label-${region.id}`}
            x={region.labelX + (region.labelDx ?? 0)}
            y={region.labelY + (region.labelDy ?? 4)}
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
