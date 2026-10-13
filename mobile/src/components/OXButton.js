import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';
import { colors, glow } from '../theme/colors';
import { font, radius } from '../theme/typography';

/** O는 동그라미, X는 엇갈린 두 선. 네온처럼 굵고 흐린 선 위에 밝은 선을 겹친다. */
const MARK = {
  O: <Circle cx="50" cy="50" r="32" />,
  X: <Path d="M22 22 L78 78 M78 22 L22 78" />,
};

/** 화면 가운데에 놓는 거대한 네온 O / X 버튼. 누르면 꾹 눌렸다가 튀어 오른다. */
export default function OXButton({ mark, color, width, height, label, onPress, disabled }) {
  const markSize = Math.min(width, height) * 0.72;
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () => Animated.spring(scale, { toValue: 0.9, useNativeDriver: true }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1, friction: 3, tension: 200, useNativeDriver: true }).start();
  const line = { fill: 'none', stroke: color, strokeLinecap: 'round' };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${mark}, ${label}`}
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        disabled={disabled}
        style={[styles.button, { width, height, borderColor: color, backgroundColor: `${color}14` }, glow(color, 22), disabled && styles.disabled]}
      >
        <Svg width={markSize} height={markSize} viewBox="0 0 100 100">
          <G {...line} strokeWidth={22} opacity={0.18}>
            {MARK[mark]}
          </G>
          <G {...line} strokeWidth={15} opacity={0.4}>
            {MARK[mark]}
          </G>
          <G {...line} strokeWidth={9}>
            {MARK[mark]}
          </G>
        </Svg>
        <Text style={[styles.label, { color }]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: { borderRadius: radius.card + 8, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.5 },
  label: { fontSize: font.heading, fontWeight: '900', marginTop: -4 },
});
