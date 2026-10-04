import { Accordion, Anchor, Text, Title } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import Lesson from '../../../components/Lesson'
import OpticsSimulation from './Simulation'
import WavefrontDiagram from './WavefrontDiagram'
import WavePrimer from './WavePrimer'
import { opticsLesson } from './meta'

export default function OpticsLessonPage() {
  return (
    <Lesson
      lesson={opticsLesson}
      number="03"
      subject={{ title: '光学', to: '/optics', label: 'OPTICS' }}
      mechanism={
        <>
          <WavePrimer />
          <Accordion variant="separated" mt="xl">
            <Accordion.Item value="construction">
              <Accordion.Control>次の波面を、距離の作図で見る</Accordion.Control>
              <Accordion.Panel><WavefrontDiagram /></Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </>
      }
      simulation={<OpticsSimulation />}
      next={
        <Anchor component={Link} to="/optics">
          光学の地図に戻る →
        </Anchor>
      }
      sources={[
        { title: 'OpenStax · Mathematics of Waves', url: 'https://openstax.org/books/university-physics-volume-1/pages/16-2-mathematics-of-waves' },
        { title: 'OpenStax · Plane Electromagnetic Waves', url: 'https://openstax.org/books/university-physics-volume-2/pages/16-2-plane-electromagnetic-waves' },
        { title: 'OpenStax · Young’s Double-Slit Interference', url: 'https://openstax.org/books/university-physics-volume-3/pages/3-1-youngs-double-slit-interference' },
        {
          title: 'OpenStax · Huygens’s Principle',
          url: 'https://openstax.org/books/university-physics-volume-3/pages/1-6-huygenss-principle',
        },
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
            法線は、二つの物質が接する面に90°で立つ基準線です。境界へ届く光と法線の間が「入射角」、戻る光との間が「反射角」、向こう側へ進む光との間が「屈折角」です。入射角0°では、光は法線と同じ向きに境界へ届きます。
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
              <dd>物質中の光の速さ。n = c/v は真空中の速さとの比。</dd>
            </div>
          </dl>
          <Text mt="sm">反射角は入射角と等しくなります。屈折の式は、二つの物質の速さの比と角度を結ぶ「スネルの法則」です。sinは角度に対応する比で、ここでは光の向きの、境界に沿う成分を表すのに使います。</Text>
          <Title order={3}>空気から水へ、45°で入る例</Title>
          <Text>
            反射角は45°。空気の屈折率を1.00、水を1.33とすると、sin θ₂ = sin 45°
            / 1.33
            なので屈折角は約32.1°です。水中では法線に近づき、光の速さも約3.00 ×
            10⁸ m/sから約2.25 × 10⁸ m/sへ小さくなります。
          </Text>
          <Title order={3}>速さが変わると、なぜ曲がる？</Title>
          <Text>
            同じ位相の場所を示す波面が斜めに水面へ届くと、一部が先に水へ入ります。先に入った部分から速さが小さくなるので、波面の向きが変わります。この波面に垂直な光の進む向きも変わります。水面へまっすぐ届く場合は、波面全体が同時に水へ入るため、速さが変わっても向きは変わりません。
          </Text>
          <Title order={3}>水中のストローが曲がって見える理由</Title>
          <Text>
            水中の部分から目へ届く光は、水から空気へ出るところで曲がります。目に届いた光の向きを真っすぐ水中へたどると、実際とは違う位置になります。ストローそのものが曲がったのではなく、光の道筋が曲がっています。
          </Text>
          <Title order={3}>水から空気へ出られない条件：全反射</Title>
          <Text>
            進む先の屈折率が小さい n₁ &gt; n₂ の場合、入射角を大きくすると屈折角も大きくなります。屈折角が90°になる入射角が「臨界角」で、θc = asin(n₂ / n₁)です。asinは、sinの値から角度を求める操作です。
          </Text>
          <Text mt="sm">水1.33から空気1.00への臨界角は約48.8°です。これを超える60°では、向こう側へ進む屈折光線がなく、元の側へ戻る全反射になります。臨界角ちょうどの屈折角90°は、境界に沿う限界です。</Text>
          <Title order={3}>光線図が表す範囲</Title>
          <Text>
            境界は平らで、各物質の性質は場所や方向によらず、光を吸収しないと仮定します。光の道筋を線で扱う近似を「幾何光学」と呼びます。物体や境界の形が、光の波長より十分大きい場合に使える見方です。
          </Text>
          <Text>
            屈折率は空気1.00、水1.33、ガラス1.50の代表値に固定します。色や温度、ガラスの種類による値の違いは省きます。同じ屈折率を選んだ場合は、向きの変化と反射光を描きません。
          </Text>
          <Text>
            光線図は、条件に応じた式の計算結果です。実測値や時間に沿う数値シミュレーションではありません。反射と透過の強さ、電場の振れる方向による違い、狭い隙間での広がり、粗い面での反射は扱いません。全反射でも境界のすぐ先には場が存在しますが、その場もこの光線図の範囲外です。
          </Text>
        </>
      }
    />
  )
}
