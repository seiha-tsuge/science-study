import { Anchor, Text, Title } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import Lesson from '../../../components/Lesson'
import MotionSimulation from './Simulation'
import ExplanationAnimation from './ExplanationAnimation'
import { motionLesson } from './meta'

export default function MotionLessonPage() {
  return (
    <Lesson
      lesson={motionLesson}
      number="01"
      simulation={<MotionSimulation />}
      next={
        <Anchor component={Link} to="/mechanics/acceleration">
          次の問い：加速度 →
        </Anchor>
      }
      explanation={
        <>
          <ExplanationAnimation />
          <div
            className="formula"
            aria-label="位置イコール初期位置プラス速度かける時間"
          >
            x = x₀ + vt
          </div>
          <dl className="formula-symbols">
            <div>
              <dt>x [m]</dt>
              <dd>時刻 t の位置</dd>
            </div>
            <div>
              <dt>x₀ [m]</dt>
              <dd>出発点（初期位置）</dd>
            </div>
            <div>
              <dt>v [m/s]</dt>
              <dd>一定の速度</dd>
            </div>
            <div>
              <dt>t [s]</dt>
              <dd>開始からの時間</dd>
            </div>
          </dl>
          <Title order={3}>同じ時間に、同じだけ位置が変わる</Title>
          <Text>
            速度5 m/sなら、1秒ごとに位置が5
            mずつ増えます。グラフの傾きは速度。速度を2倍にすると、同じ時間での変位（x
            −
            x₀）も2倍になります。初期位置が0でないとき、位置そのものが2倍になるわけではありません。
          </Text>
          <Title order={3}>負の速度は、反対向きの運動</Title>
          <Text>
            右向きを正と決めたので、負の速度では左に進み、位置のグラフは右下がりになります。速さは速度の絶対値です。
          </Text>
          <Title order={3}>このモデルの前提</Title>
          <Text>
            一直線上の運動で、速度は0〜10秒の間ずっと一定です。物体の大きさや、衝突、力が運動を変える過程は扱いません。既知の式を可視化しており、数値積分は使っていません。
          </Text>
        </>
      }
    />
  )
}
