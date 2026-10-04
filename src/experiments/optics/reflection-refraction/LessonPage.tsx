import { Anchor, Text, Title } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import Lesson from '../../../components/Lesson'
import OpticsSimulation from './Simulation'
import { opticsLesson } from './meta'

export default function OpticsLessonPage() {
  return (
    <Lesson
      lesson={opticsLesson}
      number="03"
      subject={{ title: '光学', to: '/optics', label: 'OPTICS' }}
      simulation={<OpticsSimulation />}
      next={
        <Anchor component={Link} to="/optics">
          光学の地図に戻る →
        </Anchor>
      }
      sources={[
        {
          title: 'OpenStax · Reflection',
          url: 'https://openstax.org/books/university-physics-volume-3/pages/1-2-the-law-of-reflection',
        },
        {
          title: 'OpenStax · Refraction',
          url: 'https://openstax.org/books/university-physics-volume-3/pages/1-3-refraction',
        },
        {
          title: 'OpenStax · Total Internal Reflection',
          url: 'https://openstax.org/books/university-physics-volume-3/pages/1-4-total-internal-reflection',
        },
      ]}
      explanation={
        <>
          <Title order={3}>跳ね返る光と、向こう側へ進む光</Title>
          <Text>
            反射は、光が境界で跳ね返って元の物質側へ戻ること。屈折は、別の物質へ進むときに向きが変わることです。水面では一部が反射し、一部が水中へ進むので、同じ境界で両方が起こります。
          </Text>
          <Title order={3}>まず「法線」を基準にする</Title>
          <Text>
            法線は境界に垂直な線です。入射角・反射角・屈折角はすべて法線から測ります。入射角0°は境界に沿う向きではなく、境界へ真っすぐ垂直に入る向きです。
          </Text>
          <div className="formula">
            θᵣ = θ₁
            <br />
            n₁ sin θ₁ = n₂ sin θ₂
            <br />n = c / v
          </div>
          <dl className="formula-symbols">
            <div>
              <dt>θ₁・θᵣ・θ₂</dt>
              <dd>入射・反射・屈折の角度。画面は °、計算は rad。</dd>
            </div>
            <div>
              <dt>n₁・n₂</dt>
              <dd>出発側・進む先の屈折率。単位なし。</dd>
            </div>
            <div>
              <dt>c [m/s]</dt>
              <dd>真空中の光の速さ：299,792,458。</dd>
            </div>
            <div>
              <dt>v [m/s]</dt>
              <dd>物質中の光の速さ。屈折率が大きいほど遅い。</dd>
            </div>
          </dl>
          <Title order={3}>45°で入ると、どこへ進む？</Title>
          <Text>
            反射角は45°。空気の屈折率を1.00、水を1.33とすると、sin θ₂ = sin 45°
            / 1.33
            なので屈折角は約32.1°です。水中では法線に近づき、光の速さも約3.00 ×
            10⁸ m/sから約2.25 × 10⁸ m/sへ小さくなります。
          </Text>
          <Title order={3}>速さが変わると、なぜ曲がる？</Title>
          <Text>
            光を波として見ると、斜めに入る波の前線は一部分から先に水へ入ります。その部分から進む速さが変わるため、波の前線の向きが変わり、光の進む向きも変わります。垂直に入る場合は前線が一斉に境界へ届くので、速さが変わっても曲がりません。
          </Text>
          <Title order={3}>水中のストローが曲がって見える理由</Title>
          <Text>
            水中の部分から目へ届く光は、水から空気へ出るところで曲がります。目に届いた光の向きを真っすぐ水中へたどると、実際とは違う位置になります。ストローそのものが曲がったのではなく、光の道筋が曲がっています。
          </Text>
          <Title order={3}>水から空気へ出られない条件：全反射</Title>
          <Text>
            n₁ &gt; n₂のとき、臨界角 θc = asin(n₂ / n₁)
            を超えると全反射します。水1.33 →
            空気1.00の臨界角は約48.8°。60°では屈折光がなく、反射光だけになります。臨界角ちょうどでは屈折角90°となり、境界に沿う限界を示します。
          </Text>
          <Title order={3}>このモデルの前提と限界</Title>
          <Text>
            平らな境界と、一様・等方的で吸収のない透明物質を仮定した幾何光学の解析式です。単色光の代表値として空気1.00・水1.33・ガラス1.50を使い、波長・温度・ガラスの種類による違いを省いています。光線を描く近似は、物体や境界の形の尺度が波長より十分大きい場合に使います。
          </Text>
          <Text>
            反射・透過の光の強さ、偏光、色の分かれ方、干渉、回折、粗い面の乱反射は扱いません。同じ屈折率では屈折せず、このモデルでは反射光もありません。全反射時の境界付近の波（エバネッセント波）も描きません。
          </Text>
          <Text>
            この図は実測でも時間を進める数値シミュレーションでもなく、条件ごとの解析式の可視化です。画面の長さにメートルの意味はなく、線の太さは光の強さを表しません。再生する物理時刻はありません。
          </Text>
        </>
      }
    />
  )
}
