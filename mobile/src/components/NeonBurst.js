import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { colors, glow } from '../theme/colors';

const PALETTE = [colors.pink, colors.lime, colors.blue, colors.purple];
const COUNT = 44; // 한 번에 터지는 파티클 수
const DURATION = 1600;

const random = (min, max) => min + Math.random() * (max - min);

/** 파티클 하나하나의 방향·거리·모양을 무작위로 정한다. */
function makeParticles() {
  return Array.from({ length: COUNT }, (_, i) => {
    const angle = (i / COUNT) * Math.PI * 2 + random(-0.2, 0.2);
    const distance = random(70, 210);
    return {
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance,
      fall: random(30, 70), // 끝으로 갈수록 살짝 아래로 떨어진다 (중력 느낌)
      size: random(6, 13),
      color: PALETTE[i % PALETTE.length],
      streak: i % 3 === 0, // 세 개 중 하나는 길쭉한 빛줄기 모양
      angleDeg: (angle * 180) / Math.PI,
      spin: random(-180, 180),
    };
  });
}

/**
 * 네온 파티클 폭죽.
 * 부모가 ref로 burst(x, y)를 부르면 그 위치에서 빛 조각과 빛 고리가 터진다.
 * 화면 위에 겹쳐 있지만 누름을 막지 않는다 (pointerEvents="none").
 * 모든 움직임은 네이티브 애니메이션으로 처리해 부드럽다.
 */
const NeonBurst = forwardRef(function NeonBurst(_, ref) {
  const [bursts, setBursts] = useState([]);
  const container = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  const remove = useCallback((id) => setBursts((list) => list.filter((b) => b.id !== id)), []);

  useImperativeHandle(ref, () => ({
    /** pageX, pageY: 화면 전체 기준 좌표 (누른 손가락 위치) */
    burst: (pageX, pageY) => {
      const start = (ox, oy) => {
        const id = `${Date.now()}-${Math.random()}`;
        const progress = new Animated.Value(0);
        const ring = new Animated.Value(0);
        setBursts((list) => [...list, { id, x: pageX - ox, y: pageY - oy, particles: makeParticles(), progress, ring }]);
        Animated.parallel([
          Animated.timing(progress, { toValue: 1, duration: DURATION, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
          Animated.timing(ring, { toValue: 1, duration: 900, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        ]).start(() => remove(id));
      };
      if (container.current?.measureInWindow) {
        container.current.measureInWindow((ox, oy) => {
          offset.current = { x: ox || 0, y: oy || 0 };
          start(offset.current.x, offset.current.y);
        });
      } else {
        start(offset.current.x, offset.current.y);
      }
    },
  }));

  return (
    <View ref={container} style={StyleSheet.absoluteFill} pointerEvents="none">
      {bursts.map((b) => (
        <View key={b.id} style={[styles.origin, { left: b.x, top: b.y }]}>
          <Ring progress={b.ring} color={colors.lime} maxScale={7} />
          <Ring progress={b.ring} color={colors.pink} maxScale={4.5} />
          {b.particles.map((p, i) => (
            <Particle key={i} p={p} progress={b.progress} />
          ))}
        </View>
      ))}
    </View>
  );
});

export default NeonBurst;

function Ring({ progress, color, maxScale }) {
  const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [0.2, maxScale] });
  const opacity = progress.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 1, 0] });
  return <Animated.View style={[styles.ring, { borderColor: color, opacity, transform: [{ scale }] }, glow(color, 12)]} />;
}

function Particle({ p, progress }) {
  const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [0, p.dx] });
  const translateY = progress.interpolate({ inputRange: [0, 0.7, 1], outputRange: [0, p.dy, p.dy + p.fall] });
  const opacity = progress.interpolate({ inputRange: [0, 0.75, 1], outputRange: [1, 1, 0] });
  const scale = progress.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 1.4, 0.7] });
  const rotate = progress.interpolate({ inputRange: [0, 1], outputRange: [`${p.angleDeg}deg`, `${p.angleDeg + p.spin}deg`] });

  const shape = p.streak
    ? { width: p.size * 2.4, height: p.size / 2.5, borderRadius: p.size }
    : { width: p.size, height: p.size, borderRadius: p.size / 2 };

  return (
    <Animated.View
      style={[
        styles.particle,
        shape,
        { marginLeft: -shape.width / 2, marginTop: -shape.height / 2, backgroundColor: p.color, opacity },
        glow(p.color, 10),
        { transform: [{ translateX }, { translateY }, { rotate }, { scale }] },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  origin: { position: 'absolute', width: 0, height: 0 },
  particle: { position: 'absolute' },
  ring: {
    position: 'absolute',
    width: 40,
    height: 40,
    marginLeft: -20,
    marginTop: -20,
    borderRadius: 20,
    borderWidth: 3,
  },
});
