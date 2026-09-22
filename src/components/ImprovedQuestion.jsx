import Button from './Button.jsx'
import { useCopyToClipboard } from '../hooks/useCopyToClipboard.js'

const COPY_LABEL = {
  idle: '📋 개선 질문 복사',
  copied: '✅ 복사 완료',
  failed: '다시 눌러 주세요',
}

export default function ImprovedQuestion({ question, improvement, onBack, onRewrite }) {
  const { status, copy } = useCopyToClipboard(2000)
  const nothingAdded = improvement.reasons.length === 0

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="font-semibold text-stone-500">원래 질문</p>
        <p className="rounded-2xl bg-stone-100 p-5 text-lg text-stone-600">{question}</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <p className="font-semibold text-orange-800">개선된 질문</p>
          <button
            type="button"
            onClick={() => copy(improvement.text)}
            className={`min-h-12 shrink-0 rounded-xl px-4 text-lg font-bold text-white transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 ${
              status === 'copied' ? 'bg-green-600' : 'bg-orange-600 hover:bg-orange-700'
            }`}
          >
            {COPY_LABEL[status]}
          </button>
        </div>
        <p className="whitespace-pre-line rounded-2xl border-2 border-orange-300 bg-white p-5 text-xl leading-loose">
          {improvement.segments.map((s, i) =>
            s.added ? <mark key={i} className="rounded bg-yellow-200 px-0.5 text-stone-900">{s.text}</mark> : <span key={i}>{s.text}</span>,
          )}
        </p>
        <p role="status" aria-live="polite" className="min-h-7 text-lg font-semibold">
          {status === 'copied' && <span className="text-green-700">복사 완료! AI 채팅창에 붙여 넣어 사용하세요.</span>}
          {status === 'failed' && <span className="text-red-700">복사하지 못했어요. 글을 길게 눌러 직접 복사해 주세요.</span>}
        </p>
        {!nothingAdded && (
          <p className="text-base text-stone-600">
            <mark className="rounded bg-yellow-200 px-1">노란색</mark> 부분이 새로 더해진 부분이에요. 내 상황에 맞게 고쳐 써도 좋아요.
          </p>
        )}
      </div>

      <div className="space-y-3 rounded-2xl bg-white p-5">
        <h3 className="text-xl font-bold">왜 더 좋아졌나요?</h3>
        {nothingAdded ? (
          <p className="text-lg">빠진 기준이 없어 그대로도 좋은 질문이에요.</p>
        ) : (
          <ul className="list-inside list-disc space-y-1 text-lg">
            {improvement.reasons.map((r) => <li key={r}>{r}</li>)}
          </ul>
        )}
        {improvement.tip && <p className="text-lg text-amber-800">💡 {improvement.tip}</p>}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row-reverse">
        <Button onClick={onRewrite} className="flex-1">✏️ 다시 작성하기</Button>
        <Button variant="secondary" onClick={onBack} className="sm:w-40">뒤로</Button>
      </div>
    </section>
  )
}
