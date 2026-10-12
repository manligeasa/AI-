import { colors } from './theme/colors';
import condolenceDeck from './data/cards/condolence.json';
import RolePlayScreen from './screens/RolePlayScreen';
import AudioGuideScreen from './screens/AudioGuideScreen';
import CommunicationScreen from './screens/CommunicationScreen';

/**
 * 하단 탭 4개. 순서·이름·색·아이콘·소개 문구를 여기서 한 번에 관리한다.
 * Screen이 있는 탭은 그 화면, deck이 있는 탭은 스와이프 카드 화면,
 * 둘 다 없는 탭은 기본(준비 중) 화면을 보여 준다.
 */
export const TABS = [
  {
    key: 'roleplay',
    label: '상황극',
    color: colors.pink,
    icon: require('./assets/lottie/roleplay.json'),
    Screen: RolePlayScreen,
  },
  {
    key: 'audio',
    label: '오디오',
    color: colors.blue,
    icon: require('./assets/lottie/audio.json'),
    Screen: AudioGuideScreen,
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
    Screen: CommunicationScreen,
    deck: condolenceDeck,
  },
];
