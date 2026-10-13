import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import CardDeckScreen from './CardDeckScreen';
import SituationCardScreen from './SituationCardScreen';
import HintText from '../components/HintText';
import SegmentedControl from '../components/SegmentedControl';
import { font, space } from '../theme/typography';

const MODES = [
  { key: 'show', label: '보여 주는 카드' },
  { key: 'deck', label: '조문 순서' },
];

/** 소통 카드 탭: '보여 주는 카드'와 '조문 순서' 카드를 위쪽 버튼으로 바꿔 본다. */
export default function CommunicationScreen({ label, color, deck }) {
  const [mode, setMode] = useState(MODES[0].key);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <HintText style={[styles.label, { color }]}>{label}</HintText>
        <SegmentedControl items={MODES} value={mode} onChange={setMode} color={color} />
      </View>
      <View style={styles.root}>{mode === 'show' ? <SituationCardScreen /> : <CardDeckScreen deck={deck} compactHeader />}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: space.md, paddingTop: space.md, paddingBottom: space.sm, gap: space.sm },
  label: { fontSize: font.small, fontWeight: '800' },
});
