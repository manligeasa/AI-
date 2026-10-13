import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import DraggableSticker from '../components/DraggableSticker';
import EnvelopeArt from '../components/illustrations/EnvelopeArt';
import NeonBurst from '../components/NeonBurst';
import NeonButton from '../components/NeonButton';
import NeonCard from '../components/NeonCard';
import data from '../data/quiz/envelopes.json';
import { colors, glow } from '../theme/colors';
import { font, radius, space } from '../theme/typography';

const ENVELOPE_COLOR = { wedding: colors.pink, funeral: colors.blue };
const HIT_SLOP = 24; // 붙일 자리보다 조금 밖에 놓아도 붙도록 여유를 둔다

const shuffle = (list) => [...list].sort(() => Math.random() - 0.5);
/** 받침이 있으면 '은', 없으면 '는' */
const topic = (word) => word + ((word.charCodeAt(word.length - 1) - 0xac00) % 28 ? '은' : '는');

/** 퀴즈: '축결혼', '부의' 스티커를 끌어서 알맞은 봉투에 붙이는 미니 게임 */
export default function EnvelopeGameScreen({ label, color }) {
  const { width, height } = useWindowDimensions();
  const envelopeWidth = Math.floor(Math.min((width - space.md * 3) / 2, 160, (height - 430) * 0.6));

  const [round, setRound] = useState(0);
  const [placed, setPlaced] = useState({}); // { 봉투 id: 스티커 }
  const [hovered, setHovered] = useState(null);
  const [message, setMessage] = useState(null); // { ok: boolean, text }
  // 판마다 스티커 순서를 섞는다
  const stickers = useMemo(() => shuffle(data.stickers), [round]);

  const zoneRefs = useRef({});
  const zoneRects = useRef({});
  const burstRef = useRef(null);
  const scrollRef = useRef(null);

  const done = Object.keys(placed).length === data.stickers.length;

  // 다 맞히면 설명 카드가 보이도록 아래로 내린다
  useEffect(() => {
    if (done) setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300);
    else scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [done]);

  /** 끌기를 시작할 때 봉투 자리의 화면 위치를 새로 잰다 */
  const measureZones = () => {
    Object.entries(zoneRefs.current).forEach(([id, ref]) =>
      ref?.measureInWindow((x, y, w, h) => {
        zoneRects.current[id] = { x, y, w, h };
      }),
    );
  };

  const zoneAt = (px, py) =>
    Object.entries(zoneRects.current).find(
      ([id, r]) => !placed[id] && px >= r.x - HIT_SLOP && px <= r.x + r.w + HIT_SLOP && py >= r.y - HIT_SLOP && py <= r.y + r.h + HIT_SLOP,
    )?.[0] ?? null;

  const handleMove = (px, py) => {
    const id = zoneAt(px, py);
    if (id !== hovered) setHovered(id);
  };

  /** 놓은 곳이 정답 봉투면 그 자리 가운데 좌표를, 아니면 null을 돌려준다 */
  const handleDrop = (sticker, px, py) => {
    setHovered(null);
    const id = zoneAt(px, py);
    if (!id) return null;
    if (id !== sticker.target) {
      setMessage({ ok: false, text: sticker.wrongHint });
      return null;
    }
    const r = zoneRects.current[id];
    return { x: r.x + r.w / 2, y: r.y + r.h / 2 };
  };

  const handlePlaced = (sticker, target) => {
    setPlaced((p) => ({ ...p, [sticker.target]: sticker }));
    setMessage({ ok: true, text: `맞아요! '${sticker.text}'${topic(sticker.text).slice(-1)} ${data.envelopes.find((e) => e.id === sticker.target).event} 봉투에 써요.` });
    burstRef.current?.burst(target.x, target.y);
  };

  const restart = () => {
    setPlaced({});
    setMessage(null);
    setRound((r) => r + 1);
  };

  return (
    <View style={styles.root}>
      {/* 끄는 동안 화면이 같이 움직이지 않도록, 다 맞힌 뒤에만 스크롤을 켠다 */}
      <ScrollView ref={scrollRef} scrollEnabled={done} contentContainerStyle={styles.content}>
        {label ? <Text style={[styles.label, { color }]}>{label}</Text> : null}
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.guide}>{data.guide}</Text>

        <View style={styles.envelopes}>
          {data.envelopes.map((env) => {
            const envColor = ENVELOPE_COLOR[env.id];
            const sticker = placed[env.id];
            const isHover = hovered === env.id;
            return (
              <View key={env.id} style={styles.envelopeCol}>
                <View>
                  <EnvelopeArt kind={env.id} color={envColor} width={envelopeWidth} />
                  {/* 이름표를 붙이는 자리 (봉투 앞면 가운데 세로 칸) */}
                  <View
                    ref={(r) => (zoneRefs.current[env.id] = r)}
                    collapsable={false}
                    style={[
                      styles.zone,
                      { width: envelopeWidth * 0.42, height: envelopeWidth * 0.8, left: envelopeWidth * 0.29, top: envelopeWidth * 0.46 },
                      isHover && { borderColor: colors.lime, backgroundColor: `${colors.lime}1F`, ...glow(colors.lime, 16) },
                      sticker && styles.zoneFilled,
                    ]}
                  >
                    {sticker ? (
                      <Text style={styles.vertical}>{sticker.text.split('').join('\n')}</Text>
                    ) : (
                      <Text style={styles.zoneHint}>여기에{'\n'}붙여요</Text>
                    )}
                  </View>
                </View>
                <Text style={[styles.event, { color: envColor }]}>
                  {env.emoji} {env.event}
                </Text>
              </View>
            );
          })}
        </View>

        {message ? (
          <Text style={[styles.message, { color: message.ok ? colors.lime : colors.pink }]} accessibilityLiveRegion="polite">
            {message.ok ? '✓ ' : '✕ '}
            {message.text}
          </Text>
        ) : (
          <Text style={styles.message}> </Text>
        )}

        {done ? (
          <NeonCard accent={colors.lime}>
            <Text style={styles.doneTitle}>모두 맞혔어요! 🎉</Text>
            {data.summary.map((s) => (
              <Text key={s} style={styles.summary}>
                • {s}
              </Text>
            ))}
            <NeonButton title="다시 하기" color={colors.lime} onPress={restart} style={styles.again} />
          </NeonCard>
        ) : (
          <View style={styles.tray}>
            {stickers.map((s) =>
              Object.values(placed).some((p) => p.id === s.id) ? (
                <View key={`${round}-${s.id}`} style={styles.slot} />
              ) : (
                <DraggableSticker
                  key={`${round}-${s.id}`}
                  sticker={s}
                  onStart={() => {
                    setMessage(null);
                    measureZones();
                  }}
                  onMove={handleMove}
                  onDrop={handleDrop}
                  onPlaced={handlePlaced}
                />
              ),
            )}
          </View>
        )}
      </ScrollView>
      <NeonBurst ref={burstRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: space.md, gap: space.sm, paddingBottom: space.xl },
  label: { fontSize: font.small, fontWeight: '800' },
  title: { fontSize: 26, fontWeight: '900', color: colors.text, marginTop: -space.xs },
  guide: { fontSize: font.small, color: colors.textMuted, lineHeight: 24 },
  envelopes: { flexDirection: 'row', justifyContent: 'space-evenly', marginTop: space.sm },
  envelopeCol: { alignItems: 'center', gap: space.xs },
  zone: {
    position: 'absolute',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.textMuted,
    borderRadius: radius.button / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoneFilled: { borderStyle: 'solid', borderColor: colors.lime, backgroundColor: `${colors.lime}14`, ...glow(colors.lime, 12) },
  zoneHint: { fontSize: 13, color: colors.textMuted, textAlign: 'center', lineHeight: 18 },
  vertical: {
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 28,
    textAlign: 'center',
    color: colors.lime,
    textShadowColor: colors.lime,
    textShadowRadius: 12,
    textShadowOffset: { width: 0, height: 0 },
  },
  event: { fontSize: font.body, fontWeight: '900' },
  message: { minHeight: 48, fontSize: font.small, fontWeight: '800', lineHeight: 24, textAlign: 'center', color: colors.textMuted },
  tray: { flexDirection: 'row', justifyContent: 'space-evenly', paddingVertical: space.sm },
  slot: { minWidth: 110, minHeight: 60, borderRadius: radius.button, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.border },
  doneTitle: { fontSize: font.heading, fontWeight: '900', color: colors.lime },
  summary: { fontSize: font.small, color: colors.text, lineHeight: 24 },
  again: { marginTop: space.sm },
});
