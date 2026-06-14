import { useEffect } from 'react'

// Keep the screen awake while a tracked workout is open (P2 nice-to-have).
// Falls back silently where the Wake Lock API is unavailable (e.g. older iOS).
export function useWakeLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    let sentinel: WakeLockSentinel | null = null
    let cancelled = false

    const request = async () => {
      try {
        if ('wakeLock' in navigator) {
          sentinel = await navigator.wakeLock.request('screen')
        }
      } catch {
        /* user agent denied or unsupported — ignore */
      }
    }

    const onVisible = () => {
      if (document.visibilityState === 'visible' && !cancelled) request()
    }

    request()
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisible)
      sentinel?.release().catch(() => {})
    }
  }, [active])
}
