const STEPS = ['질문 입력', '평가 결과', '좋은 질문']

export default function StepIndicator({ current }) {
  return (
    <ol className="flex items-center justify-center gap-2 text-base sm:gap-4" aria-label="진행 단계">
      {STEPS.map((label, i) => {
        const step = i + 1
        const active = step === current
        const done = step < current
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              aria-current={active ? 'step' : undefined}
              className={`flex h-9 w-9 items-center justify-center rounded-full font-bold ${
                active ? 'bg-orange-600 text-white' : done ? 'bg-orange-200 text-orange-900' : 'bg-stone-200 text-stone-500'
              }`}
            >
              {step}
            </span>
            <span className={active ? 'font-bold text-stone-900' : 'text-stone-500'}>{label}</span>
            {step < STEPS.length && <span className="hidden text-stone-300 sm:inline" aria-hidden>—</span>}
          </li>
        )
      })}
    </ol>
  )
}
