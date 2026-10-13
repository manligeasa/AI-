/**
 * 로컬 JSON 저장소.
 * 서버 없이 휴대폰 안의 파일 하나(ai-coach-data.json)에 모든 데이터를 저장한다.
 * - 휴대폰(iOS·Android): 앱 전용 문서 폴더의 JSON 파일
 * - 웹 미리보기: 브라우저 localStorage (파일 시스템이 없기 때문)
 */
import { Platform } from 'react-native';
import { File, Paths } from 'expo-file-system';
import seed from '../data/seed.json';

const FILE_NAME = 'ai-coach-data.json';
const isWeb = Platform.OS === 'web';

const fresh = () => JSON.parse(JSON.stringify(seed));

/** 예전 버전 파일이나 일부가 빠진 파일도 기본값으로 채워서 돌려준다. */
const normalize = (data) => ({
  ...fresh(),
  ...data,
  settings: { ...seed.settings, ...data?.settings },
  history: Array.isArray(data?.history) ? data.history : [],
});

export async function loadData() {
  try {
    if (isWeb) {
      const raw = globalThis.localStorage?.getItem(FILE_NAME);
      return raw ? normalize(JSON.parse(raw)) : fresh();
    }
    const file = new File(Paths.document, FILE_NAME);
    if (!file.exists) return fresh();
    return normalize(JSON.parse(await file.text()));
  } catch {
    // 파일이 깨졌으면 처음 상태로 시작한다 (앱이 멈추지 않게)
    return fresh();
  }
}

export async function saveData(data) {
  const json = JSON.stringify(data, null, 2);
  if (isWeb) {
    globalThis.localStorage?.setItem(FILE_NAME, json);
    return;
  }
  const file = new File(Paths.document, FILE_NAME);
  if (!file.exists) file.create();
  file.write(json);
}
