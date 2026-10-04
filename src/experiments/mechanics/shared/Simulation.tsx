import { useState } from 'react'
import Graph from './Graph'
import MotionCanvas from './MotionCanvas'
import { useExperimentClock } from './useExperimentClock'
import type { Trajectory } from './types'
import { DURATION } from './types'

export default function Simulation({
  current,
  reference,
}: {
  current: Trajectory
  reference: Trajectory
}) {
  const clock = useExperimentClock()
  const [compare, setCompare] = useState(true)
  const [quantity, setQuantity] = useState<'position' | 'velocity'>('position')
  const observation = current.observe(clock.time)
  const referenceObservation = reference.observe(clock.time)
  return (
    <div className="simulation">
      <div className="simulation-title">
        <span className="live-dot" /> 一次元の運動 <span className="tag">解析式の可視化</span>
      </div>
      <MotionCanvas frame={{ current, reference, time: clock.time, compare }} />
      <div className="playback">
        <button type="button" className="primary-button" onClick={clock.toggle}>
          {clock.running ? 'Ⅱ 一時停止' : clock.time >= DURATION ? '▶ もう一度再生' : '▶ 再生'}
        </button>
        <button type="button" className="secondary-button" onClick={clock.reset}>
          ↺ 初期化
        </button>
        <output className="time-output">
          {clock.time.toFixed(1)} <small>/ {DURATION} s</small>
        </output>
      </div>
      <label className="time-slider">
        時間を動かす
        <input
          type="range"
          min="0"
          max={DURATION}
          step="0.1"
          value={clock.time}
          aria-label="時間"
          aria-valuetext={`${clock.time.toFixed(1)} 秒`}
          onChange={(event) => clock.seek(Number(event.target.value))}
        />
      </label>
      <div className="graph-toolbar">
        <div className="segmented" aria-label="グラフの種類">
          <button
            type="button"
            aria-pressed={quantity === 'position'}
            onClick={() => setQuantity('position')}
          >
            位置と時間
          </button>
          <button
            type="button"
            aria-pressed={quantity === 'velocity'}
            onClick={() => setQuantity('velocity')}
          >
            速度と時間
          </button>
        </div>
        <label className="compare-toggle">
          <input
            type="checkbox"
            checked={compare}
            onChange={(event) => setCompare(event.target.checked)}
          />
          比較を表示
        </label>
      </div>
      <Graph
        current={current}
        reference={reference}
        time={clock.time}
        compare={compare}
        quantity={quantity}
      />
      <div className="legend">
        <span>
          <i className="blue-line" />
          {current.label}
        </span>
        {compare && (
          <span>
            <i className="gray-line" />
            {reference.label}
          </span>
        )}
      </div>
      <table className="measurement-table">
        <caption>時刻 {clock.time.toFixed(1)} s の計算値</caption>
        <thead>
          <tr>
            <th scope="col">条件</th>
            <th scope="col">位置 [m]</th>
            <th scope="col">速度 [m/s]</th>
            <th scope="col">加速度 [m/s²]</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">現在</th>
            <td>{observation.position.toFixed(2)}</td>
            <td>{observation.velocity.toFixed(2)}</td>
            <td>{observation.acceleration.toFixed(2)}</td>
          </tr>
          {compare && (
            <tr>
              <th scope="row">比較</th>
              <td>{referenceObservation.position.toFixed(2)}</td>
              <td>{referenceObservation.velocity.toFixed(2)}</td>
              <td>{referenceObservation.acceleration.toFixed(2)}</td>
            </tr>
          )}
        </tbody>
      </table>
      <p className="visual-note">
        青い点が物体、矢印は速度の向き（長さは速さを表しません）。位置は画面に合わせて縮尺を調整しています。グラフは0〜10秒の式の値で、実測データではありません。
      </p>
    </div>
  )
}
