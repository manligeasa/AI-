/**
 * 질문 분석 창구.
 * 웹앱과 같은 규칙 엔진(../src/services)을 그대로 써서, 두 앱의 평가 결과가 항상 같다.
 * 인터넷·서버 없이 휴대폰 안에서 바로 계산한다.
 */
import { ruleBasedProvider } from '../../../src/services/providers/ruleBasedProvider.js';
import { CRITERIA, STATUS } from '../../../src/services/criteria.js';

export const MIN_QUESTION_LENGTH = 2;
export { CRITERIA, STATUS };

export async function analyzeQuestion(question) {
  if (question.trim().length < MIN_QUESTION_LENGTH) {
    throw new Error('질문을 조금 더 적어 주세요.');
  }
  return ruleBasedProvider.analyze(question);
}
