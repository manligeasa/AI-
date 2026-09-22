import { CRITERIA, STATUS, getLevel } from './criteria.js'
import { ruleBasedProvider } from './providers/ruleBasedProvider.js'
import { openaiProvider } from './providers/openaiProvider.js'

const PROVIDERS = {
  [ruleBasedProvider.name]: ruleBasedProvider,
  [openaiProvider.name]: openaiProvider,
}

const providerName = import.meta.env?.VITE_COACH_PROVIDER ?? 'rule'
const provider = PROVIDERS[providerName] ?? ruleBasedProvider

export const MIN_QUESTION_LENGTH = 2

/**
 * 화면이 사용하는 유일한 진입점.
 * 분석 방식(규칙/OpenAI)을 바꿔도 화면 코드는 그대로 둔다.
 */
export async function analyzeQuestion(question) {
  if (question.trim().length < MIN_QUESTION_LENGTH) {
    throw new Error('질문을 조금 더 적어 주세요.')
  }
  const result = await provider.analyze(question)
  return withCriteriaInfo(result)
}

/** 제공자가 빠뜨린 값(기준 이름, 수준, 좋은 점 등)을 공통 규칙으로 채운다. */
function withCriteriaInfo(result) {
  const { evaluation } = result
  const criteria = CRITERIA.map((c) => {
    const found = evaluation.criteria.find((r) => r.id === c.id)
    return { id: c.id, label: c.label, status: found?.status ?? STATUS.MISSING }
  })
  const good = CRITERIA.filter((c, i) => criteria[i].status === STATUS.GOOD)
  const lacking = CRITERIA.filter((c, i) => criteria[i].status !== STATUS.GOOD)
  const score = evaluation.score ?? Math.round((good.length / CRITERIA.length) * 100)

  const segments = result.improvement.segments
  return {
    evaluation: {
      score,
      level: evaluation.level ?? getLevel(score),
      criteria,
      strengths: evaluation.strengths ?? good.map((c) => c.strength),
      weaknesses: evaluation.weaknesses ?? lacking.map((c) => c.weakness),
      directions: evaluation.directions ?? lacking.map((c) => c.direction),
    },
    improvement: {
      ...result.improvement,
      text: result.improvement.text ?? segments.map((s) => s.text).join(' '),
      hasBlanks: segments.some((s) => s.added && s.text.includes('[')),
    },
  }
}
