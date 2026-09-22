import { useCallback, useEffect, useRef, useState } from 'react'

/** 브라우저가 클립보드 API를 막을 때를 대비한 예전 방식 복사 */
function fallbackCopy(text) {
  const el = document.createElement('textarea')
  el.value = text
  el.setAttribute('readonly', '')
  el.style.position = 'fixed'
  el.style.opacity = '0'
  document.body.appendChild(el)
  el.select()
  const ok = document.execCommand('copy')
  el.remove()
  return ok
}

/**
 * 클립보드 복사 + 결과 메시지를 잠깐 보여 주는 상태.
 * status: 'idle' | 'copied' | 'failed' — duration(ms)이 지나면 'idle'로 돌아간다.
 */
export function useCopyToClipboard(duration = 2000) {
  const [status, setStatus] = useState('idle')
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = useCallback(async (text) => {
    let ok
    try {
      await navigator.clipboard.writeText(text)
      ok = true
    } catch {
      ok = fallbackCopy(text)
    }
    setStatus(ok ? 'copied' : 'failed')
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setStatus('idle'), duration)
  }, [duration])

  return { status, copy }
}
