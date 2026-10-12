# AI 질문 코치 — 모바일 앱 (Expo)

웹앱과 같은 **규칙 기반 질문 평가**를 휴대폰 앱으로 옮긴 버전이다.
어두운 바탕에 네온 핑크·라임 그린·일렉트릭 블루를 포인트로 쓴 다크 테마다.

## 실행 방법

```bash
cd mobile
npm install
npm start          # QR 코드가 뜨면 휴대폰의 Expo Go 앱으로 찍는다
npm run web        # 컴퓨터 브라우저로 미리 보기
```

## 데이터 저장 방식 (서버 비용 0원)

서버(인터넷에 있는 컴퓨터)를 전혀 쓰지 않는다. 모든 데이터는 휴대폰 안에만 있다.

| 데이터 | 위치 | 설명 |
| --- | --- | --- |
| 예시 질문 | `src/data/exampleQuestions.json` | 앱에 함께 들어가는 읽기 전용 JSON |
| 기본값 | `src/data/seed.json` | 처음 실행할 때 쓰는 빈 데이터 모양 |
| 보관함(저장한 질문) | 휴대폰 문서 폴더의 `ai-coach-data.json` | 앱이 읽고 쓰는 JSON 파일 |

- 저장·불러오기 코드: `src/storage/localStore.js` (휴대폰은 `expo-file-system`, 웹 미리보기는 브라우저 저장소)
- 앱을 삭제하면 저장한 질문도 함께 지워진다.

## 폴더 구조

```
mobile/
├─ index.js                 앱 시작점
├─ metro.config.js          상위 ../src 규칙 엔진을 함께 읽도록 설정
└─ src/
   ├─ App.js                탭 2개(코치·보관함) 화면 전환
   ├─ theme/                색상표(colors.js)·글자 크기(typography.js)
   ├─ components/           네온 버튼·카드·칩·점수 배지·탭 바
   ├─ screens/              CoachScreen(질문 평가), HistoryScreen(보관함)
   ├─ services/coach.js     웹앱 규칙 엔진(../src/services)을 그대로 호출
   ├─ storage/              로컬 JSON 저장소와 화면용 훅
   └─ data/                 앱에 포함되는 JSON 파일
```

## 디자인 규칙

- 색은 `src/theme/colors.js`에서만 정한다. 여기만 바꾸면 앱 전체 색이 바뀐다.
- 50대 이상 사용자를 위해 기본 글자 18, 버튼 높이 56 이상으로 크게 잡았다.
- 네온은 포인트로만 쓰고, 본문 글자는 밝은 흰색으로 읽기 쉽게 유지한다.
