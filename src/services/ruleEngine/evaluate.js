import { CRITERIA, STATUS } from '../criteria.js'
import { analyzeByKeywords } from './keywordAnalyzer.js'

/** 키워드 분석 결과를 화면용 평가 결과로 바꾼다. */
export function evaluate(question) {
  const { score, level, strengths, weaknesses, directions, details } = analyzeByKeywords(question)

  const criteria = CRITERIA.map((c, i) => ({
    id: c.id,
    label: c.label,
    status: details[i].met ? STATUS.GOOD : STATUS.MISSING,
  }))

  return { score, level, criteria, strengths, weaknesses, directions }
}
