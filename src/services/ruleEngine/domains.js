/**
 * 질문 분야별 추천 문구.
 * 역할·형식·말투는 앱이 제안하고,
 * 상황·대상은 사용자만 아는 정보이므로 [빈칸]과 예시로 남긴다.
 */
export const DOMAINS = [
  {
    id: 'sns',
    match: /(블로그|인스타|페이스북|페북|SNS|sns|게시물|포스팅|유튜브|카페 글|홍보 글|후기)/,
    role: 'SNS 글쓰기 전문가',
    format: '3문단, 500자 이내로',
    tone: '친근하고 따뜻한',
    situationExample: '동네에서 작은 공방을 운영하는 60대',
    audienceExample: '내 페이스북 친구들',
  },
  {
    id: 'lecture',
    match: /(강의|수업|강사|교육|수강생|교안|강좌|워크숍|특강)/,
    role: '경험 많은 교육 전문 강사',
    format: '5단계 목차로',
    tone: '쉽고 차분한',
    situationExample: '복지관에서 스마트폰 활용을 가르치는 강사',
    audienceExample: '스마트폰이 처음인 어르신',
  },
  {
    id: 'work',
    match: /(메일|이메일|보고서|제안서|기획|고객|업무|회의|견적|계약|거래처)/,
    role: '꼼꼼한 업무 비서',
    format: '핵심 3가지를 번호를 붙여',
    tone: '정중하고 간결한',
    situationExample: '혼자 일하는 프리랜서 디자이너',
    audienceExample: '처음 거래하는 고객',
  },
]

export const DEFAULT_DOMAIN = {
  id: 'daily',
  role: '친절한 전문가',
  format: '5가지로 번호를 붙여',
  tone: '쉽고 친절한',
  situationExample: '은퇴 후 새 취미를 찾고 있는 65세',
  audienceExample: '나 자신',
}

export function detectDomain(text) {
  return DOMAINS.find((d) => d.match.test(text)) ?? DEFAULT_DOMAIN
}
