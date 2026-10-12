import { ScrollView, StyleSheet, Text, View } from 'react-native';
import NeonCard from '../components/NeonCard';
import { colors } from '../theme/colors';
import { font, space } from '../theme/typography';

/**
 * 탭 화면 기본 틀. 제목·설명·앞으로 들어갈 기능 목록을 보여 준다.
 * 각 탭의 실제 기능은 이 틀 안에 하나씩 채워 넣는다.
 */
export default function TabScreen({ title, color, description, features }) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color }]}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <NeonCard title="이런 기능이 들어갈 예정이에요" accent={color}>
        {features.map((f) => (
          <View key={f} style={styles.item}>
            <Text style={[styles.dot, { color }]}>●</Text>
            <Text style={styles.text}>{f}</Text>
          </View>
        ))}
      </NeonCard>
      <Text style={styles.soon}>준비 중이에요. 곧 만나요!</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: space.md, gap: space.lg, paddingBottom: space.xl * 2 },
  title: { fontSize: font.title, fontWeight: '900', marginTop: space.sm },
  description: { fontSize: font.body, color: colors.textMuted, lineHeight: 27, marginTop: -space.sm },
  item: { flexDirection: 'row', gap: space.sm },
  dot: { fontSize: font.small, lineHeight: 27 },
  text: { flex: 1, fontSize: font.body, color: colors.text, lineHeight: 27 },
  soon: { fontSize: font.small, color: colors.textMuted, textAlign: 'center' },
});
