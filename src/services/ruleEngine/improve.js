import { STATUS } from '../criteria.js'
import { detectDomain } from './domains.js'

/** 기준별로 덧붙일 문장과 "왜 좋아졌나요?" 설명. */
const ADDITIONS = {
  role: {
    text: (d) => `당신은 ${d.role}입니다.`,
    reason: 'AI에게 전문가 역할을 맡겨 답의 수준을 높였어요.',
  },
  situation: {
    text: (d) => `저는 [내 상황: 예) ${d.situationExample}]입니다.`,
    reason: '내 상황을 알려 주어 나에게 딱 맞는 답이 나오게 했어요.',
  },
  purpose: {
    text: () => '[원하는 일: 예) 쉽게 설명해 주세요].',
    reason: 'AI가 해야 할 일을 분명히 적었어요.',
  },
  audience: {
    text: (d) => `읽을 사람은 [대상: 예) ${d.audienceExample}]입니다.`,
    reason: '누구를 위한 것인지 알려 주어 눈높이를 맞췄어요.',
  },
  format: {
    text: (d) => `답은 ${d.format} 정리해 주세요.`,
    reason: '답의 모양과 분량을 정해 바로 쓰기 좋게 했어요.',
  },
  tone: {
    text: (d) => `${d.tone} 말투로 써 주세요.`,
    reason: '원하는 말투를 정해 내 느낌에 맞는 글이 나오게 했어요.',
  },
}

/** 개선된 질문에서 원래 질문 앞뒤에 놓일 문장의 순서 */
const BEFORE = ['role', 'situation']
const AFTER = ['audience', 'format', 'tone']

/**
 * 평가에서 '빠짐'으로 나온 기준을 채운 개선 질문을 만든다.
 * segments의 added=true 부분은 화면에서 형광펜으로 표시한다.
 */
export function improve(question, evaluation) {
  const text = question.trim()
  const domain = detectDomain(text)
  const missing = new Set(
    evaluation.criteria.filter((c) => c.status === STATUS.MISSING).map((c) => c.id),
  )

  const segments = []
  const reasons = []
  const add = (id) => {
    segments.push({ text: ADDITIONS[id].text(domain), added: true })
    reasons.push(ADDITIONS[id].reason)
  }

  const after = AFTER.filter((id) => missing.has(id))
  // 뒤에 문장이 이어지면 원래 질문을 마침표로 끝맺어 읽기 쉽게 한다
  const endsSentence = /[.?!。]$/.test(text) || missing.has('purpose') || after.length === 0

  BEFORE.filter((id) => missing.has(id)).forEach(add)
  segments.push({ text: endsSentence ? text : `${text}.`, added: false })
  if (missing.has('purpose')) add('purpose')
  after.forEach(add)

  const partial = evaluation.criteria.filter((c) => c.status === STATUS.PARTIAL)
  const tip = partial.length > 0
    ? `노란색 기준(${partial.map((c) => c.label).join(', ')})은 직접 조금 더 구체적으로 적어 보세요.`
    : null

  return {
    segments,
    text: segments.map((s) => s.text).join(' '),
    reasons,
    tip,
    hasBlanks: segments.some((s) => s.added && s.text.includes('[')),
  }
}
