import { CRITERIA, STATUS } from '../criteria.js'
import { analyzeByKeywords } from './keywordAnalyzer.js'
import { josa, joinWithAnd } from './korean.js'

/** 키워드 분석 결과를 화면용 평가(별점, 총평, 기준 카드)로 바꾼다. */
export function evaluate(question) {
  const analysis = analyzeByKeywords(question)

  const criteria = CRITERIA.map((c) => {
    const detail = analysis.details.find((d) => d.id === c.id)
    const status = detail.met ? STATUS.GOOD : STATUS.MISSING
    return { id: c.id, label: c.label, question: c.question, status, message: c.messages[status] }
  })

  const stars = 1 + Math.round((analysis.score / 100) * 4)

  return { score: analysis.score, stars, summary: summarize(criteria), criteria, advice: analysis.advice }
}

/** "잘한 점 → 보완할 점" 순서로 한 줄 총평을 만든다. */
function summarize(criteria) {
  const labels = (status) => criteria.filter((c) => c.status === status).map((c) => c.label)
  const good = labels(STATUS.GOOD)
  const partial = labels(STATUS.PARTIAL)
  const missing = labels(STATUS.MISSING)

  if (missing.length === 0 && partial.length === 0) {
    return '모든 기준을 잘 갖춘 훌륭한 질문이에요!'
  }

  const praise = good.length > 0
    ? `${josa(good[0], '이', '가')} 잘 드러나 있어요!`
    : '질문을 직접 적어 본 것부터 좋은 시작이에요!'

  const advice = missing.length > 0
    ? `${josa(joinWithAnd(missing.slice(0, 2)), '을', '를')} 더하면 훨씬 좋아져요.`
    : `${josa(joinWithAnd(partial.slice(0, 2)), '을', '를')} 조금만 더 분명히 하면 완벽해요.`

  return `${praise} ${advice}`
}
