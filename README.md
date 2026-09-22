# AI 질문 코치

AI에게 하는 질문을 **6가지 기준(목적·상황·대상·역할·형식·말투)**으로 평가하고, 더 좋은 질문 예시를 보여 주는 웹앱이다.
대상은 AI 초보자, 50~70대, 프리랜서, 강사, SNS 글쓰기 사용자다.

첫 버전은 AI API 없이 **규칙 기반**(미리 정한 단어·문장 패턴으로 판정)으로 작동한다.

## 실행 방법

```bash
npm install
npm run dev      # 개발 서버 실행 → http://localhost:5173
npm test         # 규칙 판정 테스트
npm run build    # 배포용 파일 만들기 (dist 폴더)
```

## 폴더 구조

```
src/
├─ App.jsx                      화면 흐름(1 입력 → 2 평가 → 3 개선 질문)
├─ components/                  화면 조각(점수 카드, 피드백 카드, 버튼 등)
└─ services/
   ├─ coachService.js           화면이 부르는 유일한 창구 — analyzeQuestion(question)
   ├─ criteria.js               평가 기준 6가지와 안내 문구 (공통)
   ├─ providers/
   │  ├─ ruleBasedProvider.js   규칙 기반 분석 (현재 사용)
   │  └─ openaiProvider.js      OpenAI 분석 자리 (추후 연결)
   └─ ruleEngine/
      ├─ keywordAnalyzer.js     키워드 목록 + analyzeByKeywords(점수·수준·좋은 점·보완할 점·개선 방향)
      ├─ evaluate.js            키워드 분석 결과를 화면용 평가 결과로 변환
      ├─ improve.js             빠진 기준을 채운 개선 질문 만들기
      └─ domains.js             분야별(SNS·강의·업무·일상) 추천 문구
```

화면(components)은 `coachService`만 알고, 분석 방식은 `providers`에서 갈아 끼운다.
어느 방식이든 **같은 모양의 결과**(`{ evaluation, improvement }`)를 돌려주므로 화면 코드는 고치지 않아도 된다.

## OpenAI 연결 방법 (추후)

1. API 키(OpenAI 이용 비밀번호)가 브라우저에 노출되지 않도록 서버 주소 `/api/analyze`를 만들고, 그 안에서 OpenAI를 호출한다.
2. 서버는 `src/services/providers/openaiProvider.js`의 `ANALYSIS_SCHEMA` 모양대로 JSON을 돌려준다.
3. `.env.example`을 `.env`로 복사하고 `VITE_COACH_PROVIDER=openai`로 바꾼다.
