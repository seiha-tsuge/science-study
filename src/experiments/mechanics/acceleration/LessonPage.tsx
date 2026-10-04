import { Link } from '@tanstack/react-router'
import Lesson from '../../../components/Lesson'
import AccelerationSimulation from './Simulation'
import { accelerationLesson } from './meta'

export default function AccelerationLessonPage() {
  return (
    <Lesson
      lesson={accelerationLesson}
      number="02"
      simulation={<AccelerationSimulation />}
      next={<Link to="/mechanics">力学の地図に戻る →</Link>}
      explanation={
        <>
          <div className="formula">
            v = v₀ + at
            <br />x = x₀ + v₀t + ½at²
          </div>
          <dl className="formula-symbols">
            <div>
              <dt>x₀ [m]</dt>
              <dd>初期位置</dd>
            </div>
            <div>
              <dt>v₀ [m/s]</dt>
              <dd>初速度</dd>
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
          <h3>加速度は「速度の変化率」</h3>
          <p>
            a = Δv / Δt。加速度1 m/s²なら、1秒ごとに速度が1 m/s増えます。初速度5 m/s、加速度1
            m/s²では、1秒後6 m/s、2秒後7 m/s。速度のグラフは直線でも、位置のグラフは曲線になります。
          </p>
          <h3>負の加速度は、いつも減速という意味？</h3>
          <p>
            速度が正で加速度が負なら、速さは小さくなります。速度が0になった後も負の加速度が続くと、左向きに動き始め、速さは大きくなります。速度の向きと加速度の向きを組み合わせて考えます。
          </p>
          <h3>このモデルの前提</h3>
          <p>
            一直線上で加速度が時間によらず一定の運動です。摩擦や衝突、加速度が途中で変わる運動は扱いません。解析式を時刻ごとに評価するので、数値積分の刻みによる誤差は生じません。
          </p>
        </>
      }
    />
  )
}
