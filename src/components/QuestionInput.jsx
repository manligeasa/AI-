import Button from './Button.jsx'

const EXAMPLES = ['블로그 글 써줘', '강의 자료 만들어줘', '건강에 좋은 운동 알려줘']

export default function QuestionInput({ value, onChange, onSubmit, loading, error, canSubmit }) {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold sm:text-3xl">AI에게 하고 싶은 질문을 그냥 적어 보세요</h2>
        <p className="text-stone-600">짧게 적어도 괜찮아요. 어디를 더 채우면 좋은지 알려 드릴게요.</p>
      </div>

      <label htmlFor="question" className="sr-only">질문</label>
      <textarea
        id="question"
        rows={5}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="예) 우리 동네 빵집 홍보 글 써줘"
        className="w-full resize-y rounded-2xl border-2 border-stone-300 bg-white p-5 text-xl leading-relaxed placeholder:text-stone-400 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100"
      />

      <div className="space-y-3">
        <p className="font-semibold text-stone-600">이런 질문으로 연습해 볼 수도 있어요</p>
        <div className="flex flex-wrap gap-3">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => onChange(ex)}
              className="min-h-12 rounded-full border-2 border-orange-200 bg-white px-5 text-lg text-orange-900 hover:bg-orange-50"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-lg text-red-800">{error}</p>}

      <Button onClick={onSubmit} disabled={!canSubmit || loading} className="w-full">
        {loading ? '살펴보는 중…' : '평가받기'}
      </Button>
    </section>
  )
}
