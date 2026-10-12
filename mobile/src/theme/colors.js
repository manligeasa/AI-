/**
 * 네온 다크 테마 색상표.
 * 화면 코드는 이 값만 쓰고 색 코드를 직접 적지 않는다. 여기만 바꾸면 앱 전체 색이 바뀐다.
 */
export const colors = {
  // 바탕
  bg: '#0A0A12',
  surface: '#141420',
  surfaceAlt: '#1C1C2C',
  border: '#2C2C42',

  // 글자 (어두운 바탕에서 잘 읽히도록 대비를 높게 잡았다)
  text: '#F5F5FA',
  textMuted: '#B4B4CC',
  textOnNeon: '#0A0A12',

  // 네온 포인트
  pink: '#FF2E97',
  lime: '#B6FF3B',
  blue: '#2EC5FF',
  purple: '#B45CFF',
};

/** 네온 빛 번짐 효과. 예) glow(colors.pink) */
export const glow = (color, radius = 16) => ({
  boxShadow: `0 0 ${radius}px ${color}99`,
});

/** 점수 수준별 색 */
export const LEVEL_COLORS = {
  '기초': colors.pink,
  '보통': colors.purple,
  '좋음': colors.blue,
  '매우 좋음': colors.lime,
};
