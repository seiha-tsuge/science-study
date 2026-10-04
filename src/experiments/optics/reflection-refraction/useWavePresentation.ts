import { useEffect, useState } from 'react'
import { advanceWavePresentation, WAVE_PRESENTATION_DURATION } from './model'

export function useWavePresentation() {
  const [time, setTime] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const running = playing && time < WAVE_PRESENTATION_DURATION && !reducedMotion

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
        const elapsed = timestamp - previous
        setTime(current => advanceWavePresentation(current, elapsed))
      }
      previous = timestamp
      frame = requestAnimationFrame(tick)
    }
    const pause = () => { if (document.hidden) setPlaying(false) }
    frame = requestAnimationFrame(tick)
    document.addEventListener('visibilitychange', pause)
    return () => { cancelAnimationFrame(frame); document.removeEventListener('visibilitychange', pause) }
  }, [running])

  const seek = (next: number) => { setPlaying(false); setTime(next) }
  return {
    time, running, reducedMotion, seek,
    reset: () => seek(0),
    toggle: () => { if (time >= WAVE_PRESENTATION_DURATION) setTime(0); setPlaying(!running) },
  }
}
