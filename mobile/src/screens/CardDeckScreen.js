import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import CardSwiper from '../components/CardSwiper';
import { colors } from '../theme/colors';
import { font, space } from '../theme/typography';

/** 소통 카드 탭: 카드 묶음(JSON) 하나를 스와이프 카드로 보여 준다. */
export default function CardDeckScreen({ label, color, deck, compactHeader }) {
  const { height } = useWindowDimensions();
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        {label ? <Text style={[styles.label, { color }]}>{label}</Text> : null}
        <Text style={styles.title}>{deck.title}</Text>
        {/* 작은 화면에서는 카드 공간을 위해 안내 문구를 뺀다 */}
        {!compactHeader && height >= 760 ? <Text style={styles.subtitle}>{deck.subtitle}</Text> : null}
      </View>
      <CardSwiper cards={deck.cards} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: space.md, paddingTop: space.sm, paddingBottom: space.sm, gap: 2 },
  label: { fontSize: font.small, fontWeight: '800' },
  title: { fontSize: 26, fontWeight: '900', color: colors.text },
  subtitle: { fontSize: font.small, color: colors.textMuted },
});
