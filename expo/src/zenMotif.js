import Svg, { Circle, Path } from 'react-native-svg';

const line = '#2f7a52';

/** Hand-drawn grass, flower, and sun. */
export function ZenMotif() {
  return (
    <Svg width={56} height={18} viewBox="0 0 56 18" style={{ marginTop: 6 }}>
      <Path d="M2 17c2-9 4-11 5 0M8 17c2-11 5-13 6 0M15 17c2-8 4-10 5 0" stroke={line} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <Path d="M29 17v-6" stroke={line} strokeWidth="1.4" strokeLinecap="round" />
      <Circle cx="27" cy="8" r="2.3" fill="#e8899a" />
      <Circle cx="31" cy="8" r="2.3" fill="#e8899a" />
      <Circle cx="29" cy="6" r="2.3" fill="#f0a8b4" />
      <Circle cx="29" cy="8" r="1.3" fill="#f5d76e" />
      <Circle cx="46" cy="7" r="4.2" fill="#f2c14e" />
    </Svg>
  );
}
