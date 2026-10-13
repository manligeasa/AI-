import { StyleSheet, Text, View } from 'react-native';
import HintText from './HintText';
import { colors, glow } from '../theme/colors';
import { font } from '../theme/typography';

/**
 * 도장 모양 네온 스탬프 하나.
 * 받은 스탬프는 두 겹 테두리가 빛나고 살짝 기울어 '쾅' 찍힌 느낌을 준다.
 * 아직 못 받은 스탬프는 흐린 점선 원과 받는 방법을 보여 준다.
 */
export default function NeonStamp({ stamp, earned, size = 92, showHow = true, showTitle = true }) {
  const color = colors[stamp.color] ?? colors.pink;
  if (!earned) {
    return (
      <View style={[styles.col, { width: size + 16 }]}>
        <View style={[styles.empty, { width: size, height: size, borderRadius: size / 2 }]}>
          <Text style={[styles.question, { fontSize: size * 0.34 }]}>?</Text>
        </View>
        {showTitle ? <HintText style={styles.titleOff}>{stamp.title}</HintText> : null}
        {showHow ? <HintText style={styles.how}>{stamp.how}</HintText> : null}
      </View>
    );
  }
  return (
    <View style={[styles.col, { width: size + (showTitle ? 16 : 4) }]}>
      <View
        style={[
          styles.outer,
          { width: size, height: size, borderRadius: size / 2, borderColor: color, transform: [{ rotate: '-10deg' }] },
          glow(color, 16),
        ]}
      >
        <View style={[styles.inner, { borderColor: color, borderRadius: size / 2 }]}>
          <Text style={{ fontSize: size * 0.38 }}>{stamp.emoji}</Text>
        </View>
      </View>
      {showTitle ? <HintText style={[styles.title, { color }]}>{stamp.title}</HintText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  col: { alignItems: 'center', gap: 6 },
  outer: { borderWidth: 3, padding: 5, backgroundColor: colors.bg },
  inner: { flex: 1, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed' },
  empty: { borderWidth: 2, borderStyle: 'dashed', borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  question: { color: colors.border, fontWeight: '900' },
  title: { fontSize: font.small, fontWeight: '900', textAlign: 'center' },
  titleOff: { fontSize: font.small, fontWeight: '800', color: colors.textMuted, textAlign: 'center' },
  how: { fontSize: 13, color: colors.textMuted, textAlign: 'center', lineHeight: 18 },
});
