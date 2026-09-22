import { useRef } from 'react'
import Button from './Button.jsx'
import { EXAMPLE_QUESTIONS } from '../data/exampleQuestions.js'

export default function QuestionInput({ value, onChange, onClear, onSubmit, loading, error, canSubmit }) {
  const textareaRef = useRef(null)

  const handleClear = () => {
    onClear()
    textareaRef.current?.focus()
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold sm:text-3xl">AI에게 하고 싶은 질문을 그냥 적어 보세요</h2>
        <p className="text-stone-600">짧게 적어도 괜찮아요. 어디를 더 채우면 좋은지 알려 드릴게요.</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="question" className="sr-only">질문</label>
        <textarea
          ref={textareaRef}
          id="question"
          rows={5}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="예) 우리 동네 빵집 홍보 글 써줘"
          className="w-full resize-y rounded-2xl border-2 border-stone-300 bg-white p-5 text-xl leading-relaxed placeholder:text-stone-400 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100"
        />
        <div className="flex justify-end">
          <Button variant="secondary" onClick={handleClear} disabled={!value}>
            🗑️ 입력 내용 지우기
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <p className="font-semibold text-stone-600">예시 질문을 눌러 바로 연습해 보세요</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {EXAMPLE_QUESTIONS.map((ex) => {
            const selected = value === ex.question
            return (
              <button
                key={ex.label}
                type="button"
                onClick={() => onChange(ex.question)}
                aria-pressed={selected}
                className={`flex min-h-20 flex-col items-center justify-center gap-1 rounded-2xl border-2 px-3 py-3 text-center text-lg font-semibold leading-snug transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 ${
                  selected
                    ? 'border-orange-500 bg-orange-100 text-orange-900'
                    : 'border-orange-200 bg-white text-stone-800 hover:bg-orange-50'
                }`}
              >
                <span className="text-2xl" aria-hidden>{ex.icon}</span>
                {ex.label}
              </button>
            )
          })}
        </div>
      </div>

      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-lg text-red-800">{error}</p>}

      <Button onClick={onSubmit} disabled={!canSubmit || loading} className="w-full">
        {loading ? '살펴보는 중…' : '평가받기'}
      </Button>
    </section>
  )
}
