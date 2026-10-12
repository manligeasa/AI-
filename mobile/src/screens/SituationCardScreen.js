import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import NeonButton from '../components/NeonButton';
import NeonCheckbox from '../components/NeonCheckbox';
import data from '../data/cards/situations.json';
import { colors } from '../theme/colors';
import { font, radius, space } from '../theme/typography';

/** 상대에게 보여 줄 글자색. 검은 바탕에서 대비가 가장 높은 라임을 기본으로 쓴다. */
const SHOW_COLOR = colors.lime;
const neonText = { color: SHOW_COLOR, textShadowColor: SHOW_COLOR, textShadowRadius: 18, textShadowOffset: { width: 0, height: 0 } };

/**
 * 보여 주는 카드: 내 상황을 체크하면 상대에게 보여 줄 문장이 크게 나타난다.
 * 서버 통신 없이 휴대폰 화면 안에서만 바로 만들어진다.
 */
export default function SituationCardScreen() {
  const [checked, setChecked] = useState([]);
  const [fullScreen, setFullScreen] = useState(false);

  const toggle = (id) => setChecked((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));
  // 고른 순서가 아니라 목록 순서대로 문장을 보여 준다
  const messages = data.situations.filter((s) => checked.includes(s.id)).map((s) => s.message);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.subtitle}>{data.subtitle}</Text>

      <View style={[styles.preview, messages.length > 0 && styles.previewOn]} accessibilityLiveRegion="polite">
        {messages.length === 0 ? (
          <Text style={styles.empty}>아래에서 내 상황을 골라 주세요</Text>
        ) : (
          messages.map((m) => (
            <Text key={m} style={[styles.previewText, neonText]}>
              {m}
            </Text>
          ))
        )}
      </View>

      <NeonButton title="📱 화면 가득 크게 보여 주기" color={SHOW_COLOR} disabled={messages.length === 0} onPress={() => setFullScreen(true)} />

      <Text style={styles.heading}>내 상황 고르기 (여러 개 골라도 돼요)</Text>
      <View style={styles.list}>
        {data.situations.map((s) => (
          <NeonCheckbox key={s.id} label={s.label} emoji={s.emoji} checked={checked.includes(s.id)} onToggle={() => toggle(s.id)} />
        ))}
      </View>

      <ShowModal visible={fullScreen} messages={messages} onClose={() => setFullScreen(false)} />
    </ScrollView>
  );
}

/** 상대에게 휴대폰을 내밀어 보여 주는 전체 화면. 아무 곳이나 누르면 닫힌다. */
function ShowModal({ visible, messages, onClose }) {
  const { width, height } = useWindowDimensions();
  // 글자가 화면을 넘지 않는 가장 큰 크기를 계산한다 (한글 한 글자 ≈ 글자 크기만큼 넓다)
  const totalChars = messages.join('').length || 1;
  const longest = Math.max(...messages.map((m) => m.length), 1);
  const usableW = width - 48;
  const usableH = height - 160;
  const size = Math.floor(Math.max(30, Math.min(80, (usableW * 3) / longest, Math.sqrt((usableW * usableH) / (1.5 * totalChars)))));

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.modal} onPress={onClose} accessibilityRole="button" accessibilityLabel="닫기">
        <View style={styles.modalBody}>
          {messages.map((m) => (
            <Text key={m} style={[styles.bigText, neonText, { fontSize: size, lineHeight: size * 1.3 }]} adjustsFontSizeToFit>
              {m}
            </Text>
          ))}
        </View>
        <Text style={styles.close}>화면을 누르면 닫혀요</Text>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.md, paddingBottom: space.xl * 2, gap: space.md },
  subtitle: { fontSize: font.small, color: colors.textMuted, lineHeight: 24 },
  heading: { fontSize: font.body, fontWeight: '900', color: colors.text, marginTop: space.sm },
  list: { gap: space.sm },
  preview: {
    minHeight: 130,
    borderRadius: radius.card,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    backgroundColor: '#000000',
    padding: space.lg,
    justifyContent: 'center',
    gap: space.md,
  },
  previewOn: { borderStyle: 'solid', borderColor: SHOW_COLOR },
  empty: { fontSize: font.body, color: colors.textMuted, textAlign: 'center' },
  previewText: { fontSize: 30, fontWeight: '900', lineHeight: 42, textAlign: 'center' },
  modal: { flex: 1, backgroundColor: '#000000', padding: 24, justifyContent: 'center' },
  modalBody: { gap: 28 },
  bigText: { fontWeight: '900', textAlign: 'center' },
  close: { position: 'absolute', bottom: 40, left: 0, right: 0, textAlign: 'center', fontSize: font.small, color: colors.textMuted },
});
