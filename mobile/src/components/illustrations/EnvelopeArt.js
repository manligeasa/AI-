import Svg, { Circle, G, Path, Rect } from 'react-native-svg';

/**
 * 세로로 긴 한국식 돈 봉투 네온 라인아트 (120×200 칸).
 * - wedding: 아래에 겹친 결혼반지 두 개
 * - funeral: 아래에 국화 한 송이
 */
const DECO = {
  wedding: (
    <>
      <Circle cx="52" cy="172" r="10" />
      <Circle cx="68" cy="172" r="10" />
      <Path d="M68 158 L72 152 L76 158" />
    </>
  ),
  funeral: (
    <>
      <Circle cx="60" cy="170" r="4" />
      <Path d="M60 162 L60 156 M60 178 L60 184 M52 170 L46 170 M68 170 L74 170 M54 164 L50 160 M66 164 L70 160 M54 176 L50 180 M66 176 L70 180" />
    </>
  ),
};

export default function EnvelopeArt({ kind, color, width }) {
  const height = (width * 200) / 120;
  const line = { fill: 'none', stroke: color, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const art = (
    <>
      <Rect x="6" y="6" width="108" height="188" rx="6" />
      <Path d="M6 14 L60 46 L114 14" />
      {DECO[kind]}
    </>
  );
  return (
    <Svg width={width} height={height} viewBox="0 0 120 200">
      <G {...line} strokeWidth={8} opacity={0.18}>
        {art}
      </G>
      <G {...line} strokeWidth={4.5} opacity={0.35}>
        {art}
      </G>
      <G {...line} strokeWidth={2.2}>
        {art}
      </G>
    </Svg>
  );
}
