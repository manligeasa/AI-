export default function StarRating({ stars, max = 5 }) {
  return (
    <p className="text-4xl tracking-wider" aria-label={`별 ${max}개 중 ${stars}개`}>
      <span className="text-amber-500">{'★'.repeat(stars)}</span>
      <span className="text-stone-300">{'★'.repeat(max - stars)}</span>
    </p>
  )
}
