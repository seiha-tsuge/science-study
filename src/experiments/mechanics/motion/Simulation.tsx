import { useState } from 'react'
import ParameterSlider from '../shared/ParameterSlider'
import Simulation from '../shared/Simulation'
import { observeMotion } from './model'
import type { MotionParameters } from './model'

const initial: MotionParameters = { initialPosition: 0, velocity: 5 }

export default function MotionSimulation() {
  const [parameters, setParameters] = useState(initial)
  const [reference, setReference] = useState(initial)
  return (
    <div className="experiment-grid">
      <Simulation
        key={JSON.stringify(parameters)}
        current={{
          label: `現在：v = ${parameters.velocity} m/s、x₀ = ${parameters.initialPosition} m`,
          observe: (time) => observeMotion(parameters, time),
        }}
        reference={{
          label: `比較：v = ${reference.velocity} m/s、x₀ = ${reference.initialPosition} m`,
          observe: (time) => observeMotion(reference, time),
        }}
      />
      <aside className="controls" aria-label="実験条件">
        <h3>条件を変えてみる</h3>
        <p>まずは速度だけを変えて、違いを観察しましょう。</p>
        <ParameterSlider
          label="速度"
          symbol="v"
          unit="m/s"
          min={-10}
          max={10}
          value={parameters.velocity}
          onChange={(velocity) => setParameters({ ...parameters, velocity })}
        />
        <p className="control-hint">
          正：右向き ／ 負：左向き
          <br />0 m/s なら、その場に止まります。
        </p>
        <details>
          <summary>出発点も変える</summary>
          <ParameterSlider
            label="初期位置"
            symbol="x₀"
            unit="m"
            min={-20}
            max={20}
            value={parameters.initialPosition}
            onChange={(initialPosition) => setParameters({ ...parameters, initialPosition })}
          />
        </details>
        <button
          type="button"
          className="secondary-button full-width"
          onClick={() => setReference({ ...parameters })}
        >
          今の条件を比較基準にする
        </button>
        <button
          type="button"
          className="text-button"
          onClick={() => {
            setParameters(initial)
            setReference(initial)
          }}
        >
          条件を初期値に戻す
        </button>
        <p className="control-hint">
          条件を変えると、時間は0秒に戻り、一時停止します。比較基準は保持されます。
        </p>
      </aside>
    </div>
  )
}
