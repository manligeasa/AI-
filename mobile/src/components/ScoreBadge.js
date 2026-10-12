import { StyleSheet, Text, View } from 'react-native';
import { colors, glow, LEVEL_COLORS } from '../theme/colors';
import { font } from '../theme/typography';

/** 점수 원형 배지. 수준에 따라 네온 색이 바뀐다. */
export default function ScoreBadge({ score, level, size = 140 }) {
  const color = LEVEL_COLORS[level] ?? colors.blue;
  return (
    <View
      style={[
        styles.ring,
        { width: size, height: size, borderRadius: size / 2, borderColor: color },
        glow(color, 24),
      ]}
    >
      <Text style={[styles.score, { color, fontSize: size * 0.34 }]}>{score}</Text>
      <Text style={styles.unit}>/ 100점</Text>
      <Text style={[styles.level, { color }]}>{level}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
    alignSelf: 'center',
  },
  score: { fontWeight: '900' },
  unit: { color: colors.textMuted, fontSize: font.small },
  level: { fontSize: font.body, fontWeight: '800', marginTop: 2 },
});
