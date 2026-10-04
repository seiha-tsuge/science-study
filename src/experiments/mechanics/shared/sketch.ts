import type p5 from 'p5'
import type { Trajectory } from './types'
import { DURATION } from './types'

export interface DrawingFrame {
  time: number
  current: Trajectory
  reference: Trajectory
  compare: boolean
}

// ここだけでmをpxに変換する。描画サイズを物理計算に渡さない。
export function createSketch(read: () => DrawingFrame, width: () => number) {
  return (p: p5) => {
    p.setup = () => {
      p.createCanvas(width(), 200)
      p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2))
      p.textFont('system-ui')
      p.noLoop()
    }
    p.draw = () => {
      const frame = read()
      const trajectories = frame.compare ? [frame.current, frame.reference] : [frame.current]
      const values = trajectories.flatMap((trajectory) =>
        Array.from({ length: 101 }, (_, i) => trajectory.observe((i * DURATION) / 100).position),
      )
      const min = Math.min(0, ...values) - 10
      const max = Math.max(0, ...values) + 10
      const toPixel = (position: number) => p.map(position, min, max, 28, p.width - 28)
      p.background('#f5f8fc')
      p.stroke('#d8e1ed')
      p.line(28, 160, p.width - 28, 160)
      p.textSize(11)
      for (let i = 0; i <= 4; i++) {
        const value = min + ((max - min) * i) / 4
        const x = toPixel(value)
        p.stroke('#d8e1ed')
        p.line(x, 155, x, 166)
        p.noStroke()
        p.fill('#53637a')
        p.textAlign(p.CENTER)
        p.text(`${value.toFixed(0)} m`, x, 184)
      }
      p.stroke('#bac8da')
      p.line(toPixel(0), 34, toPixel(0), 160)
      p.noStroke()
      p.fill('#53637a')
      p.textAlign(p.LEFT)
      p.text('右向きが正 →', 16, 22)
      if (frame.compare) {
        const reference = frame.reference.observe(frame.time)
        p.noFill()
        p.stroke('#718096')
        p.strokeWeight(2)
        p.circle(toPixel(reference.position), 124, 20)
        p.strokeWeight(1)
      }
      const current = frame.current.observe(frame.time)
      const x = toPixel(current.position)
      p.noStroke()
      p.fill('#2563eb')
      p.circle(x, 76, 24)
      p.fill('#174593')
      p.textAlign(p.CENTER)
      p.text(`x = ${current.position.toFixed(1)} m`, Math.max(58, Math.min(p.width - 58, x)), 52)
      // 矢印は向きだけを示す。速さを長さに対応させない。
      if (Math.abs(current.velocity) > 0.001) {
        const direction = Math.sign(current.velocity)
        const end = x + direction * 30
        p.stroke('#2563eb')
        p.strokeWeight(2)
        p.line(x + direction * 16, 76, end, 76)
        p.line(end, 76, end - direction * 6, 72)
        p.line(end, 76, end - direction * 6, 80)
        p.strokeWeight(1)
      }
    }
  }
}
