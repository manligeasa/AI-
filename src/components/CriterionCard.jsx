import { STATUS } from '../services/criteria.js'

const STATUS_STYLE = {
  [STATUS.GOOD]: { text: '충분', badge: 'bg-green-600 text-white', card: 'border-green-200 bg-green-50' },
  [STATUS.PARTIAL]: { text: '조금 부족', badge: 'bg-amber-400 text-amber-950', card: 'border-amber-200 bg-amber-50' },
  [STATUS.MISSING]: { text: '빠짐', badge: 'bg-red-600 text-white', card: 'border-red-200 bg-red-50' },
}

export default function CriterionCard({ criterion, index }) {
  const style = STATUS_STYLE[criterion.status]
  return (
    <li className={`rounded-2xl border-2 p-5 ${style.card}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xl font-bold">
          {index + 1}. {criterion.label}
          <span className="ml-2 text-base font-normal text-stone-600">{criterion.question}</span>
        </h3>
        <span className={`rounded-full px-3 py-1 text-base font-bold ${style.badge}`}>{style.text}</span>
      </div>
      <p className="mt-2 text-lg leading-relaxed">{criterion.message}</p>
    </li>
  )
}
