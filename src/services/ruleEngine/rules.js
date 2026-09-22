import { STATUS } from '../criteria.js'

/**
 * 기준별 판정 규칙.
 * - strong: 하나라도 맞으면 '충분'
 * - weak: 맞으면 '조금 부족' (weakCountForGood 이상 맞으면 '충분')
 * 규칙만 바꾸면 판정이 바뀌도록 데이터로 분리해 두었다.
 */
export const RULES = {
  purpose: {
    strong: [/(줘|주세요|줄래|주실래요|주시겠|주시면|부탁)/],
    weak: [/\?/, /(어떻게|무엇|뭐|뭘|방법|할까|인가요|나요|까요|싶어|싶습니다)/],
  },
  situation: {
    strong: [],
    weak: [
      /(저는|나는|제가|내가|우리)/,
      /\d{1,2}\s*(대|세|살)/,
      /(현재|지금|요즘|최근|다음 ?주|이번)/,
      /(때문에|라서|이라|인데|는데|중이|하고 있|려고)/,
      /(운영|일하|근무|가르치|준비|시작|은퇴|퇴직)/,
    ],
    weakCountForGood: 2,
  },
  audience: {
    strong: [
      /(에게|한테|대상으로|대상은|읽을 사람|들을 사람|볼 사람|독자|청중)/,
      /(수강생|학생|고객|친구|손님|어르신|부모님|자녀|아이|팔로워|구독자|이웃|초보|시니어|회원|직원|동료|주민).{0,3}(위한|위해|용)/,
    ],
    weak: [
      /(수강생|학생|고객|친구|손님|어르신|부모님|자녀|아이들|팔로워|구독자|이웃|초보|시니어|회원|직원|동료|주민)/,
      /(위한|위해)/,
    ],
  },
  role: {
    strong: [/(처럼|으로서|로서|입장에서|역할|관점에서|라고 생각하고)/],
    weak: [/(전문가|강사|선생님|작가|컨설턴트|마케터|기자|의사|코치|상담사|편집자|카피라이터|교수|디자이너)/],
  },
  format: {
    strong: [
      /\d+\s*(가지|개|줄|자|글자|문단|단계|쪽|장|문장|항목|편|분 ?분량)/,
      /(표로|표 형식|목록|번호|개조식|글머리|체크리스트|단락|이내|제목)/,
      /(한|두|세|네|다섯) ?(가지|줄|문단|문장|단계)/,
    ],
    weak: [/(짧게|길게|간단히|간단하게|자세히|자세하게|간략|짧은|긴 글|요약)/],
  },
  tone: {
    strong: [/(말투|어조|톤|문체|느낌으로|분위기로|스타일로|존댓말|반말|높임말)/],
    weak: [
      /(친근|따뜻|정중|유머|재미있|재밌|부드럽|격식|전문적|진지|밝게|밝은|감성|편안)/,
      /(쉽게|쉬운|쉽고)/,
    ],
    weakCountForGood: 2,
  },
}

/** 한 기준의 판정 결과를 돌려준다. */
export function judge(rule, text) {
  if (rule.strong.some((re) => re.test(text))) return STATUS.GOOD
  const weakHits = rule.weak.filter((re) => re.test(text)).length
  if (rule.weakCountForGood && weakHits >= rule.weakCountForGood) return STATUS.GOOD
  if (weakHits > 0) return STATUS.PARTIAL
  return STATUS.MISSING
}
