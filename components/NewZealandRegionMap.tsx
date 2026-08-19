import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Path, Text as SvgText, Rect } from 'react-native-svg';
import Svg from 'react-native-svg';
import { Colors } from '../constants/colors';

// Real New Zealand outline — both main islands (simplified from public boundary
// data, same equirectangular + cos-latitude-corrected projection as the other maps).
const SOUTH_ISLAND = "M139.6,177.6 L143.9,187.9 L157.4,177.8 L162.9,188.3 L163.0,198.8 L155.9,210.4 L143.5,228.8 L133.8,238.9 L140.8,250.9 L126.1,251.2 L109.9,260.6 L104.8,277.0 L94.0,302.2 L79.1,313.4 L69.6,320.5 L52.1,320.0 L39.8,311.8 L19.2,310.0 L16.0,300.8 L26.2,282.3 L50.1,257.6 L62.3,252.9 L76.0,243.4 L92.2,230.4 L103.6,217.4 L112.1,198.8 L119.3,192.5 L122.1,178.5 L135.4,167.0 L139.6,177.6 Z";
const NORTH_ISLAND = "M169.9,58.6 L183.6,84.9 L184.0,67.8 L192.6,74.7 L195.4,93.6 L210.7,101.7 L223.5,103.7 L234.4,94.2 L244.0,97.1 L239.4,119.2 L233.6,133.8 L219.1,133.3 L214.1,140.9 L215.8,151.6 L213.0,156.3 L205.9,169.7 L196.4,186.8 L181.8,196.8 L178.5,190.2 L170.6,186.6 L181.5,166.1 L175.3,152.3 L154.9,142.4 L155.4,133.3 L169.1,124.6 L172.3,105.4 L171.5,89.2 L163.8,72.5 L164.3,68.1 L155.2,57.7 L140.3,35.6 L132.3,18.0 L139.4,16.0 L149.7,29.9 L164.5,36.4 L169.9,58.6 Z";

// Real Marlborough region boundary (OpenStreetMap administrative relation).
const REGION_PATH = "M136.3,201.5 L138.2,199.1 L137.9,198.2 L139.3,197.7 L140.3,196.3 L140.4,195.2 L142.1,194.2 L142.5,192.7 L144.9,192.5 L144.0,191.3 L144.8,190.2 L144.7,189.6 L147.0,187.9 L147.1,186.8 L148.3,185.3 L150.2,184.2 L150.6,181.1 L148.8,176.2 L149.4,173.6 L150.5,171.1 L152.9,168.7 L156.9,166.3 L160.4,166.6 L162.6,168.6 L164.2,172.9 L165.3,174.2 L167.2,174.9 L169.7,177.0 L168.0,185.0 L165.6,190.3 L166.2,193.2 L167.6,194.4 L168.7,196.2 L168.9,199.2 L167.9,201.3 L162.8,207.5 L159.1,203.8 L159.4,202.9 L157.8,202.9 L157.4,202.3 L154.8,202.9 L154.2,203.5 L153.4,202.3 L152.8,203.1 L152.9,203.6 L151.4,204.8 L150.8,204.7 L149.6,206.3 L148.7,206.5 L148.0,207.5 L148.4,209.1 L147.5,209.9 L144.9,210.8 L144.9,211.2 L142.7,213.0 L143.9,213.5 L143.5,213.5 L142.1,215.8 L141.3,215.8 L140.2,216.8 L139.5,215.7 L138.7,215.8 L139.3,214.4 L138.1,214.0 L137.6,212.3 L136.3,212.3 L136.7,211.0 L136.0,210.8 L136.1,209.2 L133.9,208.5 L134.2,205.4 L134.6,205.5 L135.6,203.5 L136.3,203.1 L136.7,202.3 L136.3,201.5 Z";

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

        <Path
          d={REGION_PATH}
          fill={Colors.primary}
          fillOpacity={pressed ? 0.65 : 0.88}
          stroke={Colors.cream}
          strokeWidth={1.5}
          strokeLinejoin="round"
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          onPress={() => onSelectRegion('marlborough')}
        />

        <Path d={NORTH_ISLAND} fill="none" stroke={Colors.text} strokeWidth={1.5} strokeOpacity={0.4} />
        <Path d={SOUTH_ISLAND} fill="none" stroke={Colors.text} strokeWidth={1.5} strokeOpacity={0.4} />

        <SvgText x={154} y={188.3} fontSize={11} fontWeight="800" fill={Colors.white} textAnchor="middle" stroke={Colors.text} strokeWidth={0.35} pointerEvents="none">
          Marlborough
        </SvgText>
        <SvgText x={154} y={199.3} fontSize={7} fontWeight="500" fill={Colors.white} textAnchor="middle" stroke={Colors.text} strokeWidth={0.25} pointerEvents="none">
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
