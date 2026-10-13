import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import TabBar from './components/TabBar';
import TabScreen from './screens/TabScreen';
import CardDeckScreen from './screens/CardDeckScreen';
import { TABS } from './tabs';
import { RolePlayProvider } from './state/RolePlayContext';
import { HintProvider } from './i18n/HintContext';
import HintLanguageButton from './components/HintLanguageButton';
import { colors } from './theme/colors';

export default function App() {
  const [tab, setTab] = useState(TABS[0].key);

  return (
    <SafeAreaProvider>
      {/* 모국어 힌트 툴팁: 한국어 문장을 길게 누르면 번역이 뜬다 (번역은 앱 안 JSON, 유료 API 없음) */}
      <HintProvider>
        {/* 상황극 게임 상태: 서버 없이 앱 안에서만 관리 (Context API) */}
        <RolePlayProvider>
          <StatusBar style="light" />
          <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
            {/* 탭을 옮겨도 화면 상태가 지워지지 않도록 숨기기만 한다 */}
            {TABS.map((t) => (
              <View key={t.key} style={[styles.root, tab !== t.key && styles.hidden]}>
                {t.Screen ? (
                  <t.Screen label={t.label} color={t.color} deck={t.deck} />
                ) : t.deck ? (
                  <CardDeckScreen label={t.label} color={t.color} deck={t.deck} />
                ) : (
                  <TabScreen title={t.label} color={t.color} description={t.description} features={t.features} />
                )}
              </View>
            ))}
            <TabBar tabs={TABS} current={tab} onChange={setTab} />
            {/* 오른쪽 위: 길게 눌렀을 때 보여 줄 모국어 고르기 */}
            <HintLanguageButton />
          </SafeAreaView>
        </RolePlayProvider>
      </HintProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  hidden: { display: 'none' },
});
