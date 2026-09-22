const VARIANTS = {
  primary: 'bg-orange-600 text-white hover:bg-orange-700 disabled:bg-stone-300 disabled:text-stone-500',
  secondary: 'border-2 border-stone-300 bg-white text-stone-800 hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white',
}

/** 50~70대가 누르기 쉽도록 높이 56px 이상의 큰 버튼 */
export default function Button({ variant = 'primary', className = '', ...props }) {
  return (
    <button
      type="button"
      className={`min-h-14 rounded-2xl px-6 text-lg font-bold transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  )
}
