import { Accordion, Button, Paper } from '@mantine/core'
import { useState } from 'react'
import ParameterSlider from '../shared/ParameterSlider'
import Simulation from '../shared/Simulation'
import { observeAcceleration } from './model'
import type { AccelerationParameters } from './model'

const initial: AccelerationParameters = {
  initialPosition: 0,
  initialVelocity: 5,
  acceleration: 1,
}

export default function AccelerationSimulation() {
  const [parameters, setParameters] = useState(initial)
  return (
    <Paper withBorder className="experiment-grid">
      <Simulation
        key={JSON.stringify(parameters)}
        current={{
          label: `現在：a = ${parameters.acceleration} m/s²`,
          observe: (time) => observeAcceleration(parameters, time),
        }}
        reference={{
          label: `比較：a = 0 m/s²、v₀ = ${parameters.initialVelocity} m/s`,
          observe: (time) =>
            observeAcceleration({ ...parameters, acceleration: 0 }, time),
        }}
      />
      <aside className="controls" aria-label="実験条件">
        <h3>条件を変えてみる</h3>
        <p>初速度をそろえたまま、加速度の違いを観察しましょう。</p>
        <ParameterSlider
          label="加速度"
          symbol="a"
          unit="m/s²"
          min={-2}
          max={2}
          step={0.5}
          value={parameters.acceleration}
          onChange={(acceleration) =>
            setParameters({ ...parameters, acceleration })
          }
        />
        <p className="control-hint">
          加速度が負でも、速度が正なら右へ進みます。速度が0を越えて負になると、向きが変わります。
        </p>
        <Accordion variant="separated" my="lg">
          <Accordion.Item value="initial">
            <Accordion.Control>初期条件も変える</Accordion.Control>
            <Accordion.Panel>
              <ParameterSlider
                label="初速度"
                symbol="v₀"
                unit="m/s"
                min={-10}
                max={10}
                value={parameters.initialVelocity}
                onChange={(initialVelocity) =>
                  setParameters({ ...parameters, initialVelocity })
                }
              />
              <ParameterSlider
                label="初期位置"
                symbol="x₀"
                unit="m"
                min={-20}
                max={20}
                value={parameters.initialPosition}
                onChange={(initialPosition) =>
                  setParameters({ ...parameters, initialPosition })
                }
              />
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
        <Button
          type="button"
          variant="subtle"
          mt="sm"
          onClick={() => setParameters(initial)}
        >
          条件を初期値に戻す
        </Button>
        <p className="control-hint">
          条件を変えると、時間は0秒に戻り、一時停止します。比較側の初期位置・初速度もそろいます。
        </p>
      </aside>
    </Paper>
  )
}
