import { describe, expect, it } from 'vitest'
import { evaluate } from './evaluate.js'
import { improve } from './improve.js'
import { analyzeByKeywords } from './keywordAnalyzer.js'
import { getLevel } from '../criteria.js'

const statusOf = (evaluation) =>
  Object.fromEntries(evaluation.criteria.map((c) => [c.id, c.status]))

describe('evaluate', () => {
  it('짧은 질문은 목적만 충분하고 별이 적다', () => {
    const e = evaluate('블로그 글 써줘')
    expect(statusOf(e)).toEqual({
      purpose: 'good', situation: 'missing', audience: 'missing',
      role: 'missing', format: 'missing', tone: 'missing',
    })
    expect(e.score).toBe(17)
    expect(e.level).toBe('기초')
    expect(e.strengths).toEqual(['원하는 작업이 분명하게 드러납니다.'])
    expect(e.weaknesses).toHaveLength(5)
  })

  it('6가지를 모두 갖춘 질문은 별 5개다', () => {
    const e = evaluate(
      'SNS 글쓰기 전문가처럼 답해줘. 저는 60대이고 공방을 운영하는데, 페이스북 친구들에게 보여줄 홍보 글을 3문단으로 따뜻한 말투로 써줘.',
    )
    expect(Object.values(statusOf(e)).every((s) => s === 'good')).toBe(true)
    expect(e.score).toBe(100)
    expect(e.level).toBe('매우 좋음')
    expect(e.weaknesses).toEqual([])
  })

})

describe('analyzeByKeywords', () => {
  it('키워드로 충족·부족 항목과 점수를 돌려준다', () => {
    const r = analyzeByKeywords('50대 초보자를 위한 유튜브 대본을 친근하게 작성해줘')
    expect(r.met).toEqual(['목적', '대상', '형식', '말투'])
    expect(r.missing).toEqual(['상황', '역할'])
    expect(r.score).toBe(67)
    expect(r.level).toBe('보통')
    expect(r.weaknesses).toEqual(['내 상황 설명이 없습니다.', 'AI에게 맡길 역할이 없습니다.'])
    expect(r.directions).toHaveLength(2)
    expect(r.directions[1]).toContain('예) "마케팅 전문가처럼"')
  })

  it('띄어쓰기가 달라도 키워드를 찾는다', () => {
    expect(analyzeByKeywords('글을 만들어 줘').met).toContain('목적')
  })

  it('"목표"의 "표"는 형식으로 보지 않는다', () => {
    const r = analyzeByKeywords('올해 목표를 알려줘')
    expect(r.missing).toContain('형식')
    expect(r.details.find((d) => d.id === 'format').matched).toEqual([])
  })

  it('키워드가 하나도 없으면 0점이다', () => {
    const r = analyzeByKeywords('건강')
    expect(r.score).toBe(0)
    expect(r.met).toEqual([])
  })
})

describe('getLevel', () => {
  it('점수 구간을 수준으로 바꾼다', () => {
    expect([0, 39, 40, 69, 70, 89, 90, 100].map(getLevel)).toEqual([
      '기초', '기초', '보통', '보통', '좋음', '좋음', '매우 좋음', '매우 좋음',
    ])
  })
})

describe('improve', () => {
  const run = (q) => improve(q, evaluate(q))

  it('부족한 대상·형식·말투를 기본값으로 채운다', () => {
    expect(run('강의 자료 만들어줘').text).toBe(
      '경험 많은 교육 전문 강사의 입장에서,\n'
      + 'AI 초보자를 대상으로,\n'
      + '강의 자료 만들어줘.\n'
      + '목록 형식으로 정리하고, 친근하고 전문적인 문체로 작성해줘.',
    )
  })

  it('충족한 항목은 덧붙이지 않는다', () => {
    const imp = run('마케팅 전문가처럼 50대 독자를 위한 칼럼을 따뜻하게 작성해줘')
    expect(imp.text).toBe('마케팅 전문가처럼 50대 독자를 위한 칼럼을 따뜻하게 작성해줘.')
    expect(imp.reasons).toEqual([])
  })

  it('형식만 부족하면 형식 줄만 붙인다', () => {
    const imp = run('전문가처럼 초보자에게 친근하게 알려줘')
    expect(imp.text.split('\n').at(-1)).toBe('목록 형식으로 정리해줘.')
  })

  it('목적이 없으면 "~에 대해 설명해줘"를 붙이고 원래 질문은 그대로 둔다', () => {
    const imp = run('건강')
    expect(imp.text).toContain('건강에 대해 설명해줘.')
    expect(imp.segments.find((s) => !s.added && s.text.trim()).text).toBe('건강')
  })

  it('상황이 없으면 조언으로 안내한다', () => {
    expect(run('블로그 글 써줘').tip).toContain('내 상황')
  })
})
