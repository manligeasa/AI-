import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import CardDeckScreen from './CardDeckScreen';
import SituationCardScreen from './SituationCardScreen';
import { colors } from '../theme/colors';
import { font, radius, space } from '../theme/typography';

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
        <Text style={[styles.label, { color }]}>{label}</Text>
        <View style={styles.segment} accessibilityRole="tablist">
          {MODES.map((m) => {
            const active = m.key === mode;
            return (
              <Pressable
                key={m.key}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                onPress={() => setMode(m.key)}
                style={[styles.segmentItem, active && { backgroundColor: color }]}
              >
                <Text style={[styles.segmentText, { color: active ? colors.textOnNeon : colors.textMuted }]}>{m.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <View style={styles.root}>{mode === 'show' ? <SituationCardScreen /> : <CardDeckScreen deck={deck} compactHeader />}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: space.md, paddingTop: space.md, paddingBottom: space.sm, gap: space.sm },
  label: { fontSize: font.small, fontWeight: '800' },
  segment: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.button, padding: 4, borderWidth: 1, borderColor: colors.border },
  segmentItem: { flex: 1, minHeight: 48, borderRadius: radius.button - 4, alignItems: 'center', justifyContent: 'center' },
  segmentText: { fontSize: font.body, fontWeight: '900' },
});
