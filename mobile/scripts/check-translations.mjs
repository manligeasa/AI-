/**
 * 번역 빠짐 검사: 화면에 보이는 한국어 문장이 모두 src/i18n/translations.json에
 * 베트남어(vi)·중국어(zh)·필리핀어(fil)로 들어 있는지 확인한다.
 * 실행: npm run check:i18n   (빠진 문장이 있으면 목록을 보여 주고 실패한다)
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC = join(ROOT, 'src');
const LANGS = ['vi', 'zh', 'fil'];
const HANGUL = /[가-힣]/;

// 지금 앱에서 쓰지 않는 예전 화면·파일 (질문 코치 시절 코드)
const UNUSED = ['screens/CoachScreen.js', 'screens/HistoryScreen.js', 'screens/TabScreen.js', 'components/ScoreBadge.js', 'services/coach.js', 'storage/useLocalData.js', 'data/exampleQuestions.json', 'data/seed.json'];
// 화면 글자가 아닌 것 (주석·화면 읽기 프로그램용 설명·개발자 경고·언어 선택 창 안내 등)
const IGNORE = new Set([
  '길게 누르면 모국어 힌트',
  '힌트 닫기',
  '힌트 언어 고르기',
  '모국어 힌트',
  '한국어 문장을 길게 누르면 고른 언어로 뜻을 알려 드려요.',
  '힌트 끄기',
  '끔',
  '닫기',
  '읽기 멈추기',
  '질문을 조금 더 적어 주세요.',
  'useRolePlay는 RolePlayProvider 안에서 써야 해요.',
  'useStamps는 StampProvider 안에서 써야 해요.',
  '화면을 누르면 닫혀요', // 상대에게 보여 주는 전체 화면 안내 (툴팁이 뜨지 않는 창)
]);
// JSON 데이터에서 번역하지 않는 칸
const DATA_SKIP_KEYS = new Set(['id', 'emoji', 'color', 'target']);

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const files = walk(SRC).filter((p) => !UNUSED.includes(relative(SRC, p)) && !p.includes('/i18n/') && !p.includes('/assets/'));
const found = new Map(); // 문장 → 처음 나온 파일

const add = (text, file) => {
  const t = text.trim();
  if (t && HANGUL.test(t) && !IGNORE.has(t) && !found.has(t)) found.set(t, relative(ROOT, file));
};

const collectJson = (value, file, key) => {
  if (typeof value === 'string') return DATA_SKIP_KEYS.has(key) ? null : add(value, file);
  if (Array.isArray(value)) return value.forEach((v) => collectJson(v, file, key));
  if (value && typeof value === 'object') Object.entries(value).forEach(([k, v]) => collectJson(v, file, k));
  return null;
};

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  if (file.endsWith('.json')) {
    collectJson(JSON.parse(src), file);
    continue;
  }
  const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  // '...' 와 "..." 문자열 (accessibilityLabel 등 화면에 안 보이는 속성은 제외)
  // (객체 열쇠로 쓰인 글자 { '기초': … } 는 화면 글자가 아니라서 뺀다. 삼항 연산자의 ':' 는 열쇠가 아니다)
  for (const m of code.matchAll(/(accessibility\w+|console\.\w+\()?\s*=?\s*\{?\s*(['"])((?:\\.|(?!\2).)*)\2(\s*:)?/g)) {
    const quoteAt = m.index + m[0].indexOf(m[2]);
    const before = code.slice(0, quoteAt).trimEnd().slice(-1);
    const isObjectKey = m[4] && (before === '{' || before === ',');
    if (!m[1] && !isObjectKey) add(m[3].replace(/\\n/g, '\n'), file);
  }
  // JSX 사이 글자 (중괄호가 섞인 동적 글자는 hint 틀로 따로 들어간다)
  for (const m of code.matchAll(/>(?!=)([^<>{}=]*[가-힣][^<>{}=]*)</g)) add(m[1].replace(/\s+/g, ' '), file);
}

const dict = JSON.parse(readFileSync(join(SRC, 'i18n/translations.json'), 'utf8'));
const missing = [...found.keys()].filter((k) => !dict[k]);
const partial = Object.entries(dict).filter(([, v]) => LANGS.some((l) => !v[l]?.trim())).map(([k]) => k);
const unused = Object.keys(dict).filter((k) => !found.has(k));

writeFileSync(join(ROOT, 'scripts/.i18n-found.json'), JSON.stringify([...found.entries()], null, 2));

console.log(`화면 속 한국어 문장 ${found.size}개 / 번역 사전 ${Object.keys(dict).length}개`);
if (unused.length) console.log(`\n(참고) 화면에서 찾지 못한 사전 항목 ${unused.length}개:\n` + unused.map((k) => `  - ${k}`).join('\n'));
if (missing.length) console.log(`\n✕ 번역이 없는 문장 ${missing.length}개:\n` + missing.map((k) => `  - ${JSON.stringify(k)}  (${found.get(k)})`).join('\n'));
if (partial.length) console.log(`\n✕ 일부 언어가 빠진 문장 ${partial.length}개:\n` + partial.map((k) => `  - ${k}`).join('\n'));
if (missing.length || partial.length) process.exit(1);
console.log('✓ 모든 문장에 베트남어·중국어·필리핀어 번역이 있어요.');
