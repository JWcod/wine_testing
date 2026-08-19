import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Path, Ellipse, Text as SvgText, Rect } from 'react-native-svg';
import Svg from 'react-native-svg';
import { Colors } from '../constants/colors';

// Real New Zealand outline — both main islands (simplified from public boundary
// data, same equirectangular + cos-latitude-corrected projection as the other maps).
const SOUTH_ISLAND = "M139.6,177.6 L143.9,187.9 L157.4,177.8 L162.9,188.3 L163.0,198.8 L155.9,210.4 L143.5,228.8 L133.8,238.9 L140.8,250.9 L126.1,251.2 L109.9,260.6 L104.8,277.0 L94.0,302.2 L79.1,313.4 L69.6,320.5 L52.1,320.0 L39.8,311.8 L19.2,310.0 L16.0,300.8 L26.2,282.3 L50.1,257.6 L62.3,252.9 L76.0,243.4 L92.2,230.4 L103.6,217.4 L112.1,198.8 L119.3,192.5 L122.1,178.5 L135.4,167.0 L139.6,177.6 Z";
const NORTH_ISLAND = "M169.9,58.6 L183.6,84.9 L184.0,67.8 L192.6,74.7 L195.4,93.6 L210.7,101.7 L223.5,103.7 L234.4,94.2 L244.0,97.1 L239.4,119.2 L233.6,133.8 L219.1,133.3 L214.1,140.9 L215.8,151.6 L213.0,156.3 L205.9,169.7 L196.4,186.8 L181.8,196.8 L178.5,190.2 L170.6,186.6 L181.5,166.1 L175.3,152.3 L154.9,142.4 L155.4,133.3 L169.1,124.6 L172.3,105.4 L171.5,89.2 L163.8,72.5 L164.3,68.1 L155.2,57.7 L140.3,35.6 L132.3,18.0 L139.4,16.0 L149.7,29.9 L164.5,36.4 L169.9,58.6 Z";

interface Props {
  onSelectRegion: (regionId: string) => void;
}

export default function NewZealandRegionMap({ onSelectRegion }: Props) {
  const [pressed, setPressed] = useState(false);

  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" viewBox="0 0 260 340" preserveAspectRatio="xMidYMid meet">
        <Rect x={0} y={0} width={260} height={340} fill={Colors.cream} />

        <Path d={NORTH_ISLAND} fill={Colors.parchment} stroke={Colors.textMuted} strokeWidth={1.5} />
        <Path d={SOUTH_ISLAND} fill={Colors.parchment} stroke={Colors.textMuted} strokeWidth={1.5} />

        <Ellipse
          cx={156.3}
          cy={192.1}
          rx={19}
          ry={15}
          rotation={-10}
          origin="156.3, 192.1"
          fill={Colors.primary}
          fillOpacity={pressed ? 0.65 : 0.88}
          stroke={Colors.cream}
          strokeWidth={2}
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          onPress={() => onSelectRegion('marlborough')}
        />

        <Path d={NORTH_ISLAND} fill="none" stroke={Colors.text} strokeWidth={1.5} strokeOpacity={0.4} />
        <Path d={SOUTH_ISLAND} fill="none" stroke={Colors.text} strokeWidth={1.5} strokeOpacity={0.4} />

        <SvgText x={156.3} y={189.1} fontSize={11} fontWeight="800" fill={Colors.white} textAnchor="middle" stroke={Colors.text} strokeWidth={0.35} pointerEvents="none">
          Marlborough
        </SvgText>
        <SvgText x={156.3} y={200} fontSize={7} fontWeight="500" fill={Colors.white} textAnchor="middle" stroke={Colors.text} strokeWidth={0.25} pointerEvents="none">
          Sauvignon Blanc
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
