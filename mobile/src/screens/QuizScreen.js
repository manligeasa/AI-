import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import EnvelopeGameScreen from './EnvelopeGameScreen';
import OXQuizScreen from './OXQuizScreen';
import HintText from '../components/HintText';
import SegmentedControl from '../components/SegmentedControl';
import { font, space } from '../theme/typography';

const MODES = [
  { key: 'ox', label: '⚡ 스피드 OX' },
  { key: 'envelope', label: '✉️ 봉투 붙이기' },
];

/** 퀴즈 탭: '스피드 OX'와 '봉투 붙이기'를 위쪽 버튼으로 바꿔 본다. */
export default function QuizScreen({ label, color }) {
  const [mode, setMode] = useState(MODES[0].key);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <HintText style={[styles.label, { color }]}>{label}</HintText>
        <SegmentedControl items={MODES} value={mode} onChange={setMode} color={color} />
      </View>
      <View style={styles.root}>{mode === 'ox' ? <OXQuizScreen /> : <EnvelopeGameScreen />}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: space.md, paddingTop: space.md, paddingBottom: space.xs, gap: space.sm },
  label: { fontSize: font.small, fontWeight: '800' },
});
