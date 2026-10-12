import { useState } from 'react';
import { Alert, FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import Chip from '../components/Chip';
import NeonCard from '../components/NeonCard';
import { colors, LEVEL_COLORS } from '../theme/colors';
import { font, space } from '../theme/typography';

/** 보관함: 저장한 질문 목록. 모든 내용은 휴대폰 안의 JSON 파일에만 있다. */
export default function HistoryScreen({ history, onToggleFavorite, onRemove }) {
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const items = onlyFavorites ? history.filter((h) => h.favorite) : history;

  const confirmRemove = (item) => {
    if (Platform.OS === 'web') {
      onRemove(item.id);
      return;
    }
    Alert.alert('삭제할까요?', '삭제한 질문은 되살릴 수 없어요.', [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: () => onRemove(item.id) },
    ]);
  };

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.content}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>
            내 <Text style={{ color: colors.blue }}>보관함</Text>
          </Text>
          <Text style={styles.subtitle}>저장한 질문은 이 휴대폰 안에만 보관돼요. (서버 저장 없음)</Text>
          <View style={styles.row}>
            <Chip label={`전체 ${history.length}`} color={colors.blue} active={!onlyFavorites} onPress={() => setOnlyFavorites(false)} />
            <Chip label="★ 즐겨찾기" color={colors.lime} active={onlyFavorites} onPress={() => setOnlyFavorites(true)} />
          </View>
        </View>
      }
      ListEmptyComponent={
        <Text style={styles.empty}>
          {onlyFavorites ? '즐겨찾기한 질문이 아직 없어요.' : '아직 저장한 질문이 없어요.\n코치 탭에서 질문을 평가받고 저장해 보세요.'}
        </Text>
      }
      renderItem={({ item }) => {
        const color = LEVEL_COLORS[item.level] ?? colors.blue;
        return (
          <NeonCard accent={color} style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={[styles.score, { color }]}>
                {item.score}점 · {item.level}
              </Text>
              <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString('ko-KR')}</Text>
            </View>
            <Text style={styles.label}>처음 질문</Text>
            <Text style={styles.original}>{item.question}</Text>
            <Text style={styles.label}>더 좋은 질문</Text>
            <Text style={styles.improved}>{item.improvedText}</Text>
            <View style={styles.actions}>
              <Action label={item.favorite ? '★ 즐겨찾기' : '☆ 즐겨찾기'} color={colors.lime} onPress={() => onToggleFavorite(item.id)} />
              <Action label="복사" color={colors.blue} onPress={() => Clipboard.setStringAsync(item.improvedText)} />
              <Action label="삭제" color={colors.pink} onPress={() => confirmRemove(item)} />
            </View>
          </NeonCard>
        );
      }}
    />
  );
}

function Action({ label, color, onPress }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.action, pressed && { opacity: 0.6 }]}>
      <Text style={[styles.actionLabel, { color }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { padding: space.md, gap: space.md, paddingBottom: space.xl * 2 },
  header: { gap: space.sm, marginBottom: space.sm },
  title: { fontSize: font.title, fontWeight: '900', color: colors.text, marginTop: space.sm },
  subtitle: { fontSize: font.small, color: colors.textMuted, lineHeight: 24 },
  row: { flexDirection: 'row', gap: space.sm },
  empty: { fontSize: font.body, color: colors.textMuted, textAlign: 'center', lineHeight: 28, marginTop: space.xl },
  card: { gap: space.xs },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  score: { fontSize: font.heading, fontWeight: '900' },
  date: { fontSize: font.small, color: colors.textMuted },
  label: { fontSize: font.small, color: colors.textMuted, marginTop: space.sm },
  original: { fontSize: font.body, color: colors.textMuted, lineHeight: 26 },
  improved: { fontSize: font.body, color: colors.text, lineHeight: 27 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: space.md },
  action: { minHeight: 48, justifyContent: 'center', paddingHorizontal: space.sm },
  actionLabel: { fontSize: font.body, fontWeight: '800' },
});
