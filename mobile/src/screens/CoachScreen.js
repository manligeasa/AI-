import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import NeonButton from '../components/NeonButton';
import NeonCard from '../components/NeonCard';
import Chip from '../components/Chip';
import ScoreBadge from '../components/ScoreBadge';
import { analyzeQuestion, MIN_QUESTION_LENGTH, STATUS } from '../services/coach';
import EXAMPLES from '../data/exampleQuestions.json';
import { colors } from '../theme/colors';
import { font, radius, space } from '../theme/typography';

/** 질문 입력 → 점수·피드백 → 개선 질문을 한 화면에서 위아래로 보여준다. */
export default function CoachScreen({ onSaved }) {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const scrollRef = useRef(null);
  const resultY = useRef(0);

  const canSubmit = question.trim().length >= MIN_QUESTION_LENGTH;

  const handleAnalyze = async () => {
    setError('');
    setCopied(false);
    setSaved(false);
    try {
      setResult(await analyzeQuestion(question));
      // 결과 카드가 그려진 뒤 그 위치로 화면을 내린다
      setTimeout(() => scrollRef.current?.scrollTo({ y: resultY.current, animated: true }), 100);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleClear = () => {
    setQuestion('');
    setResult(null);
    setError('');
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(result.improvement.text);
    setCopied(true);
  };

  const handleSave = () => {
    onSaved({
      question,
      score: result.evaluation.score,
      level: result.evaluation.level,
      improvedText: result.improvement.text,
    });
    setSaved(true);
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>
          AI <Text style={{ color: colors.pink }}>질문</Text> <Text style={{ color: colors.lime }}>코치</Text>
        </Text>
        <Text style={styles.subtitle}>AI에게 할 질문을 적으면 점수와 더 좋은 질문을 알려 드려요.</Text>

        <NeonCard title="① 질문 적기" accent={colors.pink}>
          <TextInput
            value={question}
            onChangeText={setQuestion}
            placeholder="예) 50대 수강생을 위한 AI 입문 강의안을 만들어줘"
            placeholderTextColor={colors.textMuted}
            multiline
            style={styles.input}
            accessibilityLabel="질문 입력"
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <View style={styles.row}>
            <NeonButton title="질문 평가받기" onPress={handleAnalyze} disabled={!canSubmit} style={styles.flex} />
            <NeonButton title="지우기" variant="outline" color={colors.textMuted} onPress={handleClear} />
          </View>
          <Text style={styles.hint}>예시 질문을 눌러 보세요</Text>
          <View style={styles.wrap}>
            {EXAMPLES.map((ex) => (
              <Chip
                key={ex.label}
                label={`${ex.icon} ${ex.label}`}
                color={colors.blue}
                onPress={() => {
                  setQuestion(ex.question);
                  setResult(null);
                }}
              />
            ))}
          </View>
        </NeonCard>

        {result && (
          <>
            <View onLayout={(e) => (resultY.current = e.nativeEvent.layout.y)} />
            <NeonCard title="② 질문 점수" accent={colors.blue}>
              <ScoreBadge score={result.evaluation.score} level={result.evaluation.level} />
              <View style={[styles.wrap, styles.center]}>
                {result.evaluation.criteria.map((c) => (
                  <Chip
                    key={c.id}
                    label={`${c.status === STATUS.GOOD ? '✓' : '·'} ${c.label}`}
                    color={colors.lime}
                    active={c.status === STATUS.GOOD}
                  />
                ))}
              </View>
              <Section label="좋은 점" color={colors.lime} items={result.evaluation.strengths} />
              <Section label="보완할 점" color={colors.pink} items={result.evaluation.weaknesses} />
              <Section label="이렇게 고쳐 보세요" color={colors.blue} items={result.evaluation.directions} />
            </NeonCard>

            <NeonCard title="③ 더 좋은 질문" accent={colors.lime}>
              <Text style={styles.improved}>
                {result.improvement.segments.map((s, i) => (
                  <Text key={i} style={s.added ? styles.added : null}>
                    {s.text}
                  </Text>
                ))}
              </Text>
              <Text style={styles.legend}>
                <Text style={styles.added}>초록색 글자</Text>는 코치가 보탠 부분이에요.
              </Text>
              {result.improvement.tip ? <Text style={styles.tip}>💡 {result.improvement.tip}</Text> : null}
              <View style={styles.row}>
                <NeonButton
                  title={copied ? '복사됨 ✓' : '복사하기'}
                  color={colors.lime}
                  onPress={handleCopy}
                  style={styles.flex}
                />
                <NeonButton
                  title={saved ? '저장됨 ✓' : '저장하기'}
                  variant="outline"
                  color={colors.blue}
                  onPress={handleSave}
                  disabled={saved}
                  style={styles.flex}
                />
              </View>
            </NeonCard>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Section({ label, color, items }) {
  if (!items?.length) return null;
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionLabel, { color }]}>{label}</Text>
      {items.map((item) => (
        <Text key={item} style={styles.bullet}>
          <Text style={{ color }}>● </Text>
          {item}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: space.md, gap: space.lg, paddingBottom: space.xl * 2 },
  title: { fontSize: font.title, fontWeight: '900', color: colors.text, marginTop: space.sm },
  subtitle: { fontSize: font.body, color: colors.textMuted, lineHeight: 26, marginTop: -space.sm },
  input: {
    minHeight: 120,
    backgroundColor: colors.bg,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    fontSize: font.body,
    lineHeight: 26,
    padding: space.md,
    textAlignVertical: 'top',
  },
  row: { flexDirection: 'row', gap: space.sm },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  center: { justifyContent: 'center', marginTop: space.md },
  hint: { fontSize: font.small, color: colors.textMuted, marginTop: space.sm },
  error: { fontSize: font.small, color: colors.pink, fontWeight: '700' },
  section: { gap: space.xs, marginTop: space.md },
  sectionLabel: { fontSize: font.body, fontWeight: '800' },
  bullet: { fontSize: font.body, color: colors.text, lineHeight: 27 },
  improved: { fontSize: font.body, color: colors.text, lineHeight: 28 },
  added: { color: colors.lime, fontWeight: '800' },
  legend: { fontSize: font.small, color: colors.textMuted },
  tip: { fontSize: font.small, color: colors.text, lineHeight: 24 },
});
