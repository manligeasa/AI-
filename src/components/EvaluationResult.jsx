import Button from './Button.jsx'
import StarRating from './StarRating.jsx'
import CriterionCard from './CriterionCard.jsx'

export default function EvaluationResult({ question, evaluation, onNext, onBack }) {
  return (
    <section className="space-y-6">
      <div className="space-y-3 rounded-3xl bg-white p-6 text-center shadow-sm">
        <p className="text-stone-500">내 질문</p>
        <p className="text-xl font-semibold">“{question}”</p>
        <StarRating stars={evaluation.stars} />
        <p className="text-xl font-bold leading-relaxed text-orange-900">{evaluation.summary}</p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {evaluation.criteria.map((c, i) => (
          <CriterionCard key={c.id} criterion={c} index={i} />
        ))}
      </ul>

      <div className="flex flex-col gap-3 sm:flex-row-reverse">
        <Button onClick={onNext} className="flex-1">더 좋은 질문 보기</Button>
        <Button variant="secondary" onClick={onBack} className="sm:w-40">뒤로</Button>
      </div>
    </section>
  )
}
