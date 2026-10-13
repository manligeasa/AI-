import { Pressable, StyleSheet, Text } from 'react-native';
import { useHint } from '../i18n/HintContext';
import { colors } from '../theme/colors';
import { font, radius } from '../theme/typography';

/** 작은 알약 모양 버튼 (예시 질문, 기준 표시 등) */
export default function Chip({ label, hint, color = colors.lime, active = true, onPress }) {
  const { show } = useHint();
  return (
    <Pressable
      onPress={onPress}
      onLongPress={(e) => show(hint ?? label, null, e)}
      accessibilityRole={onPress ? 'button' : 'text'}
      style={({ pressed }) => [
        styles.chip,
        { borderColor: active ? color : colors.border, backgroundColor: active ? `${color}22` : 'transparent' },
        pressed && { opacity: 0.7 },
      ]}
    >
      <Text style={[styles.label, { color: active ? color : colors.textMuted }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
  label: { fontSize: font.small, fontWeight: '700' },
});
