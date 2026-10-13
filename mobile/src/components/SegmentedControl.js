import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useHint } from '../i18n/HintContext';
import { colors } from '../theme/colors';
import { font, radius } from '../theme/typography';

/** 화면 위쪽에서 보기 방식을 바꾸는 큰 전환 버튼 (예: [보여 주는 카드 | 조문 순서]) */
export default function SegmentedControl({ items, value, onChange, color }) {
  const { show } = useHint();
  return (
    <View style={styles.segment} accessibilityRole="tablist">
      {items.map((m) => {
        const active = m.key === value;
        return (
          <Pressable
            key={m.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(m.key)}
            onLongPress={(e) => show(m.hint ?? m.label, null, e)}
            style={[styles.item, active && { backgroundColor: color }]}
          >
            <Text style={[styles.text, { color: active ? colors.textOnNeon : colors.textMuted }]}>{m.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  segment: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.button, padding: 4, borderWidth: 1, borderColor: colors.border },
  item: { flex: 1, minHeight: 48, borderRadius: radius.button - 4, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: font.body, fontWeight: '900' },
});
