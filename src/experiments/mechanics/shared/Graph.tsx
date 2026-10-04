import { useId } from 'react'
import { DURATION } from './types'
import type { Trajectory } from './types'

export default function Graph({
  current,
  reference,
  time,
  compare,
  quantity,
}: {
  current: Trajectory
  reference: Trajectory
  time: number
  compare: boolean
  quantity: 'position' | 'velocity'
}) {
  const titleId = useId()
  const descriptionId = useId()
  const sample = (trajectory: Trajectory) =>
    Array.from({ length: 101 }, (_, i) => ({
      time: (i * DURATION) / 100,
      value: trajectory.observe((i * DURATION) / 100)[quantity],
    }))
  const currentPoints = sample(current)
  const referencePoints = sample(reference)
  const values = [...currentPoints, ...(compare ? referencePoints : [])].map((point) => point.value)
  const minValue = Math.min(0, ...values)
  const maxValue = Math.max(0, ...values)
  const padding = Math.max((maxValue - minValue) * 0.12, 1)
  const min = minValue - padding
  const max = maxValue + padding
  const x = (t: number) => 56 + (t / DURATION) * 476
  const y = (v: number) => 186 - ((v - min) / (max - min)) * 152
  const path = (points: typeof currentPoints) =>
    points
      .map((point, index) => `${index === 0 ? 'M' : 'L'}${x(point.time)},${y(point.value)}`)
      .join(' ')
  const unit = quantity === 'position' ? 'm' : 'm/s'
  const label = quantity === 'position' ? '位置 x' : '速度 v'

  return (
    <svg
      className="graph"
      viewBox="0 0 560 228"
      role="img"
      aria-labelledby={`${titleId} ${descriptionId}`}
    >
      <title id={titleId}>{`${label}と時間のグラフ`}</title>
      <desc id={descriptionId}>
        横軸は時間（秒）、縦軸は{label}（{unit}
        ）。青の実線が現在の条件。{compare && '灰色の破線が比較条件。'}線全体は0〜10秒の式の計算値、縦線と青い点は選んだ時刻です。二つの条件は同じ縮尺で表示します。
      </desc>
      <text x="10" y="16" className="axis-title">
        {label} [{unit}]
      </text>
      {Array.from({ length: 5 }, (_, i) => {
        const value = min + ((max - min) * i) / 4
        return (
          <g key={i}>
            <line x1="56" x2="532" y1={y(value)} y2={y(value)} className="grid-line" />
            <text x="48" y={y(value) + 4} textAnchor="end">
              {value.toFixed(1)}
            </text>
          </g>
        )
      })}
      {[0, 2, 4, 6, 8, 10].map((t) => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1="34" y2="186" className="grid-line" />
          <text x={x(t)} y="206" textAnchor="middle">
            {t}
          </text>
        </g>
      ))}
      <line x1="56" x2="532" y1={y(0)} y2={y(0)} className="zero-line" />
      {compare && <path d={path(referencePoints)} className="reference-path" />}
      <path d={path(currentPoints)} className="current-path" />
      <line x1={x(time)} x2={x(time)} y1="34" y2="186" className="time-line" />
      <circle cx={x(time)} cy={y(current.observe(time)[quantity])} r="5" fill="#2563eb" />
      <text x="532" y="224" textAnchor="end" className="axis-title">
        時間 t [s]
      </text>
    </svg>
  )
}
