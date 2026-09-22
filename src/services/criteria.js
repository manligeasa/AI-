/**
 * 질문 평가 기준 6가지.
 * 화면과 모든 분석 방식(규칙 기반, OpenAI 등)이 같은 목록을 공유한다.
 *
 * - strength: 충족했을 때 "좋은 점"에 보일 문장
 * - weakness: 부족할 때 "보완할 점"에 보일 문장
 * - direction: 부족할 때 "개선 방향"에 보일 문장
 */
export const CRITERIA = [
  {
    id: 'purpose',
    label: '목적',
    question: '무엇을 원하나요?',
    strength: '원하는 작업이 분명하게 드러납니다.',
    weakness: '원하는 작업이 드러나지 않습니다.',
    direction: '"작성해줘", "정리해줘"처럼 원하는 일을 분명히 적으세요.',
  },
  {
    id: 'situation',
    label: '상황',
    question: '어떤 상황인가요?',
    strength: '내 상황이 잘 설명되어 있습니다.',
    weakness: '내 상황 설명이 없습니다.',
    direction: '나이, 하는 일, 질문하는 이유 등 내 상황을 한 줄 더하세요.',
  },
  {
    id: 'audience',
    label: '대상',
    question: '누구를 위한 건가요?',
    strength: '누구를 위한 것인지 분명합니다.',
    weakness: '대상 독자가 없습니다.',
    direction: '누구에게 보여줄 글인지 추가하세요.',
  },
  {
    id: 'role',
    label: '역할',
    question: 'AI가 누구처럼 답할까요?',
    strength: 'AI에게 역할을 잘 맡겼습니다.',
    weakness: 'AI에게 맡길 역할이 없습니다.',
    direction: 'AI가 어떤 전문가처럼 답할지 정하세요.',
  },
  {
    id: 'format',
    label: '형식',
    question: '어떤 모양으로 받을까요?',
    strength: '원하는 결과물 형식이 정해져 있습니다.',
    weakness: '결과물 형식이 없습니다.',
    direction: '표, 칼럼, 대본 등 형식을 지정하세요.',
  },
  {
    id: 'tone',
    label: '말투',
    question: '어떤 느낌으로 쓸까요?',
    strength: '원하는 말투가 드러납니다.',
    weakness: '원하는 말투가 없습니다.',
    direction: '친근하게, 전문적으로 등 원하는 말투를 정하세요.',
  },
]

export const STATUS = {
  GOOD: 'good',
  PARTIAL: 'partial',
  MISSING: 'missing',
}

/** 점수 구간별 수준 (min 이상이면 해당 수준) */
export const LEVELS = [
  { min: 90, label: '매우 좋음' },
  { min: 70, label: '좋음' },
  { min: 40, label: '보통' },
  { min: 0, label: '기초' },
]

/** 100점 만점 점수를 수준 이름으로 바꾼다. 예) 65 → '보통' */
export function getLevel(score) {
  return LEVELS.find((l) => score >= l.min).label
}
