/**
 * OpenAI로 질문을 분석하는 자리(아직 미연결).
 *
 * 연결 방법:
 * 1. API 키는 브라우저에 두면 노출되므로, 서버(예: /api/analyze)를 하나 두고 그곳에서 OpenAI를 호출한다.
 * 2. 서버는 아래 ANALYSIS_SCHEMA 모양의 JSON을 돌려주게 한다.
 *    (ruleBasedProvider와 똑같은 모양이어야 화면을 고치지 않아도 된다.)
 * 3. .env 파일에 VITE_COACH_PROVIDER=openai 를 적는다.
 */

/** 서버와 주고받을 결과 모양 — 규칙 기반 결과와 같다. */
export const ANALYSIS_SCHEMA = {
  evaluation: {
    score: '0~100 정수',
    level: '기초 | 보통 | 좋음 | 매우 좋음 (생략하면 점수로 자동 계산)',
    criteria: [
      { id: 'purpose | situation | audience | role | format | tone', status: 'good | partial | missing' },
    ],
    strengths: ['좋은 점 (생략하면 기준 상태로 자동 작성)'],
    weaknesses: ['보완할 점 (생략 가능)'],
    directions: ['개선 방향 (생략 가능)'],
  },
  improvement: {
    segments: [{ text: '문장 조각 (줄바꿈은 \\n, 이어 붙여 한 문장이 됨)', added: 'true면 새로 더한 부분' }],
    reasons: ['왜 좋아졌는지 한 문장씩'],
    tip: '추가 조언 또는 null',
  },
}

export const openaiProvider = {
  name: 'openai',
  async analyze(question) {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    })
    if (!response.ok) throw new Error('AI 분석 서버에 연결하지 못했어요.')
    return response.json()
  },
}
