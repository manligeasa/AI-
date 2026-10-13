import { Pressable, StyleSheet, Text } from 'react-native';
import { useHint } from '../i18n/HintContext';
import { colors, glow } from '../theme/colors';
import { font, radius } from '../theme/typography';

/**
 * 네온 버튼.
 * - solid: 네온색으로 꽉 채운 주요 버튼
 * - outline: 테두리만 빛나는 보조 버튼
 * 길게 누르면 버튼 글자의 모국어 힌트가 뜬다.
 */
export default function NeonButton({ title, hint, onPress, color = colors.pink, variant = 'solid', disabled, style }) {
  const solid = variant === 'solid';
  const { show } = useHint();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      onLongPress={(e) => show(hint ?? title, null, e)}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        solid ? { backgroundColor: color, ...glow(color) } : { borderColor: color },
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.label, { color: solid ? colors.textOnNeon : color }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    paddingHorizontal: 20,
    borderRadius: radius.button,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: font.body, fontWeight: '800' },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.35 },
});
