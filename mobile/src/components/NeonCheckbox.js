import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useHint } from '../i18n/HintContext';
import { colors, glow } from '../theme/colors';
import { font, radius, space } from '../theme/typography';

/** 크게 누르기 쉬운 체크박스 한 줄 (줄 전체 어디를 눌러도 선택된다) */
export default function NeonCheckbox({ label, emoji, checked, color = colors.lime, onToggle }) {
  const { show } = useHint();
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      onPress={onToggle}
      onLongPress={(e) => show(label, null, e)}
      style={({ pressed }) => [
        styles.row,
        { borderColor: checked ? color : colors.border, backgroundColor: checked ? `${color}14` : colors.surface },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.box, { borderColor: checked ? color : colors.textMuted }, checked && { backgroundColor: color, ...glow(color, 10) }]}>
        {checked ? <Text style={styles.check}>✓</Text> : null}
      </View>
      <Text style={[styles.label, { color: checked ? color : colors.text }]}>
        {emoji} {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    minHeight: 64,
    paddingHorizontal: space.md,
    borderRadius: radius.button,
    borderWidth: 2,
  },
  pressed: { opacity: 0.8 },
  box: { width: 32, height: 32, borderRadius: 8, borderWidth: 2.5, alignItems: 'center', justifyContent: 'center' },
  check: { fontSize: 22, fontWeight: '900', color: colors.textOnNeon, lineHeight: 26 },
  label: { flex: 1, fontSize: font.body, fontWeight: '800' },
});
