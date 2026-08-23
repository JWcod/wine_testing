import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Text as SvgText, Rect } from 'react-native-svg';
import { Colors } from '../constants/colors';

// Real Argentina national outline (simplified from public boundary data,
// same equirectangular + cos-latitude-corrected projection as the other maps).
const OUTLINE = 'M101.9,19.1 L107.8,28.3 L111.8,18.1 L123.4,18.6 L125.0,21.3 L143.7,42.0 L152.0,44.0 L164.4,53.4 L174.9,58.3 L176.4,63.9 L166.4,83.3 L176.6,86.7 L188.0,88.7 L196.1,86.6 L205.3,76.9 L206.9,65.7 L212.0,63.2 L217.1,70.6 L216.9,80.7 L208.3,87.7 L201.5,92.9 L190.0,105.3 L176.5,122.6 L173.9,132.8 L171.2,145.8 L171.3,158.5 L169.1,161.3 L168.3,169.5 L167.6,176.2 L180.5,187.1 L179.1,195.8 L185.5,201.4 L185.0,207.6 L175.2,223.9 L160.1,230.7 L139.7,233.4 L128.6,232.1 L130.7,239.7 L128.6,249.2 L130.5,255.6 L124.4,260.1 L114.0,261.8 L104.2,257.2 L100.3,260.5 L101.7,273.1 L108.6,277.0 L114.2,273.0 L117.2,279.6 L107.8,283.5 L99.7,291.4 L98.2,304.2 L95.8,311.0 L86.2,311.1 L78.2,317.6 L75.3,327.1 L85.3,336.4 L95.0,339.0 L91.5,350.4 L79.5,357.6 L72.9,372.5 L63.6,377.5 L59.5,383.4 L62.7,396.6 L69.5,404.0 L65.2,403.4 L55.8,401.4 L31.2,399.7 L27.0,392.3 L27.2,382.7 L20.5,383.5 L16.9,378.9 L16.0,365.5 L23.8,359.9 L27.0,351.8 L25.8,345.4 L31.2,334.5 L34.9,317.7 L33.8,310.2 L38.3,307.8 L37.2,303.0 L32.5,300.5 L35.8,295.1 L31.2,290.3 L28.9,275.7 L33.0,273.1 L31.2,257.6 L33.6,244.5 L36.3,233.2 L42.4,228.6 L39.3,216.2 L39.3,204.5 L47.0,196.2 L46.8,185.6 L52.6,173.2 L52.6,161.5 L49.9,159.1 L45.3,137.2 L51.5,124.1 L50.6,111.8 L54.2,100.3 L60.9,88.3 L68.0,80.4 L65.0,75.4 L67.1,71.3 L66.8,50.2 L77.9,43.9 L81.3,30.7 L80.1,27.5 L88.6,16.0 L101.9,19.1 Z';

const REGION_PATH = "M56.7,146.1 L57.7,146.4 L58.4,145.5 L59.7,145.3 L60.7,146.7 L61.7,146.9 L61.7,149.6 L64.3,149.6 L66.3,148.3 L66.3,147.0 L68.0,147.0 L68.5,146.4 L69.5,146.8 L70.5,146.2 L71.7,146.7 L72.7,148.1 L75.9,148.1 L76.4,149.2 L77.8,149.7 L78.2,152.1 L79.5,154.9 L78.8,156.5 L79.4,158.0 L79.8,163.9 L81.1,166.5 L82.4,167.8 L82.5,168.6 L84.6,170.2 L83.9,172.4 L84.0,173.4 L83.4,173.7 L83.1,175.1 L83.6,175.5 L83.3,175.9 L83.7,176.3 L83.6,177.7 L84.9,179.8 L84.7,180.3 L85.6,181.2 L85.9,183.6 L86.5,185.2 L85.1,195.8 L84.9,196.1 L68.0,196.1 L68.0,198.3 L68.5,198.3 L68.5,216.1 L66.6,215.8 L65.9,214.6 L63.9,214.5 L63.2,213.5 L62.2,213.9 L60.6,213.5 L60.2,211.7 L58.1,210.7 L55.5,211.1 L53.6,210.1 L53.0,208.7 L53.2,207.2 L51.5,206.2 L51.2,205.3 L48.9,202.4 L48.5,200.4 L47.2,200.4 L46.7,198.6 L46.9,196.1 L46.4,195.8 L47.0,195.2 L46.4,195.0 L46.4,194.6 L47.5,193.8 L46.9,193.4 L47.1,192.9 L46.4,191.6 L46.8,191.1 L46.5,190.1 L47.0,190.0 L46.2,189.3 L46.3,187.5 L44.8,186.8 L45.3,185.9 L46.9,185.6 L47.0,183.5 L48.2,180.9 L47.6,180.2 L48.5,179.4 L48.5,178.5 L49.4,176.9 L50.6,175.9 L50.4,174.4 L51.0,173.9 L51.6,174.4 L52.8,173.4 L52.0,172.4 L52.5,170.9 L52.2,170.2 L51.7,170.3 L52.2,169.3 L51.7,167.8 L52.1,167.1 L52.0,164.8 L53.1,162.4 L52.7,161.6 L51.5,161.1 L50.7,162.1 L50.3,161.4 L49.7,158.6 L50.5,158.1 L50.8,156.7 L49.6,155.4 L49.0,153.2 L49.4,152.6 L50.1,153.2 L50.7,152.0 L52.4,152.5 L53.7,151.6 L53.5,149.3 L54.5,148.6 L54.8,147.1 L56.7,146.1 Z";

// Illustrated terrain cues — the Andes run the entire length of Argentina's
// western border and are central to the country's wine identity (altitude
// viticulture), so the chain is traced with real coordinates top to bottom.
const RIVERS: { name: string; path: string }[] = [
  { name: 'Mendoza River', path: 'M52.0,144.5 L59.2,145.6 L64.3,149.6' },
];

const MOUNTAINS: { name: string; points: [number, number][] }[] = [
  { name: 'Andes', points: [[80.7, 41.9], [49.6, 100.2], [49.6, 145.7], [44.1, 205.2], [30.4, 286.8], [21.3, 356.8], [58.8, 397.6]] },
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

export default function ArgentinaRegionMap({ onSelectRegion }: Props) {
  const [pressed, setPressed] = useState(false);

  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" viewBox="0 0 280 420" preserveAspectRatio="xMidYMid meet">
        <Rect x={0} y={0} width={280} height={420} fill={Colors.cream} />
        <Path d={OUTLINE} fill={Colors.parchment} stroke={Colors.textMuted} strokeWidth={1.5} />

        {/* Terrain — the Andes (real chain, full country length) + Mendoza River */}
        {MOUNTAINS.map(range => (
          <React.Fragment key={range.name}>
            {range.points.map(([x, y], i) => (
              <MountainPeak key={`${range.name}-${i}`} x={x} y={y} />
            ))}
          </React.Fragment>
        ))}
        <Path d={RIVERS[0].path} fill="none" stroke={Colors.riverBlue}
          strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" opacity={0.75} pointerEvents="none" />

        <Path
          d={REGION_PATH}
          fill={'#722F37'}
          fillOpacity={pressed ? 0.65 : 0.88}
          stroke={Colors.cream}
          strokeWidth={1.5}
          strokeLinejoin="round"
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          onPress={() => onSelectRegion('mendoza')}
        />

        <Path d={OUTLINE} fill="none" stroke={Colors.text} strokeWidth={1.5} strokeOpacity={0.4} />

        <SvgText
          x={65.1}
          y={175.7}
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
          x={65.1}
          y={186.7}
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
