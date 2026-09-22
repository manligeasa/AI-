import { CRITERIA, getLevel } from '../criteria.js'

/**
 * 평가 항목별 키워드 목록.
 * 질문에 키워드가 하나라도 있으면 그 항목을 "충족"으로 본다.
 * 띄어쓰기는 무시하고 비교한다. ("만들어 줘" = "만들어줘")
 *
 * - keywords: 있으면 충족으로 보는 말
 * - exclude: 키워드와 헷갈리는 말 (예: "목표"에 들어 있는 "표")
 * - example: 부족할 때 개선 조언에 붙일 예시
 */
export const KEYWORDS = {
  purpose: {
    keywords: [
      '목적', '하고 싶다', '하고 싶어', '싶어요', '싶습니다',
      '만들어줘', '작성해줘', '써줘', '알려줘', '정리해줘', '추천해줘',
      '요약해줘', '설명해줘', '고쳐줘', '바꿔줘', '번역해줘', '짜줘', '주세요',
    ],
    example: '"홍보 글을 작성해줘"',
  },
  situation: {
    keywords: ['저는', '나는', '제가', '내가', '현재', '지금', '요즘', '상황', '때문에', '운영', '준비 중', '하고 있'],
    example: '"저는 동네에서 공방을 운영하고 있어요"',
  },
  audience: {
    keywords: [
      '대상', '독자', '시청자', '청중', '수강생', '고객', '구독자', '팔로워', '초보자', '에게',
      '20대', '30대', '40대', '50대', '60대', '70대', '80대',
    ],
    example: '"50대 초보자에게"',
  },
  role: {
    keywords: ['처럼', '로서', '입장에서', '관점에서', '역할', '전문가'],
    example: '"마케팅 전문가처럼"',
  },
  format: {
    keywords: ['표', '목록', '칼럼', '코드', '대본', '번호', '가지', '문단', '글자', '줄로', '단계'],
    exclude: ['목표', '발표', '대표', '투표', '표현', '표정', '표시'],
    example: '"표로 정리해줘", "5가지 목록으로"',
  },
  tone: {
    keywords: ['친근하게', '전문적으로', '따뜻하게', '비판적으로', '정중하게', '재미있게', '쉽게', '말투', '톤', '어조'],
    example: '"따뜻하게", "친근하게"',
  },
}

const removeSpaces = (s) => s.replace(/\s+/g, '')

/** 한 항목에서 질문에 들어 있는 키워드를 찾는다. */
function findKeywords(text, { keywords, exclude = [] }) {
  const cleaned = exclude.reduce((t, word) => t.split(removeSpaces(word)).join(' '), text)
  return keywords.filter((k) => cleaned.includes(removeSpaces(k)))
}

/**
 * 키워드로 질문을 분석한다. AI 없이 작동한다.
 *
 * @param {string} question 사용자가 입력한 질문
 * @returns {{
 *   score: number,         // 0~100점 (충족 항목 수 ÷ 6 × 100)
 *   level: string,         // 기초 | 보통 | 좋음 | 매우 좋음
 *   met: string[],         // 충족 항목 이름 예) ['목적', '형식']
 *   missing: string[],     // 부족 항목 이름 예) ['대상', '말투']
 *   strengths: string[],   // 좋은 점
 *   weaknesses: string[],  // 보완할 점
 *   directions: string[],  // 개선 방향 (예시 포함)
 *   details: { id: string, label: string, met: boolean, matched: string[] }[]
 * }}
 */
export function analyzeByKeywords(question) {
  const text = removeSpaces(question)

  const details = CRITERIA.map((c) => {
    const matched = findKeywords(text, KEYWORDS[c.id])
    return { id: c.id, label: c.label, met: matched.length > 0, matched }
  })

  const metCriteria = CRITERIA.filter((c, i) => details[i].met)
  const missingCriteria = CRITERIA.filter((c, i) => !details[i].met)
  const score = Math.round((metCriteria.length / CRITERIA.length) * 100)

  return {
    score,
    level: getLevel(score),
    met: metCriteria.map((c) => c.label),
    missing: missingCriteria.map((c) => c.label),
    strengths: metCriteria.map((c) => c.strength),
    weaknesses: missingCriteria.map((c) => c.weakness),
    directions: missingCriteria.map((c) => `${c.direction} 예) ${KEYWORDS[c.id].example}`),
    details,
  }
}
