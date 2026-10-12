import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { glow } from '../theme/colors';

const RINGS = 3;
const CYCLE = 1800; // 고리 하나가 퍼져 나가는 시간

/**
 * 버튼 주변으로 네온 빛 고리가 물결처럼 퍼지는 효과.
 * active가 true인 동안 고리 3개가 시간차를 두고 계속 퍼진다.
 * 버튼 뒤에 깔리며 누름을 막지 않는다.
 */
export default function NeonPulse({ active, color, size }) {
  const rings = useRef(Array.from({ length: RINGS }, () => new Animated.Value(0))).current;
  const halo = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) {
      rings.forEach((r) => r.stopAnimation());
      Animated.timing(halo, { toValue: 0, duration: 300, useNativeDriver: true }).start();
      Animated.parallel(rings.map((r) => Animated.timing(r, { toValue: 0, duration: 300, useNativeDriver: true }))).start();
      return undefined;
    }

    Animated.timing(halo, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    const loops = rings.map((r, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay((CYCLE / RINGS) * i),
          Animated.timing(r, { toValue: 1, duration: CYCLE, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(r, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      ),
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [active, rings, halo]);

  const base = { width: size, height: size, borderRadius: size / 2, marginLeft: -size / 2, marginTop: -size / 2 };

  return (
    <View style={styles.center} pointerEvents="none">
      {/* 버튼 바로 뒤에서 은은하게 빛나는 후광 */}
      <Animated.View
        style={[
          styles.abs,
          base,
          { backgroundColor: `${color}33`, opacity: halo, transform: [{ scale: halo.interpolate({ inputRange: [0, 1], outputRange: [1, 1.25] }) }] },
          glow(color, 40),
        ]}
      />
      {rings.map((r, i) => (
        <Animated.View
          key={i}
          style={[
            styles.abs,
            base,
            styles.ring,
            { borderColor: color },
            glow(color, 18),
            {
              opacity: r.interpolate({ inputRange: [0, 0.1, 1], outputRange: [0, 0.9, 0] }),
              transform: [{ scale: r.interpolate({ inputRange: [0, 1], outputRange: [1, 2.6] }) }],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { position: 'absolute', left: '50%', top: '50%', width: 0, height: 0 },
  abs: { position: 'absolute' },
  ring: { borderWidth: 3 },
});
