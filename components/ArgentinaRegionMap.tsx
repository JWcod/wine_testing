import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Ellipse, Text as SvgText, Rect } from 'react-native-svg';
import { Colors } from '../constants/colors';

// Real Argentina national outline (simplified from public boundary data,
// same equirectangular + cos-latitude-corrected projection as the other maps).
const OUTLINE = 'M101.9,19.1 L107.8,28.3 L111.8,18.1 L123.4,18.6 L125.0,21.3 L143.7,42.0 L152.0,44.0 L164.4,53.4 L174.9,58.3 L176.4,63.9 L166.4,83.3 L176.6,86.7 L188.0,88.7 L196.1,86.6 L205.3,76.9 L206.9,65.7 L212.0,63.2 L217.1,70.6 L216.9,80.7 L208.3,87.7 L201.5,92.9 L190.0,105.3 L176.5,122.6 L173.9,132.8 L171.2,145.8 L171.3,158.5 L169.1,161.3 L168.3,169.5 L167.6,176.2 L180.5,187.1 L179.1,195.8 L185.5,201.4 L185.0,207.6 L175.2,223.9 L160.1,230.7 L139.7,233.4 L128.6,232.1 L130.7,239.7 L128.6,249.2 L130.5,255.6 L124.4,260.1 L114.0,261.8 L104.2,257.2 L100.3,260.5 L101.7,273.1 L108.6,277.0 L114.2,273.0 L117.2,279.6 L107.8,283.5 L99.7,291.4 L98.2,304.2 L95.8,311.0 L86.2,311.1 L78.2,317.6 L75.3,327.1 L85.3,336.4 L95.0,339.0 L91.5,350.4 L79.5,357.6 L72.9,372.5 L63.6,377.5 L59.5,383.4 L62.7,396.6 L69.5,404.0 L65.2,403.4 L55.8,401.4 L31.2,399.7 L27.0,392.3 L27.2,382.7 L20.5,383.5 L16.9,378.9 L16.0,365.5 L23.8,359.9 L27.0,351.8 L25.8,345.4 L31.2,334.5 L34.9,317.7 L33.8,310.2 L38.3,307.8 L37.2,303.0 L32.5,300.5 L35.8,295.1 L31.2,290.3 L28.9,275.7 L33.0,273.1 L31.2,257.6 L33.6,244.5 L36.3,233.2 L42.4,228.6 L39.3,216.2 L39.3,204.5 L47.0,196.2 L46.8,185.6 L52.6,173.2 L52.6,161.5 L49.9,159.1 L45.3,137.2 L51.5,124.1 L50.6,111.8 L54.2,100.3 L60.9,88.3 L68.0,80.4 L65.0,75.4 L67.1,71.3 L66.8,50.2 L77.9,43.9 L81.3,30.7 L80.1,27.5 L88.6,16.0 L101.9,19.1 Z';

interface Props {
  onSelectRegion: (regionId: string) => void;
}

export default function ArgentinaRegionMap({ onSelectRegion }: Props) {
  const [pressed, setPressed] = useState(false);

  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" viewBox="0 0 280 420" preserveAspectRatio="xMidYMid meet">
        <Rect x={0} y={0} width={280} height={420} fill={Colors.cream} />
        <Path d={OUTLINE} fill={Colors.parchment} stroke={Colors.textMuted} strokeWidth={1.5} />

        <Ellipse
          cx={62.9}
          cy={156.7}
          rx={9.1}
          ry={16.5}
          rotation={0}
          origin="62.9, 156.7"
          fill={'#722F37'}
          fillOpacity={pressed ? 0.65 : 0.88}
          stroke={Colors.cream}
          strokeWidth={2}
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          onPress={() => onSelectRegion('mendoza')}
        />

        <Path d={OUTLINE} fill="none" stroke={Colors.text} strokeWidth={1.5} strokeOpacity={0.4} />

        <SvgText
          x={62.9}
          y={153.7}
          fontSize={11}
          fontWeight="800"
          fill={Colors.white}
          textAnchor="middle"
          stroke={Colors.text}
          strokeWidth={0.35}
          pointerEvents="none"
        >
          Mendoza
        </SvgText>
        <SvgText
          x={62.9}
          y={164.7}
          fontSize={7}
          fontWeight="500"
          fill={Colors.white}
          textAnchor="middle"
          stroke={Colors.text}
          strokeWidth={0.25}
          pointerEvents="none"
        >
          Malbec
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
