import { useEffect, useState } from 'react'
import { advanceTime } from './clock'
import { DURATION } from './types'

export function useExperimentClock(initialTime = 0, duration = DURATION) {
  const [time, setTime] = useState(initialTime)
  const [playing, setPlaying] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const running = playing && time < duration && !reducedMotion

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => { setReducedMotion(query.matches); if (query.matches) setPlaying(false) }
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!running) return
    let frame: number
    let previous: number | undefined
    const tick = (timestamp: number) => {
      if (previous !== undefined) {
        const elapsed = timestamp - previous
        setTime((current) => Math.min(duration, advanceTime(current, elapsed)))
      }
      previous = timestamp
      frame = requestAnimationFrame(tick)
    }
    const pauseWhenHidden = () => {
      if (document.hidden) setPlaying(false)
    }
    frame = requestAnimationFrame(tick)
    document.addEventListener('visibilitychange', pauseWhenHidden)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('visibilitychange', pauseWhenHidden)
    }
  }, [running, duration])

  return {
    time,
    running,
    reducedMotion,
    toggle: () => {
      if (reducedMotion) return
      if (time >= duration) {
        setTime(0)
        setPlaying(true)
      } else {
        setPlaying((current) => !current)
      }
    },
    seek: (next: number) => {
      setPlaying(false)
      setTime(Math.min(duration, Math.max(0, next)))
    },
    reset: () => {
      setPlaying(false)
      setTime(0)
    },
  }
}
