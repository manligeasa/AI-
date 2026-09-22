import { CRITERIA } from './criteria.js'
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

/** 제공자가 빠뜨린 기준 이름·안내 문구를 공통 목록으로 채운다. */
function withCriteriaInfo(result) {
  const criteria = CRITERIA.map((c) => {
    const found = result.evaluation.criteria.find((r) => r.id === c.id) ?? { status: 'missing' }
    return {
      ...found,
      id: c.id,
      label: c.label,
      question: c.question,
      message: found.message ?? c.messages[found.status],
    }
  })
  const segments = result.improvement.segments
  return {
    evaluation: { ...result.evaluation, criteria },
    improvement: {
      ...result.improvement,
      text: result.improvement.text ?? segments.map((s) => s.text).join(' '),
      hasBlanks: segments.some((s) => s.added && s.text.includes('[')),
    },
  }
}
