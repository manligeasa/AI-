import { useState } from 'react'
import Button from './Button.jsx'

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const el = document.createElement('textarea')
    el.value = text
    document.body.appendChild(el)
    el.select()
    const ok = document.execCommand('copy')
    el.remove()
    return ok
  }
}

export default function ImprovedQuestion({ question, improvement, onBack, onRestart }) {
  const [copied, setCopied] = useState(false)
  const nothingAdded = improvement.reasons.length === 0

  const handleCopy = async () => {
    setCopied(await copyText(improvement.text))
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="font-semibold text-stone-500">원래 질문</p>
        <p className="rounded-2xl bg-stone-100 p-5 text-lg text-stone-600">{question}</p>
      </div>

      <div className="space-y-2">
        <p className="font-semibold text-orange-800">더 좋아진 질문</p>
        <p className="rounded-2xl border-2 border-orange-300 bg-white p-5 text-xl leading-loose">
          {improvement.segments.map((s, i) => (
            <span key={i}>
              {i > 0 && ' '}
              {s.added ? <mark className="rounded bg-yellow-200 px-1 text-stone-900">{s.text}</mark> : s.text}
            </span>
          ))}
        </p>
        <p className="text-base text-stone-600">
          <mark className="rounded bg-yellow-200 px-1">노란색</mark> 부분이 새로 더해진 부분이에요.
          {improvement.hasBlanks && ' [ ] 안은 내 상황에 맞게 바꿔 적어 주세요.'}
        </p>
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
        <Button onClick={handleCopy} className="flex-1" aria-live="polite">
          {copied ? '복사했어요! AI 채팅창에 붙여 넣으세요' : '복사하기'}
        </Button>
        <Button variant="secondary" onClick={onBack} className="sm:w-40">뒤로</Button>
        <Button variant="secondary" onClick={onRestart} className="sm:w-44">다시 해보기</Button>
      </div>
    </section>
  )
}
