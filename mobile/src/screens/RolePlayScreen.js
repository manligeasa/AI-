import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import NeonBurst from '../components/NeonBurst';
import NeonButton from '../components/NeonButton';
import NeonCard from '../components/NeonCard';
import { useRolePlay } from '../state/RolePlayContext';
import { colors, glow } from '../theme/colors';
import { font, radius, space } from '../theme/typography';

/** 상황극 연습: 상황을 보고 알맞은 말을 고르는 선택형 게임 */
export default function RolePlayScreen({ label, color }) {
  const game = useRolePlay();
  const burstRef = useRef(null);
  const scrollRef = useRef(null);

  // 문제가 바뀌면 맨 위로 올린다
  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, [game.index, game.finished]);

  const handleChoose = (i, event) => {
    if (game.answered) return;
    game.select(i);
    // 설명 카드와 '다음' 버튼이 보이도록 아래로 내린다
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 900);
    if (game.scenario.choices[i].correct) {
      const { pageX, pageY } = event.nativeEvent;
      burstRef.current?.burst(pageX, pageY);
    }
  };

  return (
    <View style={styles.root}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.content}>
        <Text style={[styles.label, { color }]}>{label} 연습</Text>
        <Text style={styles.title}>{game.title}</Text>
        {game.finished ? <Result /> : <Question onChoose={handleChoose} />}
      </ScrollView>
      <NeonBurst ref={burstRef} />
    </View>
  );
}

function Question({ onChoose }) {
  const { scenario, index, total, score, selected, answered, isCorrect, next } = useRolePlay();
  const isLast = index === total - 1;

  return (
    <View style={styles.gap}>
      <Progress index={index} total={total} score={score} answered={answered} />

      <NeonCard accent={colors.blue}>
        <Text style={styles.place}>
          {scenario.emoji} {scenario.place}
        </Text>
        <Text style={styles.situation}>{scenario.situation}</Text>
        <View style={styles.bubble}>
          <Text style={styles.speaker}>{scenario.speaker}</Text>
          <Text style={styles.line}>“{scenario.line}”</Text>
        </View>
      </NeonCard>

      <Text style={styles.ask}>뭐라고 말할까요?</Text>
      {scenario.choices.map((choice, i) => (
        <Choice
          key={`${scenario.id}-${i}`}
          text={choice.text}
          state={!answered ? 'idle' : choice.correct ? 'correct' : i === selected ? 'wrong' : 'dim'}
          onPress={(e) => onChoose(i, e)}
        />
      ))}

      {answered && (
        <Feedback correct={isCorrect} text={scenario.choices[selected].feedback}>
          <NeonButton title={isLast ? '결과 보기 🎉' : '다음 상황 →'} color={colors.blue} onPress={next} />
        </Feedback>
      )}
    </View>
  );
}

function Progress({ index, total, score, answered }) {
  const done = index + (answered ? 1 : 0);
  return (
    <View style={styles.progressWrap}>
      <View style={styles.progressText}>
        <Text style={styles.progressLabel}>
          {index + 1} / {total} 번째 상황
        </Text>
        <Text style={[styles.progressLabel, { color: colors.lime }]}>⭐ {score}점</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.bar, { width: `${(done / total) * 100}%` }, glow(colors.pink, 8)]} />
      </View>
    </View>
  );
}

/** 선택지 버튼. 정답이면 라임색으로 빛나고, 오답이면 좌우로 흔들린다. */
function Choice({ text, state, onPress }) {
  const shake = useRef(new Animated.Value(0)).current;
  const pop = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (state === 'wrong') {
      shake.setValue(0);
      Animated.timing(shake, { toValue: 1, duration: 450, easing: Easing.linear, useNativeDriver: true }).start();
    }
    if (state === 'correct') {
      pop.setValue(0.92);
      Animated.spring(pop, { toValue: 1, friction: 3, tension: 160, useNativeDriver: true }).start();
    }
  }, [state, shake, pop]);

  const translateX = shake.interpolate({
    inputRange: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 1],
    outputRange: [0, -12, 12, -9, 9, -4, 0],
  });

  const look = {
    idle: { borderColor: colors.border, backgroundColor: colors.surface, color: colors.text },
    correct: { borderColor: colors.lime, backgroundColor: `${colors.lime}22`, color: colors.lime, ...glow(colors.lime, 14) },
    wrong: { borderColor: colors.pink, backgroundColor: `${colors.pink}1A`, color: colors.pink },
    dim: { borderColor: colors.border, backgroundColor: colors.surface, color: colors.textMuted, opacity: 0.5 },
  }[state];
  const mark = { correct: '✓ ', wrong: '✕ ' }[state] ?? '';

  return (
    <Animated.View style={{ transform: [{ translateX }, { scale: pop }] }}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: state !== 'idle' }}
        onPress={onPress}
        disabled={state !== 'idle'}
        style={({ pressed }) => [styles.choice, look, pressed && styles.pressed]}
      >
        <Text style={[styles.choiceText, { color: look.color }]}>
          {mark}
          {text}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

/** 정답·오답 설명. 아래에서 살짝 올라오며 나타난다. */
function Feedback({ correct, text, children }) {
  const enter = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(enter, { toValue: 1, friction: 6, useNativeDriver: true }).start();
  }, [enter]);
  const color = correct ? colors.lime : colors.pink;
  const translateY = enter.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });

  return (
    <Animated.View style={{ opacity: enter, transform: [{ translateY }] }}>
      <NeonCard accent={color}>
        <Text style={[styles.feedbackTitle, { color }]}>{correct ? '정답이에요! 🎉' : '아쉬워요!'}</Text>
        <Text style={styles.feedbackText}>{text}</Text>
        {children}
      </NeonCard>
    </Animated.View>
  );
}

function Result() {
  const { score, total, bestScore, restart } = useRolePlay();
  const perfect = score === total;
  const message = perfect ? '완벽해요! 상황극 달인이에요.' : score >= total - 2 ? '잘했어요! 조금만 더 연습해요.' : '괜찮아요. 다시 하면 더 잘할 수 있어요.';

  return (
    <NeonCard accent={colors.lime} style={styles.result}>
      <Text style={styles.resultEmoji}>{perfect ? '🏆' : '👏'}</Text>
      <Text style={styles.resultScore}>
        {score} <Text style={styles.resultTotal}>/ {total}</Text>
      </Text>
      <Text style={styles.resultMessage}>{message}</Text>
      <Text style={styles.best}>내 최고 기록: {bestScore}점</Text>
      <NeonButton title="다시 하기" color={colors.pink} onPress={restart} style={styles.restart} />
    </NeonCard>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: space.md, gap: space.md, paddingBottom: space.xl * 2 },
  gap: { gap: space.md },
  label: { fontSize: font.small, fontWeight: '800' },
  title: { fontSize: 26, fontWeight: '900', color: colors.text, marginTop: -space.sm },
  progressWrap: { gap: space.xs },
  progressText: { flexDirection: 'row', justifyContent: 'space-between' },
  progressLabel: { fontSize: font.small, fontWeight: '800', color: colors.textMuted },
  track: { height: 8, borderRadius: 4, backgroundColor: colors.surfaceAlt, overflow: 'visible' },
  bar: { height: 8, borderRadius: 4, backgroundColor: colors.pink },
  place: { fontSize: font.small, fontWeight: '800', color: colors.blue },
  situation: { fontSize: font.body, color: colors.text, lineHeight: 27 },
  bubble: {
    marginTop: space.xs,
    backgroundColor: colors.bg,
    borderRadius: radius.button,
    borderTopLeftRadius: 4,
    padding: space.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  speaker: { fontSize: font.small, fontWeight: '800', color: colors.textMuted },
  line: { fontSize: 21, fontWeight: '800', color: colors.text, lineHeight: 30 },
  ask: { fontSize: font.heading, fontWeight: '900', color: colors.pink, marginTop: space.xs },
  choice: { minHeight: 64, borderRadius: radius.button, borderWidth: 2, paddingHorizontal: space.md, paddingVertical: space.md, justifyContent: 'center' },
  choiceText: { fontSize: font.body, fontWeight: '800', lineHeight: 26 },
  pressed: { transform: [{ scale: 0.98 }] },
  feedbackTitle: { fontSize: font.heading, fontWeight: '900' },
  feedbackText: { fontSize: font.body, color: colors.text, lineHeight: 27, marginBottom: space.sm },
  result: { alignItems: 'center', paddingVertical: space.xl },
  resultEmoji: { fontSize: 56 },
  resultScore: { fontSize: 56, fontWeight: '900', color: colors.lime },
  resultTotal: { fontSize: 28, color: colors.textMuted },
  resultMessage: { fontSize: font.body, color: colors.text, textAlign: 'center', fontWeight: '700' },
  best: { fontSize: font.small, color: colors.textMuted },
  restart: { alignSelf: 'stretch', marginTop: space.md },
});
