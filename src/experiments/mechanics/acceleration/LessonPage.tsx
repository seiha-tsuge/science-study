import { Anchor, Text, Title } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import Lesson from '../../../components/Lesson'
import AccelerationSimulation from './Simulation'
import AccumulationDiagram from './AccumulationDiagram'
import { accelerationLesson } from './meta'

export default function AccelerationLessonPage() {
  return (
    <Lesson
      lesson={accelerationLesson}
      number="02"
      mechanism={<AccumulationDiagram />}
      simulation={<AccelerationSimulation />}
      next={
        <Anchor component={Link} to="/mechanics">
          力学の地図に戻る →
        </Anchor>
      }
      explanation={
        <>
          <div className="formula">
            v = v₀ + at
            <br />x = x₀ + v₀t + ½at²
          </div>
          <dl className="formula-symbols">
            <div>
              <dt>x・x₀ [m]</dt>
              <dd>今の位置・出発時の位置</dd>
            </div>
            <div>
              <dt>v・v₀ [m/s]</dt>
              <dd>今の速度・開始時の速度（初速度）</dd>
            </div>
            <div>
              <dt>a [m/s²]</dt>
              <dd>一定の加速度</dd>
            </div>
            <div>
              <dt>t [s]</dt>
              <dd>開始からの時間</dd>
            </div>
          </dl>
          <Title order={3}>二乗と½は、三角形の形から現れる</Title>
          <Text>図の青い長方形は、開始時の速度 v₀ が時間 t だけ続く分です。面積 v₀t は、その分の変位を表します。緑の三角形は、加速度で増えた速度の分です。底辺が時間 t、高さが速度の増加 at なので、面積は t × at ÷ 2 = ½at² になります。</Text>
          <Text mt="sm">時間を2倍にすると、三角形の底辺も高さも2倍になります。その積は4倍になるので、時間の二乗が現れます。二つの面積を足した変位に出発時の位置 x₀ を足すと、今の位置 x です。速度が0より下の領域は、左へ進む分として面積を引きます。</Text>
          <Title order={3}>加速度は、速度の変わる割合</Title>
          <Text>
            開始時の速度が5 m/s、加速度が1 m/s²なら、1秒後は6 m/s、2秒後は7 m/sです。速度の増加 Δv を、経過した時間 Δt で割ると、加速度 a = Δv / Δt になります。Δは「差」を表す記号です。
          </Text>
          <Title order={3}>負の加速度は、いつも減速という意味？</Title>
          <Text>
            右向きを正と決めたこの図では、速度が正で加速度が負なら、右へ進む速さが小さくなります。速度0を過ぎても負の加速度が続くと、速度は負になり、左へ進む速さが大きくなります。速さは速度の符号を外した大きさなので、加速度の符号だけでは増速と減速を区別できません。
          </Text>
          <Title order={3}>このモデルの前提</Title>
          <Text>
            一直線上で、加速度が時間によらず一定の運動を扱います。図と数値は式を各時刻で計算したもので、実測値ではありません。加速度を決める力の内訳や衝突、途中で加速度が変わる運動は、このモデルの範囲外です。
          </Text>
        </>
      }
    />
  )
}
