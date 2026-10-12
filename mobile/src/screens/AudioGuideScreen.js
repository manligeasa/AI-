import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Speech from 'expo-speech';
import NeonPulse from '../components/NeonPulse';
import Chip from '../components/Chip';
import NeonCard from '../components/NeonCard';
import data from '../data/audio/phrases.json';
import { colors, glow } from '../theme/colors';
import { font, space } from '../theme/typography';

const BUTTON = 150;
const SPEEDS = [
  { label: '🐢 천천히', rate: 0.75 },
  { label: '보통 빠르기', rate: 1.0 },
];

/**
 * 오디오 가이드: 휴대폰에 기본으로 들어 있는 무료 음성 읽기(TTS) 기능으로 문장을 읽어 준다.
 * 유료 클라우드 음성 서비스나 인터넷이 필요 없다.
 */
export default function AudioGuideScreen({ label, color }) {
  const [speaking, setSpeaking] = useState(false);
  const [rate, setRate] = useState(SPEEDS[0].rate);
  const [noKoreanVoice, setNoKoreanVoice] = useState(false);
  const mounted = useRef(true);

  // 휴대폰에 한국어 음성이 있는지 확인한다 (없으면 설정 방법을 안내)
  useEffect(() => {
    mounted.current = true;
    Speech.getAvailableVoicesAsync()
      .then((voices) => {
        if (mounted.current && voices.length > 0 && !voices.some((v) => v.language?.toLowerCase().startsWith('ko'))) {
          setNoKoreanVoice(true);
        }
      })
      .catch(() => {});
    return () => {
      mounted.current = false;
      Speech.stop();
    };
  }, []);

  const done = () => mounted.current && setSpeaking(false);

  const handlePress = async () => {
    if (speaking) {
      await Speech.stop();
      done();
      return;
    }
    setSpeaking(true);
    Speech.speak(data.phrase.text, {
      language: 'ko-KR',
      rate,
      pitch: 1.0,
      onDone: done,
      onStopped: done,
      onError: done,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={[styles.label, { color }]}>{label}</Text>
      <Text style={styles.title}>{data.title}</Text>
      <Text style={styles.subtitle}>{data.subtitle}</Text>

      <NeonCard accent={color} style={styles.card}>
        <Text style={styles.situation}>{data.phrase.situation}</Text>
        <Text style={[styles.phrase, speaking && { color }]}>“{data.phrase.text}”</Text>

        <View style={styles.stage}>
          <NeonPulse active={speaking} color={color} size={BUTTON} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={speaking ? '읽기 멈추기' : `"${data.phrase.text}" 듣기`}
            onPress={handlePress}
            style={({ pressed }) => [
              styles.play,
              { borderColor: color, backgroundColor: speaking ? color : colors.surface },
              glow(color, speaking ? 30 : 16),
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.playIcon, { color: speaking ? colors.textOnNeon : color }]}>{speaking ? '■' : '▶'}</Text>
            <Text style={[styles.playText, { color: speaking ? colors.textOnNeon : color }]}>{speaking ? '멈추기' : '듣기'}</Text>
          </Pressable>
        </View>

        <View style={styles.speeds}>
          {SPEEDS.map((s) => (
            <Chip key={s.rate} label={s.label} color={color} active={rate === s.rate} onPress={() => setRate(s.rate)} />
          ))}
        </View>
      </NeonCard>

      {noKoreanVoice ? (
        <Text style={styles.notice}>
          ⚠️ 이 휴대폰에 한국어 음성이 없어요. 휴대폰 설정 → ‘텍스트 음성 변환(TTS)’에서 한국어를 내려받아 주세요.
        </Text>
      ) : null}
      <Text style={styles.hint}>소리가 안 들리면 휴대폰 소리 크기와 무음 모드를 확인해 주세요.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: space.md, gap: space.md, paddingBottom: space.xl * 2 },
  label: { fontSize: font.small, fontWeight: '800' },
  title: { fontSize: 26, fontWeight: '900', color: colors.text, marginTop: -space.sm },
  subtitle: { fontSize: font.small, color: colors.textMuted, marginTop: -space.sm },
  card: { alignItems: 'center', overflow: 'hidden' },
  situation: { fontSize: font.small, color: colors.textMuted, fontWeight: '700' },
  phrase: { fontSize: 23, fontWeight: '900', color: colors.text, textAlign: 'center', lineHeight: 33 },
  stage: { width: '100%', height: BUTTON * 2.2, alignItems: 'center', justifyContent: 'center' },
  play: {
    width: BUTTON,
    height: BUTTON,
    borderRadius: BUTTON / 2,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  pressed: { transform: [{ scale: 0.95 }] },
  playIcon: { fontSize: 44, fontWeight: '900' },
  playText: { fontSize: font.heading, fontWeight: '900' },
  speeds: { flexDirection: 'row', gap: space.sm },
  notice: { fontSize: font.small, color: colors.pink, lineHeight: 24 },
  hint: { fontSize: font.small, color: colors.textMuted, lineHeight: 24, textAlign: 'center' },
});
