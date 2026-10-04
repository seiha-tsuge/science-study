import { useEffect, useState } from 'react'
import { advanceTime } from './clock'
import { DURATION } from './types'

export function useExperimentClock() {
  const [time, setTime] = useState(0)
  const [playing, setPlaying] = useState(false)
  const running = playing && time < DURATION

  useEffect(() => {
    if (!running) return
    let frame: number
    let previous: number | undefined
    const tick = (timestamp: number) => {
      if (previous !== undefined) {
        const elapsed = timestamp - previous
        setTime((current) => advanceTime(current, elapsed))
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
  }, [running])

  return {
    time,
    running,
    toggle: () => {
      if (time >= DURATION) {
        setTime(0)
        setPlaying(true)
      } else {
        setPlaying((current) => !current)
      }
    },
    seek: (next: number) => {
      setPlaying(false)
      setTime(next)
    },
    reset: () => {
      setPlaying(false)
      setTime(0)
    },
  }
}
