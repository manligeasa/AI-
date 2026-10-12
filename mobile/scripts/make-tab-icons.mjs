/**
 * 하단 탭 아이콘용 Lottie(JSON 애니메이션) 파일을 만든다.
 * 외부 무료 소스 대신 직접 그려서 라이선스 걱정이 없다.
 * 색이나 움직임을 바꾸려면 이 파일을 고친 뒤 `npm run icons`를 실행한다.
 */
import { mkdirSync, writeFileSync } from 'node:fs';

const OUT = new URL('../src/assets/lottie/', import.meta.url);
const SIZE = 96;
const FPS = 60;
const END = 40; // 약 0.7초
const GROUND = 80; // 아이콘 바닥선 (여기를 기준으로 눌리고 늘어난다)

const COLORS = {
  pink: '#FF2E97',
  lime: '#B6FF3B',
  blue: '#2EC5FF',
  purple: '#B45CFF',
  white: '#F5F5FA',
  dark: '#0A0A12',
};

const rgba = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).concat(1);
const fixed = (k) => ({ a: 0, k });
const ease = (n) => ({ i: { x: Array(n).fill(0.4), y: Array(n).fill(1) }, o: { x: Array(n).fill(0.6), y: Array(n).fill(0) } });
/** [[프레임, 값], ...] → Lottie 키프레임 */
const keys = (frames, dims = 1) => ({
  a: 1,
  k: frames.map(([t, v], idx) => ({
    t,
    s: Array.isArray(v) ? v : [v],
    ...(idx < frames.length - 1 ? ease(dims) : {}),
  })),
});

// ── 도형 ──
const rect = (x, y, w, h, r) => ({ ty: 'rc', d: 1, p: fixed([x, y]), s: fixed([w, h]), r: fixed(r) });
const ellipse = (x, y, d) => ({ ty: 'el', d: 1, p: fixed([x, y]), s: fixed([d, d]) });
/** points: [[x, y, inX, inY, outX, outY], ...] (in/out은 곡선 조절점, 점 기준 상대 위치) */
const path = (points, closed) => ({
  ty: 'sh',
  ks: fixed({
    c: closed,
    v: points.map(([x, y]) => [x, y]),
    i: points.map(([, , ix = 0, iy = 0]) => [ix, iy]),
    o: points.map(([, , , , ox = 0, oy = 0]) => [ox, oy]),
  }),
});
const fill = (hex) => ({ ty: 'fl', c: fixed(rgba(hex)), o: fixed(100), r: 1 });
const stroke = (hex, w) => ({ ty: 'st', c: fixed(rgba(hex)), o: fixed(100), w: fixed(w), lc: 2, lj: 2 });
const transform = (x = 0, y = 0, r = 0) => ({
  ty: 'tr', p: fixed([x, y]), a: fixed([0, 0]), s: fixed([100, 100]), r: fixed(r), o: fixed(100), sk: fixed(0), sa: fixed(0),
});
/** 묶음. 목록에서 앞에 있는 묶음이 위에 그려진다. */
const group = (items, tr = transform()) => ({ ty: 'gr', it: [...items, tr] });

// ── 통통 튀는 움직임: 움츠림 → 점프 → 착지(납작) → 제자리 ──
const bounceLayer = (shapes) => ({
  ddd: 0, ind: 1, ty: 4, nm: 'icon', sr: 1, ao: 0, ip: 0, op: END, st: 0, bm: 0,
  ks: {
    o: fixed(100),
    a: fixed([SIZE / 2, GROUND, 0]),
    p: { s: true, x: fixed(SIZE / 2), y: keys([[0, GROUND], [6, GROUND], [16, GROUND - 16], [26, GROUND], [40, GROUND]]) },
    s: keys([[0, [100, 100, 100]], [6, [114, 86, 100]], [16, [92, 110, 100]], [26, [118, 84, 100]], [32, [96, 104, 100]], [40, [100, 100, 100]]], 3),
    r: keys([[0, 0], [16, -8], [26, 6], [34, -2], [40, 0]]),
  },
  shapes,
});

const lottie = (name, shapes) => ({
  v: '5.7.4', fr: FPS, ip: 0, op: END, w: SIZE, h: SIZE, nm: name, ddd: 0, assets: [],
  layers: [bounceLayer(shapes)],
});

// ── 아이콘 4개 ──
const icons = {
  // 상황극: 주고받는 말풍선 두 개
  roleplay: lottie('상황극', [
    group([rect(60, 66, 32, 22, 8), stroke(COLORS.white, 4), fill(COLORS.dark)]),
    group([path([[64, 76], [72, 82], [70, 74]], true), fill(COLORS.white)]),
    group([ellipse(32, 46, 6), ellipse(42, 46, 6), ellipse(52, 46, 6), fill(COLORS.dark)]),
    group([rect(42, 46, 46, 32, 10), path([[26, 58], [22, 72], [38, 60]], true), fill(COLORS.pink)]),
  ]),

  // 오디오: 헤드폰
  audio: lottie('오디오', [
    group([rect(26, 66, 4, 12, 2), rect(70, 66, 4, 12, 2), fill(COLORS.white)]),
    group([rect(26, 66, 15, 26, 6), rect(70, 66, 15, 26, 6), fill(COLORS.blue)]),
    group([path([[24, 60, 0, 0, 0, -36], [72, 60, 0, -36, 0, 0]], false), stroke(COLORS.blue, 6)]),
  ]),

  // 퀴즈: 동그라미 속 물음표
  quiz: lottie('퀴즈', [
    group([ellipse(48, 71, 7), fill(COLORS.dark)]),
    group([
      path([[40, 46, 0, 0, 0, -6], [48, 38, -5, 0, 5, 0], [56, 46, 0, -5, 0, 5], [48, 56, 0, -4, 0, 0], [48, 62]], false),
      stroke(COLORS.dark, 6),
    ]),
    group([ellipse(48, 54, 52), fill(COLORS.lime)]),
  ]),

  // 소통 카드: 하트가 그려진 카드 두 장
  cards: lottie('소통 카드', [
    group(
      [
        group([
          path([[0, 9, 6, -4, -6, -4], [-8, -1, 0, 5, 0, -6], [0, -3, -6, -8, 6, -8], [8, -1, 0, -6, 0, 5]], true),
          fill(COLORS.dark),
        ]),
        group([rect(0, 0, 34, 44, 6), fill(COLORS.purple)]),
      ],
      transform(54, 56, 8),
    ),
    group([rect(0, 0, 34, 44, 6), stroke(COLORS.white, 4), fill(COLORS.dark)], transform(42, 52, -12)),
  ]),
};

mkdirSync(OUT, { recursive: true });
for (const [name, data] of Object.entries(icons)) {
  writeFileSync(new URL(`${name}.json`, OUT), JSON.stringify(data));
  console.log(`✓ ${name}.json`);
}
