import { useEffect, useState } from 'react'

/** Explanation time only. It never represents the propagation time of light. */
export function useImageAnimation(active: boolean, duration: number, initial = duration) {
  const [time, setTime] = useState(initial)
  const [playing, setPlaying] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [previousActive, setPreviousActive] = useState(active)
  if (active !== previousActive) {
    setPreviousActive(active)
    if (!active) setPlaying(false)
  }
  const running = active && playing && !reducedMotion && time < duration
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => { setReducedMotion(query.matches); if (query.matches) setPlaying(false) }
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    if (!running) return
    let frame = 0
    let previous: number | undefined
    const tick = (timestamp: number) => {
      if (previous !== undefined) {
        const elapsed = (timestamp - previous) / 1000
        setTime(current => Math.min(duration, current + elapsed))
      }
      previous = timestamp
      frame = requestAnimationFrame(tick)
    }
    const pause = () => { if (document.hidden) setPlaying(false) }
    frame = requestAnimationFrame(tick)
    document.addEventListener('visibilitychange', pause)
    return () => { cancelAnimationFrame(frame); document.removeEventListener('visibilitychange', pause) }
  }, [running, duration])
  const seek = (next: number) => { setPlaying(false); setTime(Math.min(duration, Math.max(0, next))) }
  return { time, running, reducedMotion, seek,
    toggle: () => { if (time >= duration) setTime(0); setPlaying(!running) },
  }
}
