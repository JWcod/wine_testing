import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Text as SvgText, Defs, ClipPath, Rect, G, Line } from 'react-native-svg';
import { Colors } from '../constants/colors';

// Real California + Oregon state outlines (simplified from public boundary
// data), and real AVA (American Viticultural Area) legal boundaries for
// Napa Valley, Sonoma Valley and Willamette Valley — digitized by the UC
// Davis Library AVA Digitizing Project (CC0), the same source academic
// wine researchers use. These are true appellation shapes, not approximations.
const CA_PATH =
  'M24.2,148.9 L125.7,149.0 L125.7,242.5 L186.0,298.0 L225.7,336.9 L255.0,367.1 L255.0,371.1 L259.0,376.2 ' +
  'L262.3,384.4 L267.0,388.8 L264.1,392.9 L260.3,395.0 L257.4,400.4 L258.3,407.8 L257.6,412.4 L252.8,416.8 ' +
  'L254.4,428.5 L257.6,428.6 L259.0,434.4 L257.6,437.2 L252.9,438.4 L195.0,444.0 L192.1,439.9 L191.9,433.4 ' +
  'L190.1,425.7 L186.6,420.3 L179.1,412.7 L169.5,405.7 L167.6,407.6 L163.9,406.4 L164.5,403.4 L160.3,397.0 ' +
  'L154.6,398.4 L144.5,393.8 L143.1,390.0 L136.4,385.4 L128.7,385.6 L122.4,383.5 L114.3,384.4 L110.1,380.3 ' +
  'L111.0,371.6 L109.6,370.2 L110.5,364.1 L104.2,359.5 L103.9,353.1 L101.5,352.8 L97.6,347.3 L94.8,346.1 ' +
  'L93.6,342.7 L84.4,329.9 L80.0,326.2 L79.1,316.1 L80.9,316.9 L82.6,311.0 L79.2,305.5 L75.0,306.2 L69.5,301.2 ' +
  'L67.5,297.3 L67.9,293.5 L65.1,288.6 L65.1,280.4 L69.6,280.4 L67.7,268.9 L65.8,270.1 L65.4,275.8 L60.6,277.0 ' +
  'L54.9,272.7 L54.0,265.4 L50.3,259.5 L45.4,256.0 L35.7,243.8 L36.9,241.4 L33.6,231.0 L35.0,225.2 L32.9,216.5 ' +
  'L26.7,208.0 L20.6,203.2 L19.4,197.5 L25.5,183.9 L26.7,179.3 L25.5,175.7 L27.7,166.3 L25.8,157.8 L23.1,155.7 Z';

const OR_PATH =
  'M44.5,19.6 L50.6,18.4 L55.7,21.6 L58.0,25.4 L59.2,34.8 L71.6,38.2 L82.1,33.2 L88.7,32.7 L96.4,34.4 ' +
  'L97.2,36.5 L110.4,32.1 L113.5,33.6 L120.7,32.7 L126.6,29.7 L137.2,26.9 L146.8,26.2 L150.1,24.2 L200.0,24.4 ' +
  'L203.3,29.7 L209.0,31.9 L210.9,36.2 L205.9,45.4 L204.5,50.8 L201.7,54.6 L202.1,57.5 L199.6,62.1 L197.1,63.1 ' +
  'L192.2,74.2 L193.9,78.5 L198.5,79.0 L200.5,81.6 L197.3,91.8 L197.3,148.9 L24.2,148.9 L20.8,145.3 L18.9,135.2 ' +
  'L19.3,128.2 L16.0,122.7 L18.4,117.6 L20.1,109.3 L23.7,100.4 L25.2,92.5 L27.9,66.0 L27.5,62.5 L29.9,50.8 ' +
  'L30.8,34.8 L29.5,25.9 L30.6,20.6 L40.3,16.0 Z';

const NAPA_PATH =
  'M74.5,260.3 L75.0,257.6 L74.5,258.3 L74.6,257.8 L74.0,257.1 L73.6,257.6 L73.7,258.6 L73.2,256.5 L73.2,257.3 ' +
  'L72.9,256.8 L73.0,257.5 L72.5,257.6 L72.8,258.3 L71.8,257.8 L72.5,257.5 L71.9,256.6 L72.2,256.5 L71.9,255.8 ' +
  'L68.1,251.4 L67.5,249.7 L66.3,251.6 L62.4,252.8 L62.4,254.2 L61.9,255.0 L62.6,256.2 L64.4,257.4 L64.8,259.0 ' +
  'L66.0,259.6 L65.5,260.4 L66.7,261.8 L66.5,262.2 L68.0,264.0 L67.8,264.8 L68.7,265.9 L69.1,267.6 L68.6,268.0 ' +
  'L68.7,268.7 L67.7,268.8 L72.8,268.8 L72.3,268.0 L72.9,266.7 L72.4,265.9 L72.9,265.6 L72.3,265.3 L73.0,265.2 ' +
  'L72.6,263.8 L76.0,263.8 L76.0,263.4 Z';

const SONOMA_PATH =
  'M66.6,270.0 L67.7,269.2 L67.7,268.7 L68.7,268.7 L68.6,267.9 L68.9,267.9 L68.8,267.5 L69.1,267.6 L69.1,267.4 ' +
  'L68.9,267.1 L68.7,265.9 L68.5,266.0 L68.1,265.5 L68.2,265.1 L68.0,265.1 L67.8,264.8 L67.8,264.3 L68.0,264.1 ' +
  'L67.6,263.2 L66.5,262.2 L66.7,261.8 L65.5,260.4 L66.0,259.6 L65.3,259.4 L65.3,259.1 L65.0,258.9 L64.2,259.3 ' +
  'L63.1,259.1 L62.2,259.3 L61.3,261.1 L63.7,263.6 L66.1,267.6 L66.7,268.9 L67.1,269.1 L66.8,269.3 L67.0,269.7 ' +
  'L66.6,269.7 Z';

const WILLAMETTE_PATH =
  'M55.1,34.8 L55.2,32.8 L59.1,32.7 L59.1,35.0 L61.9,36.4 L71.5,38.2 L72.4,42.3 L74.4,42.4 L74.4,47.3 L71.5,47.3 ' +
  'L71.4,50.0 L65.5,52.7 L65.5,55.5 L62.6,55.4 L62.6,61.6 L68.8,62.9 L61.5,62.6 L64.8,65.0 L58.5,65.1 L62.6,68.3 ' +
  'L60.0,69.3 L62.5,71.7 L62.5,75.0 L59.9,75.9 L63.2,78.0 L54.4,75.7 L52.7,81.0 L54.1,83.6 L58.1,78.0 L60.4,78.7 ' +
  'L58.1,80.4 L60.6,80.8 L56.4,81.6 L54.7,84.2 L64.5,81.4 L68.5,82.8 L63.4,82.2 L55.5,85.5 L59.6,87.0 L59.6,89.6 ' +
  'L58.1,89.4 L58.3,91.5 L56.1,88.3 L53.5,89.9 L53.1,92.3 L56.5,93.4 L57.7,96.0 L53.7,93.1 L54.7,96.8 L52.4,93.0 ' +
  'L51.6,99.7 L51.9,95.3 L50.2,95.3 L51.3,93.3 L49.7,91.6 L51.9,92.3 L50.6,90.5 L51.9,90.0 L49.4,89.2 L51.5,87.0 ' +
  'L48.0,88.7 L49.8,90.8 L48.0,92.6 L49.3,91.5 L49.8,93.5 L47.2,93.4 L44.9,87.3 L39.8,85.3 L42.1,84.0 L40.4,82.5 ' +
  'L43.1,81.7 L41.8,80.0 L44.2,80.0 L42.0,69.0 L39.0,69.0 L39.0,63.9 L41.8,65.0 L37.9,62.0 L43.1,61.6 L40.4,59.9 ' +
  'L44.2,58.2 L40.7,58.4 L44.3,57.3 L40.1,56.6 L43.1,55.7 L39.1,54.1 L37.7,55.4 L35.8,51.3 L46.5,47.7 L43.3,43.8 ' +
  'L47.0,42.2 L44.2,40.8 L46.8,40.6 L46.0,38.2 L49.1,39.3 L44.5,35.3 L46.2,33.3 L48.2,35.5 L47.7,32.5 L51.0,34.6 ' +
  'L51.7,31.4 Z';

export interface USRegion {
  id: string;
  name: string;
  path: string;
  centroidX: number;
  centroidY: number;
  labelDx: number;
  labelDy: number;
  color: string;
}

// AVA shapes are genuinely tiny relative to the states that contain them —
// that's real, not a rendering error — so labels sit outside the shape
// with a thin leader line back to it, the way printed wine maps handle it.
const REGIONS: USRegion[] = [
  { id: 'napa-valley', name: 'Napa Valley', path: NAPA_PATH, centroidX: 69.1, centroidY: 259.3, labelDx: 34, labelDy: -8, color: Colors.primary },
  { id: 'sonoma', name: 'Sonoma', path: SONOMA_PATH, centroidX: 65.5, centroidY: 263.7, labelDx: 18, labelDy: 26, color: '#8A9A6B' },
  { id: 'willamette-valley', name: 'Willamette Valley', path: WILLAMETTE_PATH, centroidX: 53.7, centroidY: 59.5, labelDx: 46, labelDy: 0, color: '#A0533E' },
];

interface Props {
  onSelectRegion: (regionId: string) => void;
}

export default function USWestCoastMap({ onSelectRegion }: Props) {
  const [pressedId, setPressedId] = useState<string | null>(null);
  const handlePressIn = useCallback((id: string) => setPressedId(id), []);
  const handlePressOut = useCallback(() => setPressedId(null), []);

  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" viewBox="0 0 300 460" preserveAspectRatio="xMidYMid meet">
        <Defs>
          <ClipPath id="caClip"><Path d={CA_PATH} /></ClipPath>
          <ClipPath id="orClip"><Path d={OR_PATH} /></ClipPath>
        </Defs>

        <Rect x={0} y={0} width={300} height={460} fill={Colors.cream} />

        {/* Land */}
        <Path d={CA_PATH} fill={Colors.parchment} stroke={Colors.textMuted} strokeWidth={1.5} />
        <Path d={OR_PATH} fill={Colors.parchment} stroke={Colors.textMuted} strokeWidth={1.5} />

        {/* Real AVA boundaries, clipped so nothing spills past the coastline */}
        <G clipPath="url(#caClip)">
          {REGIONS.filter(r => r.id !== 'willamette-valley').map(region => (
            <Path
              key={region.id}
              d={region.path}
              fill={region.color}
              fillOpacity={pressedId === region.id ? 0.65 : 0.9}
              stroke={Colors.cream}
              strokeWidth={1}
              onPressIn={() => handlePressIn(region.id)}
              onPressOut={handlePressOut}
              onPress={() => onSelectRegion(region.id)}
            />
          ))}
        </G>
        <G clipPath="url(#orClip)">
          {REGIONS.filter(r => r.id === 'willamette-valley').map(region => (
            <Path
              key={region.id}
              d={region.path}
              fill={region.color}
              fillOpacity={pressedId === region.id ? 0.65 : 0.9}
              stroke={Colors.cream}
              strokeWidth={1}
              onPressIn={() => handlePressIn(region.id)}
              onPressOut={handlePressOut}
              onPress={() => onSelectRegion(region.id)}
            />
          ))}
        </G>

        {/* Crisp state borders on top */}
        <Path d={CA_PATH} fill="none" stroke={Colors.text} strokeWidth={1.3} strokeOpacity={0.4} />
        <Path d={OR_PATH} fill="none" stroke={Colors.text} strokeWidth={1.3} strokeOpacity={0.4} />

        {/* Leader lines + external labels */}
        {REGIONS.map(region => {
          const lx = region.centroidX + region.labelDx;
          const ly = region.centroidY + region.labelDy;
          return (
            <React.Fragment key={`label-${region.id}`}>
              <Line
                x1={region.centroidX}
                y1={region.centroidY}
                x2={lx - (region.labelDx > 0 ? 4 : region.labelDx < 0 ? -4 : 0)}
                y2={ly}
                stroke={Colors.text}
                strokeWidth={0.8}
                strokeOpacity={0.5}
              />
              <SvgText
                x={lx}
                y={ly + 4}
                fontSize={11}
                fontWeight="700"
                fill={Colors.text}
                textAnchor={region.labelDx > 0 ? 'start' : region.labelDx < 0 ? 'end' : 'middle'}
              >
                {region.name}
              </SvgText>
            </React.Fragment>
          );
        })}

        <SvgText x={150} y={110} fontSize={13} fontWeight="700" fill={Colors.textMuted} textAnchor="middle" opacity={0.7}>
          OREGON
        </SvgText>
        <SvgText x={150} y={200} fontSize={13} fontWeight="700" fill={Colors.textMuted} textAnchor="middle" opacity={0.7}>
          CALIFORNIA
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
