# AI 질문 코치 — 모바일 앱 (Expo)

AI 입문자를 위한 학습 앱이다. 하단 탭 4개(상황극·오디오·퀴즈·소통 카드)로 구성된다.
어두운 바탕에 네온 핑크·라임 그린·일렉트릭 블루를 포인트로 쓴 다크 테마다.

## 하단 탭과 아이콘 애니메이션

- 탭 목록(이름·색·아이콘·소개 문구): `src/tabs.js`
- 탭을 누를 때마다 아이콘이 통통 튄다. 오픈소스 [lottie-react-native](https://github.com/lottie-react-native/lottie-react-native)(MIT 라이선스)로 재생한다.
- 아이콘 애니메이션 파일(`src/assets/lottie/*.json`)은 외부 무료 소스를 받지 않고 `scripts/make-tab-icons.mjs`로 직접 만들었다. 저작권·라이선스 걱정이 없다.
- 아이콘 색이나 움직임을 바꾸려면 그 스크립트를 고친 뒤 `npm run icons`를 실행한다.
- 웹 미리보기에서는 Lottie 재생기가 인터넷(CDN)에서 실행 파일을 한 번 받아 온다. 휴대폰 앱은 인터넷이 필요 없다.

## 실행 방법

```bash
cd mobile
npm install
npm start          # QR 코드가 뜨면 휴대폰의 Expo Go 앱으로 찍는다
npm run web        # 컴퓨터 브라우저로 미리 보기
```

## 상황극 연습: 선택형 게임

- 장례식장·병원·카페·결혼식장·문자 사기 5가지 상황에서 알맞은 말을 고른다. 문장은 초급 한국어 수준이다.
- 상황 내용(장소·대사·선택지·정답·설명): `src/data/roleplay/scenarios.json`. 상황을 추가하려면 같은 모양으로 항목을 늘리면 된다.
- 정답을 누르면 누른 자리에서 네온 파티클(빛 조각) 44개와 빛 고리가 터진다: `src/components/NeonBurst.js`. 오답은 버튼이 좌우로 흔들리고 정답을 초록색으로 알려 준다.
- 상태 관리: `src/state/RolePlayContext.js`. 서버 없이 Context API(앱 안에서 데이터를 공유하는 React 기본 기능)와 useReducer로 관리한다. 탭을 옮겨도 진행 상황이 유지되고, 최고 점수만 휴대폰 안 JSON 파일(`rolePlay.bestScore`)에 저장한다.

## 소통 카드: 장례식장 조문 순서

- 7장의 카드를 옆으로 넘기며 조문 순서를 배운다. 손가락이 불편한 분을 위해 '이전/다음' 버튼도 있다.
- 카드 내용(제목·짧은 설명·팁·말해 볼 문장·색): `src/data/cards/condolence.json`. 문장은 초급 한국어 수준의 짧은 해요체로 썼다.
- 네온 라인아트 일러스트: `src/components/illustrations/NeonLineArt.js` (react-native-svg로 그린 선 그림. 굵고 흐린 선 위에 가늘고 밝은 선을 겹쳐 네온 빛을 낸다)
- 넘김 효과: `src/components/CardSwiper.js`. 옆 카드는 작아지고 흐려지며, 그림은 글자보다 늦게 따라와 깊이감이 생긴다. 휴대폰의 네이티브 애니메이션(useNativeDriver)으로 처리해 부드럽다.
- 새 카드 묶음을 만들려면 같은 모양의 JSON 파일을 추가하고 `src/tabs.js`의 `deck`에 연결한다.

## 데이터 저장 방식 (서버 비용 0원)

서버(인터넷에 있는 컴퓨터)를 전혀 쓰지 않는다. 모든 데이터는 휴대폰 안에만 있다.

| 데이터 | 위치 | 설명 |
| --- | --- | --- |
| 예시 질문 | `src/data/exampleQuestions.json` | 앱에 함께 들어가는 읽기 전용 JSON |
| 소통 카드 묶음 | `src/data/cards/*.json` | 카드 내용 (읽기 전용 JSON) |
| 기본값 | `src/data/seed.json` | 처음 실행할 때 쓰는 빈 데이터 모양 |
| 상황극 문제 | `src/data/roleplay/scenarios.json` | 상황·선택지 (읽기 전용 JSON) |
| 보관함·상황극 최고 점수 | 휴대폰 문서 폴더의 `ai-coach-data.json` | 앱이 읽고 쓰는 JSON 파일 |

- 저장·불러오기 코드: `src/storage/localStore.js` (휴대폰은 `expo-file-system`, 웹 미리보기는 브라우저 저장소)
- 앱을 삭제하면 저장한 질문도 함께 지워진다.

## 폴더 구조

```
mobile/
├─ index.js                 앱 시작점
├─ metro.config.js          상위 ../src 규칙 엔진을 함께 읽도록 설정
├─ scripts/make-tab-icons.mjs  탭 아이콘 Lottie 파일 만들기
└─ src/
   ├─ App.js                하단 탭 4개 화면 전환
   ├─ tabs.js               탭 4개 설정 (이름·색·아이콘·소개)
   ├─ assets/lottie/        탭 아이콘 애니메이션 JSON 4개
   ├─ theme/                색상표(colors.js)·글자 크기(typography.js)
   ├─ components/           네온 버튼·카드·칩·점수 배지·탭 바·튀는 아이콘
   ├─ state/                RolePlayContext(상황극 게임 상태, Context API)
   ├─ screens/              RolePlayScreen(상황극 게임), CardDeckScreen(스와이프 카드), TabScreen(탭 기본 틀), CoachScreen·HistoryScreen(이전 질문 코치 화면, 현재 탭에서 빠짐)
   ├─ services/coach.js     웹앱 규칙 엔진(../src/services)을 그대로 호출
   ├─ storage/              로컬 JSON 저장소와 화면용 훅
   └─ data/                 앱에 포함되는 JSON 파일
```

## 디자인 규칙

- 색은 `src/theme/colors.js`에서만 정한다. 여기만 바꾸면 앱 전체 색이 바뀐다.
- 50대 이상 사용자를 위해 기본 글자 18, 버튼 높이 56 이상으로 크게 잡았다.
- 네온은 포인트로만 쓰고, 본문 글자는 밝은 흰색으로 읽기 쉽게 유지한다.
