import { STATUS } from '../services/criteria.js'

/** 수준별 색 */
const LEVEL_STYLE = {
  '기초': { badge: 'bg-red-100 text-red-800', bar: 'bg-red-500' },
  '보통': { badge: 'bg-amber-100 text-amber-900', bar: 'bg-amber-500' },
  '좋음': { badge: 'bg-green-100 text-green-800', bar: 'bg-green-600' },
  '매우 좋음': { badge: 'bg-blue-100 text-blue-800', bar: 'bg-blue-600' },
}

export default function ScoreCard({ question, evaluation }) {
  const { score, level, criteria } = evaluation
  const style = LEVEL_STYLE[level] ?? LEVEL_STYLE['보통']

  return (
    <div className="space-y-5 rounded-3xl bg-white p-6 shadow-sm">
      <p className="text-center text-lg text-stone-600">“{question}”</p>

      <div className="flex flex-wrap items-end justify-center gap-x-8 gap-y-3">
        <div className="text-center">
          <p className="text-base font-semibold text-stone-500">질문 점수</p>
          <p className="font-extrabold text-stone-900">
            <span className="text-6xl">{score}</span>
            <span className="text-2xl text-stone-500">점 / 100점</span>
          </p>
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-stone-500">현재 수준</p>
          <p className={`mt-1 rounded-full px-5 py-2 text-2xl font-bold ${style.badge}`}>{level}</p>
        </div>
      </div>

      <div
        className="h-4 overflow-hidden rounded-full bg-stone-200"
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="질문 점수"
      >
        <div className={`h-full rounded-full ${style.bar}`} style={{ width: `${score}%` }} />
      </div>

      <ul className="flex flex-wrap justify-center gap-2" aria-label="항목별 점검">
        {criteria.map((c) => {
          const ok = c.status === STATUS.GOOD
          return (
            <li
              key={c.id}
              className={`rounded-full px-4 py-1.5 text-base font-semibold ${
                ok ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-500'
              }`}
            >
              {ok ? '✓' : '✕'} {c.label}
              <span className="sr-only">{ok ? ' 충족' : ' 부족'}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
