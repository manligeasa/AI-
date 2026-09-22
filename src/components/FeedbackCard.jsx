const TONES = {
  good: { card: 'border-green-500', title: 'text-green-800', dot: 'text-green-600' },
  warn: { card: 'border-red-400', title: 'text-red-800', dot: 'text-red-500' },
  guide: { card: 'border-blue-500', title: 'text-blue-800', dot: 'text-blue-600' },
}

/** 좋은 점 / 보완할 점 / 개선 방향을 보여 주는 카드 */
export default function FeedbackCard({ icon, title, items, emptyText, tone }) {
  const style = TONES[tone]
  return (
    <section className={`rounded-2xl border-l-8 bg-white p-5 shadow-sm ${style.card}`}>
      <h3 className={`mb-3 flex items-center gap-2 text-xl font-bold ${style.title}`}>
        <span aria-hidden>{icon}</span>
        {title}
        {items.length > 0 && <span className="text-base font-semibold text-stone-500">{items.length}개</span>}
      </h3>
      {items.length === 0 ? (
        <p className="text-lg text-stone-600">{emptyText}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item} className="flex gap-2 text-lg leading-relaxed">
              <span className={`font-bold ${style.dot}`} aria-hidden>•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
