import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { languageOf, translate } from './translate';
import { loadData, saveData } from '../storage/localStore';
import { colors, glow } from '../theme/colors';
import { font, radius, space } from '../theme/typography';

/**
 * 모국어 힌트 툴팁.
 * 한국어 문장을 길게 누르면 누른 자리 위에 작은 말풍선으로 번역을 보여 준다.
 * 고른 언어는 휴대폰 안 JSON 파일(settings.hintLanguage)에 저장한다.
 */
const HintContext = createContext({ lang: null, setLang: () => {}, show: () => {} });

const AUTO_HIDE_MS = 5000;
const BUBBLE_MAX = 300;

export function HintProvider({ children }) {
  const [lang, setLangState] = useState('vi');
  const [tip, setTip] = useState(null); // { text, x, y }
  const fade = useRef(new Animated.Value(0)).current;
  const hideTimer = useRef(null);
  const root = useRef(null);
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    loadData().then((d) => {
      if (d.settings?.hintLanguage !== undefined) setLangState(d.settings.hintLanguage);
    });
  }, []);

  const setLang = useCallback((code) => {
    setLangState(code);
    loadData()
      .then((d) => saveData({ ...d, settings: { ...d.settings, hintLanguage: code } }))
      .catch(() => {});
  }, []);

  const hide = useCallback(() => {
    clearTimeout(hideTimer.current);
    Animated.timing(fade, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => setTip(null));
  }, [fade]);

  /** korean: 한국어 문장(또는 틀), event: 길게 누른 이벤트 (누른 위치에 말풍선을 띄운다) */
  const show = useCallback(
    (korean, params, event) => {
      if (!lang) return;
      const text = translate(korean, lang, params);
      if (!text) {
        if (__DEV__) console.warn(`[힌트] 번역 없음: ${korean}`);
        return;
      }
      const { pageX, pageY } = event?.nativeEvent ?? {};
      const place = (ox, oy) => {
        setTip({ text, x: (pageX ?? width / 2) - ox, y: (pageY ?? height / 2) - oy });
        fade.setValue(0);
        Animated.spring(fade, { toValue: 1, friction: 6, tension: 140, useNativeDriver: true }).start();
        clearTimeout(hideTimer.current);
        hideTimer.current = setTimeout(hide, AUTO_HIDE_MS);
      };
      if (root.current?.measureInWindow) root.current.measureInWindow((ox, oy) => place(ox || 0, oy || 0));
      else place(0, 0);
    },
    [lang, width, height, fade, hide],
  );

  useEffect(() => () => clearTimeout(hideTimer.current), []);

  const value = useMemo(() => ({ lang, setLang, show }), [lang, setLang, show]);
  const language = languageOf(lang);

  // 말풍선은 손가락 위쪽에 띄우고, 화면 위쪽이면 아래쪽에 띄운다
  const bubbleWidth = Math.min(BUBBLE_MAX, width - space.md * 2);
  const left = tip ? Math.min(Math.max(tip.x - bubbleWidth / 2, space.sm), width - bubbleWidth - space.sm) : 0;
  const above = tip ? tip.y > 170 : true;
  const position = tip ? (above ? { bottom: height - tip.y + 18 } : { top: tip.y + 28 }) : {};

  return (
    <HintContext.Provider value={value}>
      <View ref={root} collapsable={false} style={styles.root}>
        {children}
        {tip && language ? (
          <Pressable style={StyleSheet.absoluteFill} onPress={hide} accessibilityRole="button" accessibilityLabel="힌트 닫기">
            <Animated.View
              style={[
                styles.bubble,
                glow(colors.blue, 16),
                { width: bubbleWidth, left, ...position },
                { opacity: fade, transform: [{ scale: fade.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }] },
              ]}
              accessibilityLiveRegion="polite"
            >
              <Text style={styles.lang}>
                {language.flag} {language.name}
              </Text>
              <Text style={styles.text}>{tip.text}</Text>
            </Animated.View>
          </Pressable>
        ) : null}
      </View>
    </HintContext.Provider>
  );
}

/** { lang, setLang, show } — show(한국어, params, 길게누른이벤트) */
export const useHint = () => useContext(HintContext);

const styles = StyleSheet.create({
  root: { flex: 1 },
  bubble: {
    position: 'absolute',
    backgroundColor: '#05050C',
    borderWidth: 2,
    borderColor: colors.blue,
    borderRadius: radius.button,
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
    gap: 2,
  },
  lang: { fontSize: 13, fontWeight: '800', color: colors.blue },
  text: { fontSize: font.body, fontWeight: '700', color: colors.text, lineHeight: 25 },
});
