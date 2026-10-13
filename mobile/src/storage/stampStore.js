/**
 * 스탬프 획득 기록 저장소.
 * 클라우드 DB 없이 기기 내부 저장소(AsyncStorage)에만 저장한다.
 * - Android: 앱 전용 내부 데이터베이스 / iOS: 앱 전용 저장 파일 / 웹 미리보기: 브라우저 localStorage
 * 저장 모양: { "roleplay": "2026-10-13T09:00:00.000Z", ... } (스탬프 id → 받은 시각)
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'neonStamps:v1';

export async function loadStamps() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const data = raw ? JSON.parse(raw) : {};
    return data && typeof data === 'object' ? data : {};
  } catch {
    return {};
  }
}

export async function saveStamps(stamps) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(stamps));
  } catch {
    // 저장에 실패해도 앱은 계속 쓸 수 있게 한다
  }
}

export async function clearStamps() {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch {
    // 무시
  }
}
