import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, glow } from '../theme/colors';
import { font } from '../theme/typography';

/** 화면 아래 탭 메뉴. 큰 글씨·넓은 누름 영역으로 만들었다. */
export default function TabBar({ tabs, current, onChange }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {tabs.map((tab) => {
        const active = tab.key === current;
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(tab.key)}
            style={styles.tab}
          >
            <Text style={styles.icon}>{tab.icon}</Text>
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
    paddingTop: 10,
  },
  tab: { flex: 1, alignItems: 'center', gap: 2, minHeight: 56 },
  icon: { fontSize: 22 },
  label: { fontSize: font.small, fontWeight: '800' },
  indicator: { marginTop: 4, width: 28, height: 4, borderRadius: 2, backgroundColor: 'transparent' },
});
