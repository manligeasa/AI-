import { useCallback, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import HintText from './HintText';
import NeonButton from './NeonButton';
import NeonLineArt from './illustrations/NeonLineArt';
import { colors, glow } from '../theme/colors';
import { font, radius, space } from '../theme/typography';

/**
 * 옆으로 넘기는 카드 묶음.
 * 넘길 때 옆 카드는 작아지고 흐려지며, 그림은 글자보다 조금 늦게 따라와 깊이감이 생긴다.
 * 손가락으로 넘기기 어려운 분을 위해 '이전/다음' 버튼도 둔다.
 */
export default function CardSwiper({ cards }) {
  const { width, height } = useWindowDimensions();
  // 작은 휴대폰에서도 카드가 화면을 넘지 않도록 그림 크기를 화면 높이에 맞춘다
  const compact = height < 760;
  const artWidth = Math.max(110, Math.min(width - 96, 260, (height - (compact ? 520 : 560)) / 0.8));
  const scrollX = useRef(new Animated.Value(0)).current;
  const listRef = useRef(null);
  const [index, setIndex] = useState(0);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems[0]?.index != null) setIndex(viewableItems[0].index);
  }).current;

  const goTo = useCallback((i) => listRef.current?.scrollToIndex({ index: i, animated: true }), []);
  const isLast = index === cards.length - 1;

  const renderItem = ({ item, index: i }) => {
    const range = [(i - 1) * width, i * width, (i + 1) * width];
    const scale = scrollX.interpolate({ inputRange: range, outputRange: [0.86, 1, 0.86], extrapolate: 'clamp' });
    const opacity = scrollX.interpolate({ inputRange: range, outputRange: [0.3, 1, 0.3], extrapolate: 'clamp' });
    const artShift = scrollX.interpolate({ inputRange: range, outputRange: [width * 0.35, 0, -width * 0.35], extrapolate: 'clamp' });
    const color = colors[item.color] ?? colors.blue;

    return (
      <View style={{ width, paddingHorizontal: space.md }}>
        <Animated.View
          style={[styles.card, compact && styles.cardCompact, { borderColor: color, opacity, transform: [{ scale }] }, glow(color, 14)]}
          accessible
          accessibilityLabel={`${i + 1}단계. ${item.title}. ${item.text} ${item.say ?? ''} ${item.tip ?? ''}`}
        >
          <View style={styles.stepRow}>
            <View style={[styles.stepBadge, { backgroundColor: color }]}>
              <Text style={styles.stepNumber}>{i + 1}</Text>
            </View>
            <Text style={styles.stepCount}>
              {i + 1} / {cards.length}
            </Text>
          </View>

          <View style={styles.artClip}>
            <Animated.View style={[styles.art, { transform: [{ translateX: artShift }] }]}>
              <NeonLineArt name={item.id} color={color} width={artWidth} />
            </Animated.View>
          </View>

          <HintText style={[styles.title, compact && styles.titleCompact, { color }]}>{item.title}</HintText>
          <HintText style={[styles.text, compact && styles.textCompact]}>{item.text}</HintText>
          {item.say ? (
            <View style={[styles.say, { borderColor: color }]}>
              <HintText hint={item.say} style={[styles.sayText, { color }]}>
                “{item.say}”
              </HintText>
            </View>
          ) : null}
          {item.tip ? (
            <HintText hint={item.tip} style={styles.tip}>
              💡 {item.tip}
            </HintText>
          ) : null}
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <Animated.FlatList
        ref={listRef}
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
        style={styles.root}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.dots}>
        {cards.map((c, i) => {
          const range = [(i - 1) * width, i * width, (i + 1) * width];
          const dotOpacity = scrollX.interpolate({ inputRange: range, outputRange: [0.3, 1, 0.3], extrapolate: 'clamp' });
          const dotScale = scrollX.interpolate({ inputRange: range, outputRange: [1, 1.6, 1], extrapolate: 'clamp' });
          return (
            <Animated.View
              key={c.id}
              style={[styles.dot, { backgroundColor: colors[c.color], opacity: dotOpacity, transform: [{ scale: dotScale }] }]}
            />
          );
        })}
      </View>

      <View style={styles.buttons}>
        <NeonButton
          title="← 이전"
          variant="outline"
          color={colors.textMuted}
          onPress={() => goTo(index - 1)}
          disabled={index === 0}
          style={styles.flex}
        />
        <NeonButton
          title={isLast ? '처음으로' : '다음 →'}
          color={colors[cards[index].color]}
          onPress={() => goTo(isLast ? 0 : index + 1)}
          style={styles.flex}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  listContent: { alignItems: 'center' },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1.5,
    padding: space.lg,
    gap: space.sm,
  },
  stepRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepBadge: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  stepNumber: { fontSize: font.heading, fontWeight: '900', color: colors.textOnNeon },
  stepCount: { fontSize: font.small, color: colors.textMuted, fontWeight: '700' },
  art: { alignItems: 'center', marginVertical: space.sm },
  artClip: { overflow: 'hidden' },
  cardCompact: { padding: space.md, gap: space.xs },
  title: { fontSize: 26, fontWeight: '900', textAlign: 'center' },
  titleCompact: { fontSize: 22 },
  text: { fontSize: 21, color: colors.text, lineHeight: 31, textAlign: 'center', fontWeight: '600' },
  textCompact: { fontSize: 19, lineHeight: 27 },
  say: { borderWidth: 1.5, borderRadius: radius.button, paddingVertical: space.sm, paddingHorizontal: space.md, alignSelf: 'center' },
  sayText: { fontSize: font.body, fontWeight: '800' },
  tip: { fontSize: font.small, color: colors.textMuted, lineHeight: 24, textAlign: 'center', marginTop: space.xs },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 12, paddingVertical: space.sm },
  dot: { width: 8, height: 8, borderRadius: 4 },
  buttons: { flexDirection: 'row', gap: space.sm, paddingHorizontal: space.md, paddingBottom: space.md },
});
