import Svg, { Circle, G, Path, Rect, Text as SvgText } from 'react-native-svg';

/**
 * 조문 순서 카드용 네온 라인아트.
 * 같은 선을 두 번 그린다: 굵고 흐린 선(빛 번짐) 위에 가늘고 밝은 선.
 * 모든 그림은 200×160 칸 안에 그린다.
 */
const ART = {
  // 방명록: 펼친 책과 붓펜
  guestbook: (
    <>
      <Path d="M20 118 L100 128 L180 118 L180 42 L100 52 L20 42 Z" />
      <Path d="M100 52 L100 128" />
      <Path d="M36 62 L84 68 M36 80 L84 86 M36 98 L70 102" />
      <Path d="M116 68 L150 64 M116 86 L140 83" />
      <Path d="M172 18 L146 92 L140 104 L142 90 Z" />
    </>
  ),
  // 향로와 피어오르는 연기
  incense: (
    <>
      <Path d="M52 104 L148 104 Q146 140 100 140 Q54 140 52 104 Z" />
      <Path d="M70 140 L64 152 M130 140 L136 152" />
      <Path d="M100 104 L100 58" />
      <Path d="M100 50 C88 40 112 32 100 22 C92 14 106 8 100 2" />
      <Path d="M160 104 C170 92 176 98 172 84 M168 104 L172 84 M176 70 C186 66 184 80 174 82 C164 84 164 70 176 70 Z" />
    </>
  ),
  // 검은 리본을 단 영정 사진
  portrait: (
    <>
      <Rect x="58" y="14" width="84" height="108" rx="4" />
      <Rect x="68" y="24" width="64" height="88" rx="2" />
      <Circle cx="100" cy="58" r="14" />
      <Path d="M76 110 Q78 80 100 78 Q122 80 124 110" />
      <Path d="M58 34 L78 14 M142 34 L122 14" />
      <Path d="M40 150 L160 150 M50 150 L56 132 L66 150 M144 150 L150 132 L160 150" />
    </>
  ),
  // 허리 숙여 마주 절하는 두 사람 (옆모습)
  mourner: (
    <>
      <Circle cx="78" cy="92" r="11" />
      <Path d="M30 72 L66 80 M30 72 L32 150 M64 82 L62 120" />
      <Circle cx="122" cy="92" r="11" />
      <Path d="M170 72 L134 80 M170 72 L168 150 M136 82 L138 120" />
      <Path d="M14 150 L186 150" />
    </>
  ),
  // 하트가 담긴 말풍선
  comfort: (
    <>
      <Path d="M40 30 H140 Q156 30 156 46 V92 Q156 108 140 108 H82 L58 130 L62 108 H40 Q24 108 24 92 V46 Q24 30 40 30 Z" />
      <Path d="M90 92 C70 78 62 64 72 56 C80 50 88 54 90 62 C92 54 100 50 108 56 C118 64 110 78 90 92 Z" />
      <Path d="M160 120 Q176 120 176 134 Q176 148 160 148 H148 L140 156 L141 148 Q126 146 126 134 Q126 120 142 120 Z" />
    </>
  ),
  // 부의함에 들어가는 봉투
  envelope: (
    <>
      <Rect x="54" y="104" width="92" height="50" rx="4" />
      <Path d="M82 104 L118 104" strokeWidth={6} />
      <Rect x="78" y="14" width="44" height="70" rx="3" />
      <Path d="M78 26 L100 40 L122 26" />
      <SvgText x="100" y="70" fontSize="16" fontWeight="bold" textAnchor="middle" strokeWidth={0} fill="currentColor">
        부의
      </SvgText>
      <Path d="M100 88 L100 98 M94 92 L100 98 L106 92" />
    </>
  ),
  // 열린 문과 나가는 화살표
  leave: (
    <>
      <Rect x="60" y="20" width="70" height="128" rx="2" />
      <Path d="M60 20 L36 30 L36 140 L60 148 Z" />
      <Circle cx="44" cy="86" r="3" />
      <Path d="M140 84 L184 84 M170 70 L184 84 L170 98" />
      <Path d="M20 148 L180 148" />
    </>
  ),
};

export default function NeonLineArt({ name, color, width = 240 }) {
  const art = ART[name];
  if (!art) return null;
  const height = (width * 160) / 200;
  const line = { fill: 'none', stroke: color, strokeLinecap: 'round', strokeLinejoin: 'round', color };
  return (
    <Svg width={width} height={height} viewBox="0 0 200 160" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <G {...line} strokeWidth={9} opacity={0.18}>
        {art}
      </G>
      <G {...line} strokeWidth={5} opacity={0.35}>
        {art}
      </G>
      <G {...line} strokeWidth={2.5}>
        {art}
      </G>
    </Svg>
  );
}
