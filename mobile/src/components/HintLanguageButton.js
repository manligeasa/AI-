import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useHint } from '../i18n/HintContext';
import { LANGUAGES, languageOf } from '../i18n/translate';
import { colors, glow } from '../theme/colors';
import { font, radius, space } from '../theme/typography';

/** 화면 오른쪽 위 🌏 버튼: 길게 눌렀을 때 보여 줄 모국어를 고른다. */
export default function HintLanguageButton() {
  const { lang, setLang } = useHint();
  const [open, setOpen] = useState(false);
  const current = languageOf(lang);

  const choose = (code) => {
    setLang(code);
    setOpen(false);
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="힌트 언어 고르기"
        onPress={() => setOpen(true)}
        style={({ pressed }) => [styles.pill, pressed && { opacity: 0.7 }]}
      >
        <Text style={styles.pillText}>🌏 {current ? `${current.flag} ${current.short}` : '끔'}</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={[styles.sheet, glow(colors.blue, 18)]}>
            <Text style={styles.title}>모국어 힌트</Text>
            <Text style={styles.desc}>한국어 문장을 길게 누르면 고른 언어로 뜻을 알려 드려요.</Text>
            {[...LANGUAGES, { code: null, flag: '🚫', name: '힌트 끄기' }].map((l) => {
              const active = l.code === lang;
              return (
                <Pressable
                  key={l.code ?? 'off'}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: active }}
                  onPress={() => choose(l.code)}
                  style={[styles.option, active && styles.optionActive]}
                >
                  <Text style={[styles.optionText, active && { color: colors.blue }]}>
                    {l.flag} {l.name}
                  </Text>
                  {active ? <Text style={styles.check}>✓</Text> : null}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  pill: {
    position: 'absolute',
    top: space.sm,
    right: space.md,
    zIndex: 5,
    minHeight: 36,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.blue,
    backgroundColor: colors.surface,
    justifyContent: 'center',
  },
  pillText: { fontSize: font.small, fontWeight: '800', color: colors.blue },
  backdrop: { flex: 1, backgroundColor: 'rgba(5,5,12,0.75)', justifyContent: 'center', padding: space.lg },
  sheet: { backgroundColor: colors.surface, borderRadius: radius.card, borderWidth: 2, borderColor: colors.blue, padding: space.lg, gap: space.sm },
  title: { fontSize: font.heading, fontWeight: '900', color: colors.text },
  desc: { fontSize: font.small, color: colors.textMuted, lineHeight: 24, marginBottom: space.xs },
  option: {
    minHeight: 56,
    borderRadius: radius.button,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: space.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionActive: { borderColor: colors.blue, backgroundColor: `${colors.blue}1A` },
  optionText: { fontSize: font.body, fontWeight: '800', color: colors.text },
  check: { fontSize: font.body, fontWeight: '900', color: colors.blue },
});
