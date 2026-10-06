import { Accordion, Button, Paper } from '@mantine/core'
import { useState } from 'react'
import ParameterSlider from '../shared/parameter-slider'
import Simulation from '../shared/simulation'
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
        <h3>加速度と出発時の条件を変える</h3>
        <p>青い点と灰色の輪は、同じ場所から同じ速度で出発します。青い点の加速度だけを変えて、速度と位置の差を見られます。</p>
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
          加速度が負のとき、速度の値は時間とともに減ります。正の間は右へ進み、0を通って負になると左へ進みます。
        </p>
        <Accordion variant="separated" my="lg">
          <Accordion.Item value="initial">
            <Accordion.Control>出発時の速度と位置も変える</Accordion.Control>
            <Accordion.Panel>
              <ParameterSlider
                label="出発時の速度"
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
                label="出発時の位置"
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
          条件を変えると、物体の時間は0秒に戻って停止します。比較側も同じ出発時の位置と速度にそろい、加速度だけ0のままです。
        </p>
      </aside>
    </Paper>
  )
}
