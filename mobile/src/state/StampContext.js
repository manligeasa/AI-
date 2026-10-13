import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, BackHandler, Easing, ScrollView, StyleSheet, Text, View } from 'react-native';
import Fireworks from '../components/Fireworks';
import HintText from '../components/HintText';
import NeonButton from '../components/NeonButton';
import NeonStamp from '../components/NeonStamp';
import data from '../data/stamps.json';
import { clearStamps, loadStamps, saveStamps } from '../storage/stampStore';
import { colors, glow } from '../theme/colors';
import { font, radius, space } from '../theme/typography';

/**
 * 네온 스탬프 보상 시스템 (Context API).
 * - award(['ox', 'ox_perfect']): 아직 없는 스탬프만 새로 주고, 기기 내부 저장소(AsyncStorage)에 기록한다.
 * - 새 스탬프를 받으면 '쾅' 찍히는 팝업, 스탬프를 모두 모으면 화면 가득 폭죽을 띄운다.
 * 서버·클라우드 DB는 쓰지 않는다.
 */
const StampContext = createContext(null);
const ALL = data.stamps;
const TOTAL = ALL.length;

export function StampProvider({ children }) {
  const [earned, setEarned] = useState({});
  const [popup, setPopup] = useState(null); // 방금 받은 스탬프 목록
  const [boardOpen, setBoardOpen] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const earnedRef = useRef({});
  const loaded = useRef(null);

  // 처음에 저장된 스탬프를 불러온다 (불러오기 전에 받은 스탬프는 불러온 뒤 처리)
  if (!loaded.current) {
    loaded.current = loadStamps().then((s) => {
      earnedRef.current = s;
      setEarned(s);
    });
  }

  const award = useCallback(async (ids) => {
    await loaded.current;
    const now = new Date().toISOString();
    const fresh = ids.filter((id) => ALL.some((s) => s.id === id) && !earnedRef.current[id]);
    if (fresh.length === 0) return;
    const next = { ...earnedRef.current };
    fresh.forEach((id) => (next[id] = now));
    earnedRef.current = next;
    setEarned(next);
    await saveStamps(next);
    if (Object.keys(next).length >= TOTAL) {
      setPopup(null);
      setCelebrate(true);
    } else {
      setPopup(fresh);
    }
  }, []);

  const reset = useCallback(async () => {
    earnedRef.current = {};
    setEarned({});
    await clearStamps();
  }, []);

  // 안드로이드 뒤로 가기 버튼으로 떠 있는 창을 닫는다
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (celebrate) return setCelebrate(false), true;
      if (popup) return setPopup(null), true;
      if (boardOpen) return setBoardOpen(false), true;
      return false;
    });
    return () => sub.remove();
  }, [celebrate, popup, boardOpen]);

  const count = Object.keys(earned).length;
  const value = useMemo(
    () => ({ earned, count, total: TOTAL, award, reset, openBoard: () => setBoardOpen(true) }),
    [earned, count, award, reset],
  );

  return (
    <StampContext.Provider value={value}>
      <View style={styles.root}>
        {children}
        {boardOpen ? <StampBoard earned={earned} onClose={() => setBoardOpen(false)} onReset={reset} /> : null}
        {popup ? (
          <AwardPopup
            ids={popup}
            count={count}
            onClose={() => setPopup(null)}
            onOpenBoard={() => {
              setPopup(null);
              setBoardOpen(true);
            }}
          />
        ) : null}
        {celebrate ? <Celebration earned={earned} onClose={() => setCelebrate(false)} /> : null}
      </View>
    </StampContext.Provider>
  );
}

/** { earned, count, total, award(ids), reset(), openBoard() } */
export function useStamps() {
  const ctx = useContext(StampContext);
  if (!ctx) throw new Error('useStamps는 StampProvider 안에서 써야 해요.');
  return ctx;
}

/** 새 스탬프가 위에서 '쾅' 찍히는 팝업 */
function AwardPopup({ ids, count, onClose, onOpenBoard }) {
  const slam = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    Animated.sequence([
      Animated.delay(150),
      Animated.timing(slam, { toValue: 1, duration: 260, easing: Easing.in(Easing.quad), useNativeDriver: true }),
    ]).start();
  }, [slam, fade]);

  const scale = slam.interpolate({ inputRange: [0, 0.85, 1], outputRange: [3, 0.9, 1] });
  const opacity = slam.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 1, 1] });
  // 도장이 찍히는 순간 카드가 '쿵' 하고 눌렸다가 돌아온다
  const thump = slam.interpolate({ inputRange: [0, 0.85, 0.92, 1], outputRange: [1, 1, 0.96, 1] });
  const stamps = ALL.filter((s) => ids.includes(s.id));

  return (
    <Animated.View style={[styles.backdrop, { opacity: fade }]}>
      <Animated.View style={[styles.card, glow(colors.lime, 24), { transform: [{ scale: thump }] }]}>
        <HintText style={styles.cardTitle}>네온 스탬프 획득!</HintText>
        <Animated.View style={[styles.stampRow, { opacity, transform: [{ scale }] }]}>
          {stamps.map((s) => (
            <NeonStamp key={s.id} stamp={s} earned size={104} showHow={false} />
          ))}
        </Animated.View>
        <HintText hint="모은 스탬프 {n} / {total}" params={{ n: count, total: TOTAL }} style={styles.count}>
          모은 스탬프 {count} / {TOTAL}
        </HintText>
        <View style={styles.stack}>
          <NeonButton title="확인" color={colors.lime} onPress={onClose} />
          <NeonButton title="스탬프판 보기" variant="outline" color={colors.blue} onPress={onOpenBoard} />
        </View>
      </Animated.View>
    </Animated.View>
  );
}

/** 스탬프판: 받은 스탬프와 아직 못 받은 스탬프(받는 방법)를 함께 보여 준다 */
function StampBoard({ earned, onClose, onReset }) {
  const [confirmReset, setConfirmReset] = useState(false);
  const count = Object.keys(earned).length;
  return (
    <View style={styles.backdrop}>
      <View style={[styles.board, glow(colors.purple, 20)]}>
        <ScrollView contentContainerStyle={styles.boardContent}>
          <HintText style={styles.cardTitle}>{data.title}</HintText>
          <HintText style={styles.subtitle}>{data.subtitle}</HintText>
          <HintText hint="모은 스탬프 {n} / {total}" params={{ n: count, total: TOTAL }} style={styles.count}>
            모은 스탬프 {count} / {TOTAL}
          </HintText>
          <View style={styles.grid}>
            {ALL.map((s) => (
              <NeonStamp key={s.id} stamp={s} earned={!!earned[s.id]} />
            ))}
          </View>
          <NeonButton title="닫기" color={colors.purple} onPress={onClose} />
          {confirmReset ? (
            <View style={styles.resetBox}>
              <HintText style={styles.resetText}>스탬프를 모두 지울까요? 되돌릴 수 없어요.</HintText>
              <View style={styles.buttons}>
                <NeonButton title="취소" variant="outline" color={colors.textMuted} onPress={() => setConfirmReset(false)} style={styles.flex} />
                <NeonButton
                  title="모두 지우기"
                  color={colors.pink}
                  onPress={() => {
                    onReset();
                    setConfirmReset(false);
                  }}
                  style={styles.flex}
                />
              </View>
            </View>
          ) : (
            <NeonButton title="스탬프 처음부터 다시 모으기" variant="outline" color={colors.textMuted} onPress={() => setConfirmReset(true)} />
          )}
        </ScrollView>
      </View>
    </View>
  );
}

/** 스탬프를 모두 모았을 때: 화면 가득 폭죽 */
function Celebration({ earned, onClose }) {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);
  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });

  return (
    <View style={[styles.backdrop, styles.celebrateBg]}>
      <Fireworks />
      <Animated.View style={[styles.celebrateBox, { transform: [{ scale }] }]}>
        <Text style={styles.trophy}>🎆</Text>
        <HintText style={styles.celebrateTitle}>스탬프를 모두 모았어요!</HintText>
        <HintText style={styles.celebrateText}>정말 대단해요! 생활 예절 박사님이에요.</HintText>
      </Animated.View>
      <View style={styles.miniRow}>
        {ALL.map((s) => (
          <NeonStamp key={s.id} stamp={s} earned={!!earned[s.id]} size={44} showHow={false} showTitle={false} />
        ))}
      </View>
      <NeonButton title="닫기" color={colors.lime} onPress={onClose} style={styles.celebrateClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 5, 12, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.md,
    zIndex: 30,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.surface,
    borderRadius: radius.card + 8,
    borderWidth: 3,
    borderColor: colors.lime,
    padding: space.lg,
    alignItems: 'center',
    gap: space.md,
  },
  cardTitle: { fontSize: 24, fontWeight: '900', color: colors.text, textAlign: 'center' },
  subtitle: { fontSize: font.small, color: colors.textMuted, textAlign: 'center' },
  stampRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: space.md },
  count: { fontSize: font.body, fontWeight: '800', color: colors.lime, textAlign: 'center' },
  buttons: { flexDirection: 'row', gap: space.sm, alignSelf: 'stretch' },
  stack: { gap: space.sm, alignSelf: 'stretch' },
  board: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '92%',
    backgroundColor: colors.surface,
    borderRadius: radius.card + 8,
    borderWidth: 3,
    borderColor: colors.purple,
  },
  boardContent: { padding: space.lg, gap: space.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', rowGap: space.lg, marginVertical: space.sm },
  resetBox: { gap: space.sm, alignItems: 'center' },
  resetText: { fontSize: font.small, color: colors.pink, fontWeight: '800', textAlign: 'center' },
  celebrateBg: { backgroundColor: 'rgba(2, 2, 8, 0.97)', gap: space.lg },
  celebrateBox: { alignItems: 'center', gap: space.sm },
  trophy: { fontSize: 72 },
  celebrateTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: colors.lime,
    textAlign: 'center',
    textShadowColor: colors.lime,
    textShadowRadius: 18,
    textShadowOffset: { width: 0, height: 0 },
  },
  celebrateText: { fontSize: font.body, color: colors.text, textAlign: 'center', fontWeight: '700' },
  miniRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 4 },
  celebrateClose: { alignSelf: 'stretch', marginHorizontal: space.lg },
});
