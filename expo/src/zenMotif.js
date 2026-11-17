import Svg, { Circle, Ellipse } from 'react-native-svg';

/** Monet/NEVA soft wash — opacity only (no SVG blur; blur remounts lag contact switches). */
export function ZenMotif() {
  return (
    <Svg pointerEvents="none" width={200} height={56} viewBox="0 0 200 56" preserveAspectRatio="xMidYMax slice" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', height: 56 }}>
      <Circle cx="26" cy="6" r="28" fill="#9ec9e0" opacity="0.45" />
      <Circle cx="108" cy="4" r="24" fill="#e8b8c8" opacity="0.28" />
      <Circle cx="174" cy="12" r="28" fill="#f0d6a0" opacity="0.48" />
      <Circle cx="174" cy="12" r="11" fill="#f2c45a" />
      <Ellipse cx="48" cy="50" rx="38" ry="18" fill="#7eb89a" opacity="0.5" />
      <Ellipse cx="112" cy="52" rx="34" ry="16" fill="#6fa88a" opacity="0.4" />
      <Ellipse cx="40" cy="38" rx="5" ry="15" fill="#3f7a5c" opacity="0.55" />
      <Circle cx="90" cy="24" r="9" fill="#e890a0" opacity="0.85" />
      <Circle cx="108" cy="24" r="9" fill="#e890a0" opacity="0.85" />
      <Circle cx="99" cy="16" r="9" fill="#f0a8b4" opacity="0.9" />
      <Circle cx="99" cy="28" r="8" fill="#e87890" opacity="0.82" />
      <Circle cx="99" cy="24" r="3.8" fill="#f5d76e" />
    </Svg>
  );
}
