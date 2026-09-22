/**
 * 질문 평가 기준 6가지.
 * 화면과 모든 분석 방식(규칙 기반, OpenAI 등)이 같은 목록을 공유한다.
 */
export const CRITERIA = [
  {
    id: 'purpose',
    label: '목적',
    question: '무엇을 원하나요?',
    messages: {
      good: '원하는 일이 분명하게 적혀 있어요.',
      partial: '원하는 일이 조금 흐릿해요. "정리해줘", "추천해줘"처럼 끝맺어 보세요.',
      missing: 'AI가 무엇을 해야 할지 알 수 없어요. 원하는 일을 적어 주세요.',
    },
  },
  {
    id: 'situation',
    label: '상황',
    question: '어떤 상황인가요?',
    messages: {
      good: '내 상황을 잘 알려 주었어요.',
      partial: '상황이 조금 적혀 있어요. 한 가지만 더 알려 주면 좋아요.',
      missing: '내 상황(나이, 하는 일, 이유)을 알려 주면 딱 맞는 답이 나와요.',
    },
  },
  {
    id: 'audience',
    label: '대상',
    question: '누구를 위한 건가요?',
    messages: {
      good: '누구를 위한 것인지 분명해요.',
      partial: '대상이 보이지만, "○○에게"처럼 더 분명히 적어 보세요.',
      missing: '누가 읽거나 들을지 알려 주세요.',
    },
  },
  {
    id: 'role',
    label: '역할',
    question: 'AI가 누구처럼 답할까요?',
    messages: {
      good: 'AI에게 역할을 잘 맡겼어요.',
      partial: '직업은 보이지만, "○○처럼 답해줘"라고 역할을 맡겨 보세요.',
      missing: 'AI에게 전문가 역할을 맡기면 답의 수준이 올라가요.',
    },
  },
  {
    id: 'format',
    label: '형식',
    question: '어떤 모양으로 받을까요?',
    messages: {
      good: '답을 받을 모양이 분명해요.',
      partial: '분량이 조금 흐릿해요. "5가지", "300자"처럼 숫자로 적어 보세요.',
      missing: '몇 개, 몇 줄, 표나 목록 등 원하는 모양을 알려 주세요.',
    },
  },
  {
    id: 'tone',
    label: '말투',
    question: '어떤 느낌으로 쓸까요?',
    messages: {
      good: '원하는 말투가 잘 드러나요.',
      partial: '느낌이 조금 보여요. "따뜻한 말투로"처럼 분명히 적어 보세요.',
      missing: '친근하게, 정중하게 등 원하는 말투를 알려 주세요.',
    },
  },
]

export const STATUS = {
  GOOD: 'good',
  PARTIAL: 'partial',
  MISSING: 'missing',
}
