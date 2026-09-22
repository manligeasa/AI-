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
  it('빠진 기준만 덧붙이고 원래 질문은 그대로 둔다', () => {
    const q = '강의 자료 만들어줘'
    const imp = improve(q, evaluate(q))
    expect(imp.segments.find((s) => !s.added).text).toBe(`${q}.`)
    expect(imp.text).toContain('교육 전문 강사')
    expect(imp.text).toContain('[대상: 예)')
    expect(imp.reasons).toHaveLength(5)
  })

  it('목적이 없으면 원하는 일 빈칸을 원래 질문 뒤에 붙인다', () => {
    const imp = improve('건강', evaluate('건강'))
    const i = imp.segments.findIndex((s) => !s.added)
    expect(imp.segments[i + 1].text).toContain('[원하는 일')
  })
})
