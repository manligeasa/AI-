/**
 * 질문 분야별로 AI에게 맡길 역할.
 * 역할이 부족한 질문을 고칠 때 사용한다.
 */
export const DOMAINS = [
  {
    id: 'image',
    match: /(이미지|그림|사진 생성|일러스트)/,
    role: '이미지 생성 AI 프롬프트 전문가',
  },
  {
    id: 'app',
    match: /(앱|어플|서비스 아이디어|웹사이트|플랫폼)/,
    role: '서비스 기획 전문가',
  },
  {
    id: 'column',
    match: /(칼럼|기고|에세이|수필|사설)/,
    role: '신문 칼럼니스트',
  },
  {
    id: 'promo',
    match: /(홍보|광고|안내문|전단|모집|행사|대회|축제)/,
    role: '지역 행사 홍보 전문가',
  },
  {
    id: 'video',
    match: /(유튜브|영상|대본|쇼츠|숏폼)/,
    role: '유튜브 콘텐츠 작가',
  },
  {
    id: 'sns',
    match: /(블로그|인스타|페이스북|페북|SNS|sns|게시물|포스팅|카페 글|후기|댓글)/,
    role: 'SNS 글쓰기 전문가',
  },
  {
    id: 'lecture',
    match: /(강의|수업|강사|교육|수강생|교안|강좌|워크숍|특강)/,
    role: '경험 많은 교육 전문 강사',
  },
  {
    id: 'work',
    match: /(메일|이메일|보고서|제안서|기획|고객|업무|회의|견적|계약|거래처)/,
    role: '꼼꼼한 업무 비서',
  },
]

export const DEFAULT_DOMAIN = {
  id: 'daily',
  role: '친절한 전문가',
}

/** 사실 확인과 존중하는 표현이 특히 필요한 주제 */
export const SENSITIVE_TOPIC = /(정치|선거|정당|대통령|국회|종교|이념|진보|보수|시위)/

export function detectDomain(text) {
  return DOMAINS.find((d) => d.match.test(text)) ?? DEFAULT_DOMAIN
}
