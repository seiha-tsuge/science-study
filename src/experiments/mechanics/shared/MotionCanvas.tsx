import { useEffect, useRef, useState } from 'react'
import type p5 from 'p5'
import { createSketch } from './sketch'
import type { DrawingFrame } from './sketch'

export default function MotionCanvas({ frame }: { frame: DrawingFrame }) {
  const host = useRef<HTMLDivElement>(null)
  const drawingFrame = useRef(frame)
  const instance = useRef<p5 | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    drawingFrame.current = frame
    instance.current?.redraw()
  }, [frame])

  useEffect(() => {
    const element = host.current
    if (!element) return
    let disposed = false
    let observer: ResizeObserver | undefined
    import('p5')
      .then(({ default: P5 }) => {
        if (disposed) return
        const getWidth = () => Math.max(240, element.clientWidth)
        const sketch = new P5(
          createSketch(() => drawingFrame.current, getWidth),
          element,
        )
        instance.current = sketch
        observer = new ResizeObserver(() => {
          sketch.resizeCanvas(getWidth(), 200)
          sketch.redraw()
        })
        observer.observe(element)
      })
      .catch(() => {
        if (!disposed) setError(true)
      })
    return () => {
      disposed = true
      observer?.disconnect()
      instance.current?.remove()
      instance.current = null
    }
  }, [])

  return (
    <div
      className="motion-canvas"
      ref={host}
      role="img"
      aria-label="一次元の運動。位置と速度の数値は下の表でも確認できます。"
    >
      {error && <p role="alert">描画を読み込めませんでした。グラフと数値で実験を続けられます。</p>}
    </div>
  )
}
