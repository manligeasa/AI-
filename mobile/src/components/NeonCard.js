import { StyleSheet, View } from 'react-native';
import HintText from './HintText';
import { colors, glow } from '../theme/colors';
import { font, radius, space } from '../theme/typography';

/** 어두운 카드 + 네온 테두리. accent 색으로 카드마다 포인트를 준다. */
export default function NeonCard({ title, accent = colors.blue, children, style }) {
  return (
    <View style={[styles.card, { borderColor: accent }, glow(accent, 10), style]}>
      {title ? <HintText style={[styles.title, { color: accent }]}>{title}</HintText> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1.5,
    padding: space.lg,
    gap: space.sm,
  },
  title: { fontSize: font.heading, fontWeight: '800', marginBottom: space.xs },
});
