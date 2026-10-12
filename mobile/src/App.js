import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import TabBar from './components/TabBar';
import CoachScreen from './screens/CoachScreen';
import HistoryScreen from './screens/HistoryScreen';
import { useLocalData } from './storage/useLocalData';
import { colors } from './theme/colors';

const TABS = [
  { key: 'coach', label: '코치', icon: '⚡', color: colors.pink },
  { key: 'history', label: '보관함', icon: '📦', color: colors.blue },
];

export default function App() {
  const [tab, setTab] = useState('coach');
  const { data, loading, addHistory, toggleFavorite, removeHistory } = useLocalData();

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.pink} />
          </View>
        ) : (
          <View style={styles.root}>
            {/* 탭을 옮겨도 입력하던 질문이 지워지지 않도록 화면을 숨기기만 한다 */}
            <View style={[styles.root, tab !== 'coach' && styles.hidden]}>
              <CoachScreen onSaved={addHistory} />
            </View>
            <View style={[styles.root, tab !== 'history' && styles.hidden]}>
              <HistoryScreen history={data.history} onToggleFavorite={toggleFavorite} onRemove={removeHistory} />
            </View>
          </View>
        )}
        <TabBar tabs={TABS} current={tab} onChange={setTab} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  hidden: { display: 'none' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
