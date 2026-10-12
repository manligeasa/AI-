import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';
import { font, radius } from '../theme/typography';

/** 작은 알약 모양 버튼 (예시 질문, 기준 표시 등) */
export default function Chip({ label, color = colors.lime, active = true, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
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
