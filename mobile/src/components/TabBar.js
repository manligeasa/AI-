import { useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BouncyTabIcon from './BouncyTabIcon';
import { colors, glow } from '../theme/colors';
import { font } from '../theme/typography';

/** 화면 아래 탭 메뉴. 누를 때마다 아이콘이 통통 튄다. 큰 글씨·넓은 누름 영역으로 만들었다. */
export default function TabBar({ tabs, current, onChange }) {
  const insets = useSafeAreaInsets();
  const icons = useRef({});

  const handlePress = (key) => {
    icons.current[key]?.bounce();
    onChange(key);
  };

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {tabs.map((tab) => {
        const active = tab.key === current;
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: active }}
            onPress={() => handlePress(tab.key)}
            style={styles.tab}
          >
            <BouncyTabIcon ref={(r) => (icons.current[tab.key] = r)} source={tab.icon} active={active} />
            <Text style={[styles.label, { color: active ? tab.color : colors.textMuted }]}>{tab.label}</Text>
            <View style={[styles.indicator, active && { backgroundColor: tab.color, ...glow(tab.color, 8) }]} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 6,
  },
  tab: { flex: 1, alignItems: 'center', minHeight: 64 },
  label: { fontSize: font.small, fontWeight: '800', marginTop: 2 },
  indicator: { marginTop: 4, width: 28, height: 4, borderRadius: 2, backgroundColor: 'transparent' },
});
