import { useRef } from 'react';
import { Animated, PanResponder, StyleSheet, Text, View } from 'react-native';
import { colors, glow } from '../theme/colors';
import { font, radius } from '../theme/typography';

/**
 * 손가락으로 끌어 옮기는 글자 스티커.
 * 놓았을 때 onDrop(스티커, 손가락 x, y)이 붙일 자리의 가운데 좌표를 돌려주면 그곳으로 쏙 들어가고,
 * null을 돌려주면 제자리로 통통 튀며 돌아간다.
 * 좌표는 모두 화면 전체 기준이다.
 */
export default function DraggableSticker({ sticker, color = colors.blue, onStart, onMove, onDrop, onPlaced }) {
  const pan = useRef(new Animated.ValueXY()).current;
  const lift = useRef(new Animated.Value(1)).current;
  const home = useRef(null);
  const homeCenter = useRef({ x: 0, y: 0 });
  // PanResponder는 한 번만 만들므로 최신 콜백을 ref로 넘긴다
  const cb = useRef({});
  cb.current = { onStart, onMove, onDrop, onPlaced };

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        home.current?.measureInWindow((x, y, w, h) => {
          homeCenter.current = { x: x + w / 2, y: y + h / 2 };
        });
        cb.current.onStart?.();
        Animated.spring(lift, { toValue: 1.15, friction: 5, useNativeDriver: false }).start();
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
        listener: (_, g) => cb.current.onMove?.(g.moveX, g.moveY),
      }),
      onPanResponderRelease: (_, g) => {
        Animated.spring(lift, { toValue: 1, friction: 5, useNativeDriver: false }).start();
        const target = g.dx || g.dy ? cb.current.onDrop?.(sticker, g.moveX, g.moveY) : null;
        if (target) {
          Animated.spring(pan, {
            toValue: { x: target.x - homeCenter.current.x, y: target.y - homeCenter.current.y },
            friction: 6,
            useNativeDriver: false,
          }).start(() => cb.current.onPlaced?.(sticker, target));
        } else {
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, friction: 4, tension: 60, useNativeDriver: false }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
        Animated.spring(lift, { toValue: 1, useNativeDriver: false }).start();
      },
    }),
  ).current;

  return (
    <View ref={home} collapsable={false} style={styles.home}>
      <Animated.View
        {...responder.panHandlers}
        accessibilityRole="button"
        accessibilityLabel={`${sticker.text} 스티커. 끌어서 봉투에 붙여요`}
        style={[
          styles.sticker,
          { borderColor: color, backgroundColor: `${color}26` },
          glow(color, 14),
          { transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale: lift }] },
        ]}
      >
        <Text style={[styles.text, { color }]}>{sticker.text}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  home: { zIndex: 10 },
  sticker: {
    minWidth: 110,
    minHeight: 60,
    paddingHorizontal: 18,
    borderRadius: radius.button,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'grab',
  },
  text: { fontSize: font.heading + 2, fontWeight: '900', letterSpacing: 2 },
});
