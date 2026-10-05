import { Anchor, Text, Title } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import Lesson from '../../../components/lesson'
import MotionSimulation from './simulation'
import ExplanationAnimation from './explanation-animation'
import { motionLesson } from './meta'

export default function MotionLessonPage() {
  return (
    <Lesson
      lesson={motionLesson}
      number="01"
      mechanism={
        <>
          <Title order={3}>同じ変化を積み重ねると、直線になる</Title>
          <Text mb="lg">道の上の1秒ごとの印を見ます。グラフでは、その時刻を横の位置、道の上の位置を縦の高さにします。毎秒同じ量ずつ高くなるため、点は一直線に並びます。</Text>
          <ExplanationAnimation />
          <Text mt="lg">ここでは速度を一定と決め、その条件から位置とグラフの形を説明しています。押す力が速度を変える理由は、今後の「力と運動」で扱う関係です。</Text>
        </>
      }
      simulation={<MotionSimulation />}
      next={
        <Anchor component={Link} to="/mechanics/acceleration">
          次の問い：加速度 →
        </Anchor>
      }
      explanation={
        <>
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
            この図の速度5 m/sでは、時間が1秒増えるごとに位置が5 m増えます。「縦の位置の増加÷横の時間の増加」がグラフの傾きで、5 m/sになります。
          </Text>
          <Text mt="sm">速度を2倍にすると、同じ時間の変位 x − x₀ も2倍になります。出発点 x₀ は足したままなので、位置 x そのものが2倍になるとは限りません。</Text>
          <Title order={3}>負の速度は、反対向きの運動</Title>
          <Text>
            右向きを正と決めたので、負の速度では左へ進み、時間が増えると位置の値は減ります。グラフは右下がりになります。速度−5 m/sの速さは5 m/sです。「速さ」は向きを含めず、速度の符号を外した大きさを表します。
          </Text>
          <Title order={3}>このモデルの前提</Title>
          <Text>
            一直線上で、速度は0〜10秒の間ずっと一定です。物体は一つの点として描きます。図と数値は式から計算したもので、実測値ではありません。物体の大きさ、衝突、力によって速度が変わる過程は、このモデルの範囲外です。
          </Text>
        </>
      }
    />
  )
}
