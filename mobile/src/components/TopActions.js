import { Pressable, StyleSheet, Text, View } from 'react-native';
import HintLanguageButton from './HintLanguageButton';
import { useHint } from '../i18n/HintContext';
import { useStamps } from '../state/StampContext';
import { colors } from '../theme/colors';
import { font, radius, space } from '../theme/typography';

/** 화면 오른쪽 위 버튼 묶음: 🏅 스탬프판 + 🌏 모국어 힌트 */
export default function TopActions() {
  const { count, total, openBoard } = useStamps();
  const { show } = useHint();
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`스탬프판 열기, ${count}/${total}`}
        onPress={openBoard}
        onLongPress={(e) => show('네온 스탬프판', null, e)}
        style={({ pressed }) => [styles.pill, pressed && { opacity: 0.7 }]}
      >
        <Text style={styles.pillText}>
          🏅 {count}/{total}
        </Text>
      </Pressable>
      <HintLanguageButton />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { position: 'absolute', top: space.sm, right: space.md, zIndex: 5, flexDirection: 'row', gap: space.xs },
  pill: {
    minHeight: 36,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.lime,
    backgroundColor: colors.surface,
    justifyContent: 'center',
  },
  pillText: { fontSize: font.small, fontWeight: '800', color: colors.lime },
});
