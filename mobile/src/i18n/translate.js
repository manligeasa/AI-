import translations from './translations.json';

/** 힌트로 보여 줄 수 있는 모국어. 번역은 모두 translations.json에 미리 넣어 두었다 (유료 번역 API 없음). */
export const LANGUAGES = [
  { code: 'vi', flag: '🇻🇳', name: 'Tiếng Việt', short: 'VI' },
  { code: 'zh', flag: '🇨🇳', name: '中文', short: '中' },
  { code: 'fil', flag: '🇵🇭', name: 'Filipino', short: 'FIL' },
];

export const languageOf = (code) => LANGUAGES.find((l) => l.code === code) ?? null;

export const fill = (template, params) => template.replace(/\{(\w+)\}/g, (m, k) => (params && k in params ? String(params[k]) : m));

/**
 * 한국어 문장(또는 '문제 {n} / {total}' 같은 틀)을 고른 언어로 바꾼다.
 * 번역이 없으면 null을 돌려준다.
 */
export function translate(korean, lang, params) {
  const entry = translations[korean];
  if (!entry || !entry[lang]) return null;
  return fill(entry[lang], params);
}
