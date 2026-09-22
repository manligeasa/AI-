import Button from './Button.jsx'
import ScoreCard from './ScoreCard.jsx'
import FeedbackCard from './FeedbackCard.jsx'

export default function EvaluationResult({ question, evaluation, onNext, onBack }) {
  return (
    <section className="space-y-5">
      <ScoreCard question={question} evaluation={evaluation} />

      <FeedbackCard
        tone="good"
        icon="👍"
        title="좋은 점"
        items={evaluation.strengths}
        emptyText="아직 없어요. 아래 개선 방향을 하나씩 더해 보세요."
      />
      <FeedbackCard
        tone="warn"
        icon="✏️"
        title="보완할 점"
        items={evaluation.weaknesses}
        emptyText="보완할 점이 없습니다. 훌륭한 질문이에요!"
      />
      <FeedbackCard
        tone="guide"
        icon="🧭"
        title="개선 방향"
        items={evaluation.directions}
        emptyText="지금 그대로 사용해도 좋습니다."
      />

      <div className="flex flex-col gap-3 sm:flex-row-reverse">
        <Button onClick={onNext} className="flex-1">더 좋은 질문 보기</Button>
        <Button variant="secondary" onClick={onBack} className="sm:w-40">뒤로</Button>
      </div>
    </section>
  )
}
