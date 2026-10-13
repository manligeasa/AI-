import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions, View } from 'react-native';
import NeonBurst from './NeonBurst';
import { colors, glow } from '../theme/colors';

const PALETTE = [colors.pink, colors.lime, colors.blue, colors.purple];
const LAUNCH_EVERY = 420; // 폭죽을 쏘아 올리는 간격 (ms)

/**
 * 화면 전체 네온 폭죽.
 * 아래에서 빛줄기가 솟아올라 하늘에서 '펑' 하고 터지는 것을 계속 반복한다.
 * 터지는 모양은 NeonBurst(파티클)를 다시 쓴다.
 */
export default function Fireworks() {
  const { width, height } = useWindowDimensions();
  const burstRef = useRef(null);
  const rockets = useRef(Array.from({ length: 6 }, () => ({ y: new Animated.Value(0), x: 0, color: colors.pink, top: 0 }))).current;
  const slot = useRef(0);

  useEffect(() => {
    let alive = true;
    const launch = () => {
      if (!alive) return;
      const r = rockets[slot.current % rockets.length];
      slot.current += 1;
      r.x = width * (0.15 + Math.random() * 0.7);
      r.top = height * (0.08 + Math.random() * 0.25); // 글자를 가리지 않도록 화면 위쪽에서 터진다
      r.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      r.y.setValue(0);
      Animated.timing(r.y, { toValue: 1, duration: 650, easing: Easing.out(Easing.quad), useNativeDriver: true }).start(({ finished }) => {
        if (finished && alive) burstRef.current?.burst(r.x, r.top);
      });
    };
    launch();
    const timer = setInterval(launch, LAUNCH_EVERY);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [rockets, width, height]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {rockets.map((r, i) => (
        <Rocket key={i} rocket={r} height={height} />
      ))}
      <NeonBurst ref={burstRef} />
    </View>
  );
}

/** 위로 솟아오르는 빛줄기 하나 */
function Rocket({ rocket, height }) {
  const translateY = rocket.y.interpolate({ inputRange: [0, 1], outputRange: [height, rocket.top] });
  const opacity = rocket.y.interpolate({ inputRange: [0, 0.1, 0.9, 1], outputRange: [0, 1, 1, 0] });
  return (
    <Animated.View
      style={[
        styles.rocket,
        { left: rocket.x - 2, backgroundColor: rocket.color, opacity, transform: [{ translateY }] },
        glow(rocket.color, 10),
      ]}
    />
  );
}

const styles = StyleSheet.create({
  rocket: { position: 'absolute', top: 0, width: 4, height: 26, borderRadius: 2 },
});
