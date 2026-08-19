import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Ellipse, Text as SvgText, Rect } from 'react-native-svg';
import { Colors } from '../constants/colors';

// Real Germany national outline (simplified from public boundary data,
// same equirectangular + cos-latitude-corrected projection as the other maps).
const OUTLINE = 'M124.0,16.0 L124.5,32.9 L152.3,43.1 L152.0,58.6 L179.9,50.4 L195.4,38.4 L226.4,55.7 L239.4,69.6 L245.8,91.8 L238.1,103.5 L248.1,119.1 L254.9,142.5 L252.7,157.5 L264.0,185.4 L251.7,190.0 L244.5,185.0 L237.6,193.3 L217.9,201.8 L207.7,212.7 L187.7,222.2 L192.5,235.2 L195.4,253.6 L209.5,264.1 L225.0,282.9 L215.3,303.0 L205.4,308.6 L209.3,337.1 L206.7,344.5 L198.2,335.6 L185.0,334.2 L165.4,342.1 L141.1,340.2 L137.2,351.7 L123.3,339.6 L115.0,342.0 L85.6,328.6 L80.0,338.1 L56.6,337.8 L60.1,306.7 L74.0,276.7 L34.4,268.7 L21.4,257.3 L23.0,238.1 L17.5,228.2 L20.6,198.7 L16.0,152.9 L32.5,152.9 L39.5,136.4 L46.3,96.4 L41.2,81.6 L46.5,72.4 L69.5,70.0 L74.6,79.6 L93.2,58.1 L87.0,41.7 L85.7,16.9 L106.5,22.7 L124.0,16.0 Z';

interface Props {
  onSelectRegion: (regionId: string) => void;
}

export default function GermanyRegionMap({ onSelectRegion }: Props) {
  const [pressed, setPressed] = useState(false);

  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" viewBox="0 0 280 379" preserveAspectRatio="xMidYMid meet">
        <Rect x={0} y={0} width={280} height={379} fill={Colors.cream} />
        <Path d={OUTLINE} fill={Colors.parchment} stroke={Colors.textMuted} strokeWidth={1.5} />

        <Ellipse
          cx={41.0}
          cy={238.2}
          rx={9.6}
          ry={39.3}
          rotation={20}
          origin="41.0, 238.2"
          fill={'#8FAF6E'}
          fillOpacity={pressed ? 0.65 : 0.88}
          stroke={Colors.cream}
          strokeWidth={2}
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          onPress={() => onSelectRegion('mosel')}
        />

        <Path d={OUTLINE} fill="none" stroke={Colors.text} strokeWidth={1.5} strokeOpacity={0.4} />

        <SvgText
          x={41.0}
          y={235.2}
          fontSize={11}
          fontWeight="800"
          fill={Colors.white}
          textAnchor="middle"
          stroke={Colors.text}
          strokeWidth={0.35}
          pointerEvents="none"
        >
          Mosel
        </SvgText>
        <SvgText
          x={41.0}
          y={246.2}
          fontSize={7}
          fontWeight="500"
          fill={Colors.white}
          textAnchor="middle"
          stroke={Colors.text}
          strokeWidth={0.25}
          pointerEvents="none"
        >
          Riesling
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
