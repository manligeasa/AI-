import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import NeonButton from './NeonButton';
import { colors, glow } from '../theme/colors';
import { font, radius, space } from '../theme/typography';

/**
 * 오답·시간 초과 때 뜨는 귀여운 팝업.
 * 나타날 때 '뿅' 커지며 좌우로 흔들리고, 열려 있는 동안 이모지가 살랑살랑 흔들린다.
 */
export default function OopsPopup({ visible, emoji = '🙈', title, text, buttonTitle, onClose }) {
  const enter = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;
  const wiggle = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return undefined;
    enter.setValue(0);
    shake.setValue(0);
    Animated.parallel([
      Animated.spring(enter, { toValue: 1, friction: 5, tension: 120, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 1, duration: 650, easing: Easing.linear, useNativeDriver: true }),
    ]).start();
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(wiggle, { toValue: 1, duration: 260, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(wiggle, { toValue: -1, duration: 520, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(wiggle, { toValue: 0, duration: 260, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.delay(500),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [visible, enter, shake, wiggle]);

  if (!visible) return null;

  const steps = [0, 0.12, 0.24, 0.36, 0.48, 0.6, 0.72, 1];
  const translateX = shake.interpolate({ inputRange: steps, outputRange: [0, -18, 16, -14, 11, -7, 4, 0] });
  const rotate = shake.interpolate({ inputRange: steps, outputRange: ['0deg', '-5deg', '5deg', '-4deg', '3deg', '-2deg', '1deg', '0deg'] });
  const scale = enter.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });
  const emojiRotate = wiggle.interpolate({ inputRange: [-1, 1], outputRange: ['-14deg', '14deg'] });

  return (
    <Animated.View style={[styles.backdrop, { opacity: enter }]} accessibilityViewIsModal>
      <Animated.View style={[styles.card, glow(colors.pink, 26), { transform: [{ translateX }, { rotate }, { scale }] }]}>
        <Animated.Text style={[styles.emoji, { transform: [{ rotate: emojiRotate }] }]}>{emoji}</Animated.Text>
        <Text style={styles.title} accessibilityLiveRegion="assertive">
          {title}
        </Text>
        {text ? <Text style={styles.text}>{text}</Text> : null}
        <View style={styles.button}>
          <NeonButton title={buttonTitle} color={colors.pink} onPress={onClose} />
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 5, 12, 0.78)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.lg,
    zIndex: 20,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: radius.card + 8,
    borderWidth: 3,
    borderColor: colors.pink,
    padding: space.lg,
    alignItems: 'center',
    gap: space.sm,
  },
  emoji: { fontSize: 64 },
  title: { fontSize: 24, fontWeight: '900', color: colors.pink, textAlign: 'center', lineHeight: 33 },
  text: { fontSize: font.body, color: colors.text, textAlign: 'center', lineHeight: 27 },
  button: { alignSelf: 'stretch', marginTop: space.sm },
});
