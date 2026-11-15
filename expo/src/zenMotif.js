import Svg, { Circle, Path } from 'react-native-svg';
import { ZEN_LINE } from './messageBubble';

/** Hand-drawn grass, flower, and sun. */
export function ZenMotif() {
  return (
    <Svg width={72} height={24} viewBox="0 0 72 24" style={{ marginTop: 8 }}>
      <Path d="M3 22c3-12 5-14 7 0M13 22c3-14 6-16 8 0M24 22c3-10 5-12 7 0" stroke={ZEN_LINE} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <Path d="M40 22v-8" stroke={ZEN_LINE} strokeWidth="1.8" strokeLinecap="round" />
      <Circle cx="37" cy="10" r="3.2" fill="#e8899a" />
      <Circle cx="43" cy="10" r="3.2" fill="#e8899a" />
      <Circle cx="40" cy="7" r="3.2" fill="#f0a8b4" />
      <Circle cx="40" cy="10" r="1.8" fill="#f5d76e" />
      <Circle cx="60" cy="9" r="5.5" fill="#f2c14e" />
    </Svg>
  );
}
