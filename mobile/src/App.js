import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import TabBar from './components/TabBar';
import TabScreen from './screens/TabScreen';
import CardDeckScreen from './screens/CardDeckScreen';
import { TABS } from './tabs';
import { colors } from './theme/colors';

export default function App() {
  const [tab, setTab] = useState(TABS[0].key);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
        {/* 탭을 옮겨도 화면 상태가 지워지지 않도록 숨기기만 한다 */}
        {TABS.map((t) => (
          <View key={t.key} style={[styles.root, tab !== t.key && styles.hidden]}>
            {t.deck ? (
              <CardDeckScreen label={t.label} color={t.color} deck={t.deck} />
            ) : (
              <TabScreen title={t.label} color={t.color} description={t.description} features={t.features} />
            )}
          </View>
        ))}
        <TabBar tabs={TABS} current={tab} onChange={setTab} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  hidden: { display: 'none' },
});
