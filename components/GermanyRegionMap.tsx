import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Text as SvgText, Rect } from 'react-native-svg';
import { Colors } from '../constants/colors';

// Real Germany national outline (simplified from public boundary data,
// same equirectangular + cos-latitude-corrected projection as the other maps).
const OUTLINE = 'M124.0,16.0 L124.5,32.9 L152.3,43.1 L152.0,58.6 L179.9,50.4 L195.4,38.4 L226.4,55.7 L239.4,69.6 L245.8,91.8 L238.1,103.5 L248.1,119.1 L254.9,142.5 L252.7,157.5 L264.0,185.4 L251.7,190.0 L244.5,185.0 L237.6,193.3 L217.9,201.8 L207.7,212.7 L187.7,222.2 L192.5,235.2 L195.4,253.6 L209.5,264.1 L225.0,282.9 L215.3,303.0 L205.4,308.6 L209.3,337.1 L206.7,344.5 L198.2,335.6 L185.0,334.2 L165.4,342.1 L141.1,340.2 L137.2,351.7 L123.3,339.6 L115.0,342.0 L85.6,328.6 L80.0,338.1 L56.6,337.8 L60.1,306.7 L74.0,276.7 L34.4,268.7 L21.4,257.3 L23.0,238.1 L17.5,228.2 L20.6,198.7 L16.0,152.9 L32.5,152.9 L39.5,136.4 L46.3,96.4 L41.2,81.6 L46.5,72.4 L69.5,70.0 L74.6,79.6 L93.2,58.1 L87.0,41.7 L85.7,16.9 L106.5,22.7 L124.0,16.0 Z';

const REGION_PATH = "M43.0,245.8 L43.4,245.6 L43.8,245.3 L44.2,245.0 L48.9,241.1 L49.3,240.8 L49.6,240.4 L49.9,239.9 L52.9,235.1 L53.2,234.7 L53.4,234.3 L53.5,233.8 L53.6,233.3 L53.7,232.8 L53.7,232.3 L53.6,229.6 L56.5,227.2 L63.1,222.0 L63.5,221.7 L63.8,221.3 L64.1,221.0 L64.4,220.5 L64.6,220.1 L64.8,219.6 L64.9,219.2 L65.0,218.7 L65.0,218.2 L65.0,217.7 L64.9,217.2 L64.8,216.7 L64.7,216.3 L64.5,215.8 L64.2,215.4 L63.9,215.0 L63.6,214.6 L63.2,214.3 L62.9,214.0 L62.4,213.7 L62.0,213.5 L61.5,213.3 L61.1,213.2 L60.6,213.1 L60.1,213.1 L59.6,213.1 L59.1,213.2 L58.6,213.3 L58.2,213.4 L57.7,213.6 L57.3,213.9 L56.9,214.2 L50.3,219.4 L50.2,219.4 L45.3,223.4 L45.0,223.8 L44.6,224.2 L44.3,224.6 L44.1,225.0 L43.8,225.5 L43.7,226.0 L43.6,226.5 L43.5,227.0 L43.5,227.5 L43.6,231.2 L41.9,234.0 L38.4,236.9 L31.9,239.7 L31.5,239.9 L31.0,240.2 L30.7,240.5 L30.3,240.8 L30.0,241.2 L29.7,241.6 L29.4,242.0 L29.2,242.5 L29.1,242.9 L29.0,243.4 L28.9,243.9 L28.9,244.4 L28.9,244.9 L29.0,245.4 L29.1,245.8 L29.3,246.3 L29.5,246.7 L29.8,247.2 L30.1,247.5 L30.4,247.9 L30.8,248.2 L31.2,248.5 L31.6,248.8 L32.1,249.0 L32.5,249.1 L33.0,249.2 L33.5,249.3 L34.0,249.3 L34.5,249.3 L35.0,249.2 L35.4,249.1 L35.9,248.9 L43.0,245.8 Z";

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

        <Path
          d={REGION_PATH}
          fill={'#8FAF6E'}
          fillOpacity={pressed ? 0.65 : 0.88}
          stroke={Colors.cream}
          strokeWidth={1.5}
          strokeLinejoin="round"
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          onPress={() => onSelectRegion('mosel')}
        />

        <Path d={OUTLINE} fill="none" stroke={Colors.text} strokeWidth={1.5} strokeOpacity={0.4} />

        <SvgText
          x={47.4}
          y={228.8}
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
          x={47.4}
          y={239.8}
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
