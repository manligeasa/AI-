import { useEffect, useReducer, useRef, useState } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import HintText from '../components/HintText';
import NeonBurst from '../components/NeonBurst';
import NeonButton from '../components/NeonButton';
import NeonCard from '../components/NeonCard';
import OXButton from '../components/OXButton';
import OopsPopup from '../components/OopsPopup';
import { loadData, saveData } from '../storage/localStore';
import data from '../data/quiz/ox.json';
import { colors, glow } from '../theme/colors';
import { font, radius, space } from '../theme/typography';

const SECONDS = data.secondsPerQuestion;
const TOTAL = data.questions.length;
const shuffle = (list) => [...list].sort(() => Math.random() - 0.5);

/**
 * 게임 진행 단계
 * intro(시작 전) → question(푸는 중) → correct(정답 효과) 또는 oops(오답·시간 초과 팝업) → … → result(결과)
 */
const initialState = { phase: 'intro', questions: data.questions, index: 0, score: 0, reason: null, best: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'start':
      return { ...state, phase: 'question', questions: shuffle(data.questions), index: 0, score: 0, reason: null };
    case 'answer': {
      if (state.phase !== 'question') return state;
      const correct = state.questions[state.index].answer === action.value;
      return correct ? { ...state, phase: 'correct', score: state.score + 1 } : { ...state, phase: 'oops', reason: 'wrong' };
    }
    case 'timeout':
      return state.phase === 'question' ? { ...state, phase: 'oops', reason: 'timeout' } : state;
    case 'next':
      if (state.index === TOTAL - 1) return { ...state, phase: 'result', best: Math.max(state.best, state.score) };
      return { ...state, phase: 'question', index: state.index + 1, reason: null };
    case 'loadBest':
      return { ...state, best: action.best };
    default:
      return state;
  }
}

/** 퀴즈: 문제마다 10초 안에 거대한 O / X 버튼을 누르는 스피드 OX 퀴즈 */
export default function OXQuizScreen() {
  const { width, height } = useWindowDimensions();
  // 화면 폭의 절반씩 차지하는 거대한 버튼 (세로로 조금 더 길게)
  const buttonWidth = Math.floor(Math.min((width - space.md * 3) / 2, 220));
  const buttonHeight = Math.floor(Math.max(140, Math.min(buttonWidth * 1.35, height - 490)));
  const [state, dispatch] = useReducer(reducer, initialState);
  const [secondsLeft, setSecondsLeft] = useState(SECONDS);
  const timeBar = useRef(new Animated.Value(1)).current;
  const burstRef = useRef(null);
  const { phase, questions, index, score, reason, best } = state;
  const q = questions[index];

  // 저장된 최고 기록 불러오기
  useEffect(() => {
    loadData().then((d) => dispatch({ type: 'loadBest', best: d.quiz?.oxBest ?? 0 }));
  }, []);

  // 게임이 끝나면 최고 기록을 휴대폰 안 JSON 파일에 저장
  useEffect(() => {
    if (phase !== 'result') return;
    loadData()
      .then((d) => {
        if (best > (d.quiz?.oxBest ?? 0)) return saveData({ ...d, quiz: { ...d.quiz, oxBest: best } });
      })
      .catch(() => {});
  }, [phase, best]);

  // 문제마다 제한 시간 재기: 줄어드는 네온 막대 + 남은 초 숫자
  useEffect(() => {
    if (phase !== 'question') return undefined;
    setSecondsLeft(SECONDS);
    timeBar.setValue(1);
    const bar = Animated.timing(timeBar, { toValue: 0, duration: SECONDS * 1000, easing: Easing.linear, useNativeDriver: true });
    bar.start();
    const tick = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    const timeout = setTimeout(() => dispatch({ type: 'timeout' }), SECONDS * 1000);
    return () => {
      bar.stop();
      clearInterval(tick);
      clearTimeout(timeout);
    };
  }, [phase, index, timeBar]);

  // 정답 효과를 잠깐 보여 준 뒤 다음 문제로
  useEffect(() => {
    if (phase !== 'correct') return undefined;
    const t = setTimeout(() => dispatch({ type: 'next' }), 900);
    return () => clearTimeout(t);
  }, [phase]);

  const answer = (value, event) => {
    if (phase !== 'question') return;
    if (q.answer === value) burstRef.current?.burst(event.nativeEvent.pageX, event.nativeEvent.pageY);
    dispatch({ type: 'answer', value });
  };

  if (phase === 'intro' || phase === 'result') {
    return (
      <ScrollView contentContainerStyle={styles.content}>
        {phase === 'intro' ? (
          <NeonCard accent={colors.lime}>
            <HintText hint={data.title} style={styles.bigTitle}>
              {data.title} ⚡
            </HintText>
            {data.rules.map((r) => (
              <HintText key={r} hint={r} style={styles.rule}>
                • {r}
              </HintText>
            ))}
            <HintText hint="내 최고 기록: {n} / {total}" params={{ n: best, total: TOTAL }} style={styles.best}>
              내 최고 기록: {best} / {TOTAL}
            </HintText>
            <NeonButton title="시작하기" color={colors.lime} onPress={() => dispatch({ type: 'start' })} style={styles.start} />
          </NeonCard>
        ) : (
          <Result score={score} best={best} onRestart={() => dispatch({ type: 'start' })} />
        )}
      </ScrollView>
    );
  }

  const urgent = secondsLeft <= 3;
  const barColor = urgent ? colors.pink : colors.lime;

  return (
    <View style={styles.root}>
      <View style={styles.play}>
        <View style={styles.statusRow}>
          <HintText hint="문제 {n} / {total}" params={{ n: index + 1, total: TOTAL }} style={styles.status}>
            문제 {index + 1} / {TOTAL}
          </HintText>
          <HintText hint="⭐ {score}점" params={{ score }} style={[styles.status, { color: colors.lime }]}>
            ⭐ {score}점
          </HintText>
        </View>

        <View style={styles.timerRow}>
          <Text style={[styles.seconds, { color: barColor }]} accessibilityLabel={`남은 시간 ${secondsLeft}초`}>
            {secondsLeft}
          </Text>
          <View style={styles.track}>
            <Animated.View style={[styles.bar, { backgroundColor: barColor, transform: [{ scaleX: timeBar }] }, glow(barColor, 10)]} />
          </View>
        </View>

        <NeonCard accent={colors.blue} style={styles.questionCard}>
          <HintText style={styles.question}>{q.q}</HintText>
        </NeonCard>

        <View style={styles.oxRow}>
          <OXButton mark="O" label="맞아요" color={colors.blue} width={buttonWidth} height={buttonHeight} onPress={(e) => answer(true, e)} disabled={phase !== 'question'} />
          <OXButton mark="X" label="아니에요" color={colors.pink} width={buttonWidth} height={buttonHeight} onPress={(e) => answer(false, e)} disabled={phase !== 'question'} />
        </View>

        <Text style={[styles.correct, { opacity: phase === 'correct' ? 1 : 0 }]}>정답이에요! 🎉 +1</Text>
      </View>

      <OopsPopup
        visible={phase === 'oops'}
        emoji={reason === 'timeout' ? '⏰' : '🙈'}
        title={reason === 'timeout' ? '앗! 시간이 다 됐어요!' : q.oops}
        note={reason === 'timeout' ? { hint: '정답은 {answer}예요.', params: { answer: q.answer ? 'O' : 'X' } } : null}
        text={q.explain}
        buttonTitle={index === TOTAL - 1 ? '결과 보기' : '알겠어요! 다음 문제 →'}
        onClose={() => dispatch({ type: 'next' })}
      />
      <NeonBurst ref={burstRef} />
    </View>
  );
}

function Result({ score, best, onRestart }) {
  const message = score === TOTAL ? '완벽해요! OX 박사님이에요.' : score >= TOTAL * 0.7 ? '아주 잘했어요!' : '괜찮아요. 한 번 더 하면 더 잘할 거예요.';
  return (
    <NeonCard accent={colors.lime} style={styles.result}>
      <Text style={styles.resultEmoji}>{score === TOTAL ? '🏆' : '👏'}</Text>
      <Text style={styles.resultScore}>
        {score} <Text style={styles.resultTotal}>/ {TOTAL}</Text>
      </Text>
      <HintText style={styles.rule}>{message}</HintText>
      <HintText hint="내 최고 기록: {n} / {total}" params={{ n: best, total: TOTAL }} style={styles.best}>
        내 최고 기록: {best} / {TOTAL}
      </HintText>
      <NeonButton title="다시 도전하기" color={colors.lime} onPress={onRestart} style={styles.start} />
    </NeonCard>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: space.md, paddingBottom: space.xl * 2 },
  play: { flex: 1, padding: space.md, gap: space.md },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between' },
  status: { fontSize: font.small, fontWeight: '800', color: colors.textMuted },
  timerRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  seconds: { width: 44, fontSize: 30, fontWeight: '900', textAlign: 'center' },
  track: { flex: 1, height: 12, borderRadius: 6, backgroundColor: colors.surfaceAlt, overflow: 'hidden' },
  bar: { height: 12, borderRadius: 6, transformOrigin: 'left' },
  questionCard: { minHeight: 120, justifyContent: 'center' },
  question: { fontSize: 23, fontWeight: '900', color: colors.text, textAlign: 'center', lineHeight: 33 },
  oxRow: { flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' },
  correct: { marginBottom: space.md, fontSize: font.heading, fontWeight: '900', color: colors.lime, textAlign: 'center' },
  bigTitle: { fontSize: 26, fontWeight: '900', color: colors.lime },
  rule: { fontSize: font.body, color: colors.text, lineHeight: 27 },
  best: { fontSize: font.small, color: colors.textMuted, marginTop: space.xs },
  start: { marginTop: space.md, alignSelf: 'stretch' },
  result: { alignItems: 'center', paddingVertical: space.xl, borderRadius: radius.card },
  resultEmoji: { fontSize: 56 },
  resultScore: { fontSize: 56, fontWeight: '900', color: colors.lime },
  resultTotal: { fontSize: 28, color: colors.textMuted },
});
