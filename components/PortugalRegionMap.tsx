import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Ellipse, Text as SvgText, Rect } from 'react-native-svg';
import { Colors } from '../constants/colors';

// Real Portugal national outline (simplified from public boundary data,
// same equirectangular + cos-latitude-corrected projection as the other maps).
const OUTLINE = 'M42.9,44.5 L62.8,26.4 L85.2,16.0 L98.9,50.9 L131.3,50.8 L140.7,41.8 L172.6,44.3 L187.9,80.1 L162.6,99.4 L161.9,155.0 L153.0,165.4 L150.8,199.1 L127.1,205.0 L149.1,247.7 L134.0,294.6 L152.9,315.8 L145.3,335.2 L125.0,361.9 L129.6,385.5 L107.6,404.0 L78.7,394.0 L50.4,401.8 L58.8,346.0 L53.6,302.2 L29.1,295.6 L16.0,268.6 L20.4,221.9 L42.2,196.0 L46.1,167.2 L57.5,124.4 L56.3,94.1 L45.4,68.5 L42.9,44.5 Z';

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

        <Ellipse
          cx={121.6}
          cy={100.2}
          rx={49.3}
          ry={35.6}
          rotation={15}
          origin="121.6, 100.2"
          fill={'#B54B3A'}
          fillOpacity={pressed ? 0.65 : 0.88}
          stroke={Colors.cream}
          strokeWidth={2}
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          onPress={() => onSelectRegion('douro')}
        />

        <Path d={OUTLINE} fill="none" stroke={Colors.text} strokeWidth={1.5} strokeOpacity={0.4} />

        <SvgText
          x={121.6}
          y={97.2}
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
          x={121.6}
          y={108.2}
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
