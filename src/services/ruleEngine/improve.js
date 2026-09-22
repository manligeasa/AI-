import { STATUS } from '../criteria.js'
import { detectDomain, SENSITIVE_TOPIC } from './domains.js'

/** 부족한 항목에 넣을 기본값. 여기만 바꾸면 개선 질문 전체에 반영된다. */
export const DEFAULTS = {
  audience: 'AI 초보자',
  format: '목록',
  tone: '친근하고 전문적인 문체',
  purposeVerb: '설명해줘',
}

const REASONS = {
  role: 'AI에게 전문가 역할을 맡겨 답의 수준을 높였어요.',
  audience: '누구를 위한 답인지 정해 눈높이를 맞췄어요.',
  purpose: 'AI가 해야 할 일을 분명히 적었어요.',
  format: '답의 모양을 정해 한눈에 보기 쉽게 했어요.',
  tone: '말투를 정해 읽기 편한 글이 나오게 했어요.',
  sensitive: '민감한 주제라서 사실 확인과 존중하는 표현을 요청했어요.',
}

const hasBatchim = (word) => {
  const code = word.charCodeAt(word.length - 1) - 0xac00
  return code >= 0 && code <= 11171 && code % 28 !== 0
}
/** 목적격 조사: '초보자' → '초보자를', '독자층' → '독자층을' */
const withObject = (word) => word + (hasBatchim(word) ? '을' : '를')
/** 방향 조사: '문체' → '문체로', '목록' → '목록으로' (ㄹ 받침은 '로') */
const withDirection = (word) => {
  const code = word.charCodeAt(word.length - 1) - 0xac00
  const final = code >= 0 && code <= 11171 ? code % 28 : 0
  return word + (final === 0 || final === 8 ? '로' : '으로')
}

/** 원래 질문 끝의 마침표·공백을 정리한다. 물음표는 살린다. */
const tidy = (text) => text.trim().replace(/[.\s~!]+$/, '')

/**
 * 원래 질문을 바탕으로 개선된 질문을 만든다.
 * 부족한 항목은 DEFAULTS 값으로 채운다. 상황은 사용자만 아는 정보라 조언(tip)으로 안내한다.
 *
 * 결과 모양 (줄 단위):
 *   {역할}의 입장에서,             ← 역할 부족 시
 *   AI 초보자를 대상으로,           ← 대상 부족 시
 *   {원래 질문}.                   ← 목적 부족 시 "~에 대해 설명해줘" 추가
 *   목록 형식으로 정리하고, 친근하고 전문적인 문체로 작성해줘.  ← 형식·말투 부족 시
 *
 * segments의 added=true 부분은 화면에서 형광펜으로 표시한다.
 */
export function improve(question, evaluation) {
  const missing = new Set(
    evaluation.criteria.filter((c) => c.status !== STATUS.GOOD).map((c) => c.id),
  )
  const segments = []
  const reasons = []
  const addLine = (id, text) => {
    segments.push({ text, added: true })
    reasons.push(REASONS[id])
  }

  // 1. 역할·대상은 원래 질문 앞에 붙인다
  if (missing.has('role')) addLine('role', `${detectDomain(question).role}의 입장에서,\n`)
  if (missing.has('audience')) addLine('audience', `${withObject(DEFAULTS.audience)} 대상으로,\n`)

  // 2. 원래 질문 (목적이 없으면 "~에 대해 설명해줘"를 덧붙인다)
  const core = tidy(question)
  const isQuestion = core.endsWith('?')
  if (missing.has('purpose') && !isQuestion) {
    segments.push({ text: core, added: false })
    addLine('purpose', `에 대해 ${DEFAULTS.purposeVerb}.`)
  } else {
    segments.push({ text: isQuestion ? core : `${core}.`, added: false })
  }

  // 3. 형식·말투는 마지막 한 줄로 묶는다
  const format = missing.has('format') ? `${withDirection(`${DEFAULTS.format} 형식`)} 정리` : null
  const tone = missing.has('tone') ? withDirection(DEFAULTS.tone) : null
  const lastLine = format && tone
    ? `${format}하고, ${tone} 작성해줘.`
    : format ? `${format}해줘.` : tone ? `${tone} 작성해줘.` : null
  if (lastLine) {
    segments.push({ text: '\n', added: false })
    segments.push({ text: lastLine, added: true })
    if (format) reasons.push(REASONS.format)
    if (tone) reasons.push(REASONS.tone)
  }

  // 4. 정치·종교 등 민감한 주제는 사실 확인과 존중하는 표현을 요청한다
  if (SENSITIVE_TOPIC.test(question)) {
    segments.push({ text: '\n', added: false })
    segments.push({ text: '사실에 근거하고, 생각이 다른 사람도 존중하는 표현으로 써줘.', added: true })
    reasons.push(REASONS.sensitive)
  }

  return {
    segments,
    text: segments.map((s) => s.text).join(''),
    reasons,
    tip: missing.has('situation')
      ? '내 상황(나이, 하는 일, 질문하는 이유)을 한 줄 더하면 나에게 더 딱 맞는 답이 나와요.'
      : null,
  }
}
