import { colors } from './theme/colors';

/** 하단 탭 4개. 순서·이름·색·아이콘·소개 문구를 여기서 한 번에 관리한다. */
export const TABS = [
  {
    key: 'roleplay',
    label: '상황극',
    color: colors.pink,
    icon: require('./assets/lottie/roleplay.json'),
    description: 'AI와 역할을 나눠 실제 상황처럼 대화를 연습해요.',
    features: ['병원 예약, 손주와 영상통화 등 생활 속 상황 고르기', 'AI가 상대 역할을 맡아 한 마디씩 주고받기', '대화가 끝나면 잘한 점과 더 좋은 표현 알려 주기'],
  },
  {
    key: 'audio',
    label: '오디오',
    color: colors.blue,
    icon: require('./assets/lottie/audio.json'),
    description: '눈이 피곤할 땐 귀로 들으며 배워요.',
    features: ['생성형 AI 기초 개념을 짧은 음성 강의로 듣기', '재생 속도 조절과 이어 듣기', '들은 내용을 한 줄로 정리해 보여 주기'],
  },
  {
    key: 'quiz',
    label: '퀴즈',
    color: colors.lime,
    icon: require('./assets/lottie/quiz.json'),
    description: '쉬운 OX 퀴즈로 디지털 상식을 다져요.',
    features: ['하루 5문제 AI·디지털 리터러시 퀴즈', '틀린 문제는 쉬운 해설과 함께 다시 풀기', '맞힌 개수와 연속 학습 일수 기록'],
  },
  {
    key: 'cards',
    label: '소통 카드',
    color: colors.purple,
    icon: require('./assets/lottie/cards.json'),
    description: 'AI에게 바로 쓸 수 있는 문장을 카드로 모아 봐요.',
    features: ['칼럼·대본·강의안 등 목적별 질문 문장 카드', '카드를 눌러 바로 복사하기', '마음에 드는 카드는 즐겨찾기로 보관'],
  },
];
