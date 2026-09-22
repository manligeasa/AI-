import { describe, expect, it } from 'vitest'
import { evaluate } from './evaluate.js'
import { improve } from './improve.js'

const statusOf = (evaluation) =>
  Object.fromEntries(evaluation.criteria.map((c) => [c.id, c.status]))

describe('evaluate', () => {
  it('짧은 질문은 목적만 충분하고 별이 적다', () => {
    const e = evaluate('블로그 글 써줘')
    expect(statusOf(e)).toEqual({
      purpose: 'good', situation: 'missing', audience: 'missing',
      role: 'missing', format: 'missing', tone: 'missing',
    })
    expect(e.stars).toBe(2)
    expect(e.summary).toBe('목적이 잘 드러나 있어요! 상황과 대상을 더하면 훨씬 좋아져요.')
  })

  it('6가지를 모두 갖춘 질문은 별 5개다', () => {
    const e = evaluate(
      'SNS 글쓰기 전문가처럼 답해줘. 저는 60대이고 공방을 운영하는데, 페이스북 친구들에게 보여줄 홍보 글을 3문단으로 따뜻한 말투로 써줘.',
    )
    expect(Object.values(statusOf(e)).every((s) => s === 'good')).toBe(true)
    expect(e.stars).toBe(5)
  })

  it('약한 단서는 조금 부족으로 판정한다', () => {
    const s = statusOf(evaluate('수강생 강의 자료 간단히 만들어줘'))
    expect(s.audience).toBe('partial')
    expect(s.format).toBe('partial')
    expect(s.role).toBe('missing')
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
