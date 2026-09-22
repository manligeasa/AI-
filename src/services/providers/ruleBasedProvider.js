import { evaluate } from '../ruleEngine/evaluate.js'
import { improve } from '../ruleEngine/improve.js'

/** AI 없이 규칙으로 질문을 분석한다. */
export const ruleBasedProvider = {
  name: 'rule',
  async analyze(question) {
    const evaluation = evaluate(question)
    const improvement = improve(question, evaluation)
    return { evaluation, improvement }
  },
}
