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

## 네온 스탬프 보상

- 퀴즈·상황극을 마치면 도장 모양의 네온 스탬프를 준다. 모두 6개다.
  - 상황극: 끝까지 풀기 / 만점
  - 스피드 OX: 끝까지 풀기 / 만점
  - 봉투 붙이기: 모두 붙이기 / 한 번도 틀리지 않기
- 새 스탬프를 받으면 도장이 위에서 '쾅' 찍히는 팝업이 뜬다. 6개를 모두 모으면 화면 가득 네온 폭죽이 계속 터진다.
- 오른쪽 위 🏅 버튼(예: 🏅 2/6)으로 스탬프판을 연다. 못 받은 스탬프는 받는 방법이 적혀 있다. 강의 실습용으로 '스탬프 처음부터 다시 모으기' 버튼도 있다.
- 획득 기록은 클라우드 DB 없이 **기기 내부 저장소(AsyncStorage)** 에만 저장한다. 안드로이드는 앱 전용 내부 저장소, iOS는 앱 전용 저장 파일, 웹 미리보기는 브라우저 localStorage에 들어간다. 키는 `neonStamps:v1`, 값은 `{ 스탬프 id: 받은 시각 }`이다. 앱을 지우면 기록도 지워진다.
- 관련 파일: `src/state/StampContext.js`(상태·팝업·스탬프판·축하 화면), `src/storage/stampStore.js`(AsyncStorage), `src/components/NeonStamp.js`, `src/components/Fireworks.js`, `src/data/stamps.json`(스탬프 목록)

## 모국어 힌트 툴팁 (베트남어·중국어·필리핀어)

- 화면의 한국어 문장을 **길게 누르면**(0.4초) 누른 자리 위에 작은 말풍선으로 모국어 뜻이 나타난다. 화면을 누르거나 5초가 지나면 사라진다.
- 버튼·선택지·체크박스·탭은 길게 눌러도 실행되지 않고 힌트만 보여 준다. 짧게 누르면 원래대로 동작한다.
- 오른쪽 위 🌏 버튼에서 힌트 언어(🇻🇳 Tiếng Việt / 🇨🇳 中文 / 🇵🇭 Filipino / 끄기)를 고른다. 고른 언어는 휴대폰 안 JSON 파일(`settings.hintLanguage`)에 저장된다.
- 번역은 유료 번역 API 없이 `src/i18n/translations.json`에 미리 넣어 두었다. 한국어 문장이 그대로 열쇠이고, 숫자가 들어가는 문장은 `문제 {n} / {total}` 같은 틀을 쓴다.
- **번역 빠짐 검사:** `npm run check:i18n`. 화면 코드와 데이터 JSON에서 한국어 문장을 모두 찾아 세 언어 번역이 있는지 확인한다. 문장을 새로 넣거나 고치면 이 검사를 돌리고, 빠진 문장을 사전에 추가한다.
- 관련 파일: `src/i18n/HintContext.js`(툴팁·언어 상태), `src/components/HintText.js`(길게 누르면 힌트가 뜨는 글자), `src/components/HintLanguageButton.js`(🌏 언어 고르기), `scripts/check-translations.mjs`(검사)
- 번역은 쉬운 말로 뜻이 전달되도록 썼다. '상주', '부의' 같은 한국 문화 용어는 짧은 설명을 붙였다. 실제 배포 전에는 원어민 검토를 권한다.

## 퀴즈: 스피드 OX

- 퀴즈 탭 위쪽에서 [⚡ 스피드 OX | ✉️ 봉투 붙이기]를 바꿔 본다. 스피드 OX가 기본 화면이다.
- 조문 예절·봉투·문자 사기·AI 상식 10문제가 매번 섞여 나온다. 문제마다 10초 안에 화면 가운데의 거대한 네온 O(블루) / X(핑크) 버튼을 누른다.
- 남은 시간은 줄어드는 네온 막대와 숫자로 보여 준다. 3초 이하가 되면 핑크색으로 바뀐다.
- 정답이면 네온 파티클이 터지고 다음 문제로 넘어간다.
- 오답이면 "앗! 향은 입으로 불면 안 돼요!" 같은 귀여운 팝업이 '뿅' 커지며 좌우로 흔들리고, 이모지가 계속 살랑거린다: `src/components/OopsPopup.js`. 시간이 지나도 같은 팝업에 정답을 알려 준다.
- 최고 기록은 휴대폰 안 JSON 파일(`quiz.oxBest`)에 저장한다.
- 문제·오답 문구·설명: `src/data/quiz/ox.json`. 문제마다 `oops`(팝업 제목)와 `explain`(설명)을 따로 쓸 수 있다.

## 퀴즈: 봉투 이름표 붙이기 (드래그 앤 드롭)

- 결혼식·장례식 봉투(네온 라인아트) 두 장과 '축결혼', '부의' 글자 스티커가 나온다. 스티커를 손가락으로 끌어 알맞은 봉투의 점선 칸에 놓는다.
- 맞는 봉투에 놓으면 스티커가 칸 가운데로 쏙 들어가 세로 글씨로 붙고, 그 자리에서 네온 파티클이 터진다.
- 틀린 봉투나 빈 곳에 놓으면 제자리로 통통 튀며 돌아가고, 왜 틀렸는지 쉬운 설명이 나온다.
- 끄는 중에 봉투 위로 가면 칸이 라임색으로 빛나 '여기에 놓으면 된다'를 알려 준다. 칸보다 조금 밖에 놓아도 붙도록 여유를 두었다.
- 추가 설치 없이 React Native 기본 기능(PanResponder)으로 만들어 Expo Go에서 바로 동작한다: `src/components/DraggableSticker.js`, `src/screens/EnvelopeGameScreen.js`
- 봉투·스티커·설명 문구: `src/data/quiz/envelopes.json`

## 오디오 가이드: 무료 음성 읽기(TTS)

- 휴대폰에 기본으로 들어 있는 음성 읽기 기능(expo-speech)을 쓴다. 유료 클라우드 음성 서비스나 인터넷이 필요 없다.
- 듣기 버튼을 누르면 "마음이 많이 아프시겠어요"를 한국어(ko-KR)로 읽고, 읽는 동안 버튼 주변으로 네온 빛 고리가 물결처럼 퍼진다: `src/components/NeonPulse.js`.
- 다시 누르면 멈춘다. 읽는 속도는 '천천히(0.75배)'와 '보통' 중에서 고른다.
- 읽을 문장: `src/data/audio/phrases.json`.
- 한국어 음성이 없는 휴대폰이면 설정 방법을 화면에 안내한다. 소리는 휴대폰 TTS 설정의 목소리를 따른다.

## 상황극 연습: 선택형 게임

- 장례식장·병원·카페·결혼식장·문자 사기 5가지 상황에서 알맞은 말을 고른다. 문장은 초급 한국어 수준이다.
- 상황 내용(장소·대사·선택지·정답·설명): `src/data/roleplay/scenarios.json`. 상황을 추가하려면 같은 모양으로 항목을 늘리면 된다.
- 정답을 누르면 누른 자리에서 네온 파티클(빛 조각) 44개와 빛 고리가 터진다: `src/components/NeonBurst.js`. 오답은 버튼이 좌우로 흔들리고 정답을 초록색으로 알려 준다.
- 상태 관리: `src/state/RolePlayContext.js`. 서버 없이 Context API(앱 안에서 데이터를 공유하는 React 기본 기능)와 useReducer로 관리한다. 탭을 옮겨도 진행 상황이 유지되고, 최고 점수만 휴대폰 안 JSON 파일(`rolePlay.bestScore`)에 저장한다.

## 소통 카드: 보여 주는 카드

- 소통 카드 탭 위쪽에서 '보여 주는 카드'와 '조문 순서'를 바꿔 본다.
- 체크박스로 내 상황(종교적 이유, 무릎·허리 통증, 귀가 잘 안 들림, 한국어가 서툼)을 고르면 상대에게 보여 줄 문장이 바로 크게 나타난다. 예) 종교적 이유 → "제 종교 때문에 절 대신 묵념하겠습니다."
- 여러 개를 고르면 문장이 차례로 함께 나온다. '화면 가득 크게 보여 주기'를 누르면 화면에 꽉 차는 크기로 보여 주고, 화면을 누르면 닫힌다.
- 검은 바탕에 라임 네온 글자를 써서 명암 대비가 약 17:1이다 (웹 접근성 기준 최고 등급 7:1보다 높음).
- 서버 통신 없이 휴대폰 화면 안에서만 만들어진다. 상황과 문장: `src/data/cards/situations.json`.

## 소통 카드: 장례식장 조문 순서

- 7장의 카드를 옆으로 넘기며 조문 순서를 배운다. 손가락이 불편한 분을 위해 '이전/다음' 버튼도 있다.
- 카드 내용(제목·짧은 설명·팁·말해 볼 문장·색): `src/data/cards/condolence.json`. 문장은 초급 한국어 수준의 짧은 해요체로 썼다.
- 네온 라인아트 일러스트: `src/components/illustrations/NeonLineArt.js` (react-native-svg로 그린 선 그림. 굵고 흐린 선 위에 가늘고 밝은 선을 겹쳐 네온 빛을 낸다)
- 넘김 효과: `src/components/CardSwiper.js`. 옆 카드는 작아지고 흐려지며, 그림은 글자보다 늦게 따라와 깊이감이 생긴다. 휴대폰의 네이티브 애니메이션(useNativeDriver)으로 처리해 부드럽다.
- 새 카드 묶음을 만들려면 같은 모양의 JSON 파일을 추가하고 `src/tabs.js`의 `deck`에 연결한다.

## 확인·출시

휴대폰에서 확인하는 법과 스토어 출시 순서: [docs/모바일-앱-확인-및-출시.md](../docs/모바일-앱-확인-및-출시.md)

## 데이터 저장 방식 (서버 비용 0원)

서버(인터넷에 있는 컴퓨터)를 전혀 쓰지 않는다. 모든 데이터는 휴대폰 안에만 있다.

| 데이터 | 위치 | 설명 |
| --- | --- | --- |
| 예시 질문 | `src/data/exampleQuestions.json` | 앱에 함께 들어가는 읽기 전용 JSON |
| 소통 카드 | `src/data/cards/*.json` | 조문 순서 카드·상황별 문장 (읽기 전용 JSON) |
| 기본값 | `src/data/seed.json` | 처음 실행할 때 쓰는 빈 데이터 모양 |
| OX 퀴즈 | `src/data/quiz/ox.json` | 문제·정답·오답 팝업 문구 (읽기 전용 JSON) |
| 봉투 퀴즈 | `src/data/quiz/envelopes.json` | 봉투·스티커·설명 (읽기 전용 JSON) |
| 오디오 문장 | `src/data/audio/phrases.json` | 읽어 줄 문장 (읽기 전용 JSON) |
| 상황극 문제 | `src/data/roleplay/scenarios.json` | 상황·선택지 (읽기 전용 JSON) |
| 모국어 힌트 번역 | `src/i18n/translations.json` | 한국어 → 베트남어·중국어·필리핀어 (읽기 전용 JSON) |
| 네온 스탬프 획득 기록 | 기기 내부 저장소 AsyncStorage (`neonStamps:v1`) | 받은 스탬프와 시각 |
| 스탬프 목록 | `src/data/stamps.json` | 스탬프 이름·받는 방법 (읽기 전용 JSON) |
| 보관함·상황극/OX 최고 기록·힌트 언어 | 휴대폰 문서 폴더의 `ai-coach-data.json` | 앱이 읽고 쓰는 JSON 파일 |

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
   ├─ i18n/                 모국어 힌트 (번역 사전·툴팁·언어 상태)
   ├─ state/                RolePlayContext(상황극 게임 상태), StampContext(네온 스탬프 보상) — Context API
   ├─ screens/              QuizScreen(퀴즈: OX + 봉투), OXQuizScreen(스피드 OX), EnvelopeGameScreen(봉투 퀴즈), CommunicationScreen(소통 카드: 보여 주는 카드 + 조문 순서), SituationCardScreen(보여 주는 카드), AudioGuideScreen(오디오 가이드), RolePlayScreen(상황극 게임), CardDeckScreen(스와이프 카드), TabScreen(탭 기본 틀), CoachScreen·HistoryScreen(이전 질문 코치 화면, 현재 탭에서 빠짐)
   ├─ services/coach.js     웹앱 규칙 엔진(../src/services)을 그대로 호출
   ├─ storage/              로컬 JSON 저장소와 화면용 훅
   └─ data/                 앱에 포함되는 JSON 파일
```

## 디자인 규칙

- 색은 `src/theme/colors.js`에서만 정한다. 여기만 바꾸면 앱 전체 색이 바뀐다.
- 50대 이상 사용자를 위해 기본 글자 18, 버튼 높이 56 이상으로 크게 잡았다.
- 네온은 포인트로만 쓰고, 본문 글자는 밝은 흰색으로 읽기 쉽게 유지한다.
