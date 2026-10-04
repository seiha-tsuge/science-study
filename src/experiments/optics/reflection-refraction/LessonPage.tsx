import { Accordion, Anchor, Text, Title } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import Lesson from '../../../components/Lesson'
import OpticsSimulation from './Simulation'
import RefractionJourney from './RefractionJourney'
import WavefrontDiagram from './WavefrontDiagram'
import WavePrimer from './WavePrimer'
import { opticsLesson } from './meta'
import StrawDiagram from './StrawDiagram'
import './optics-lesson.css'

export default function OpticsLessonPage() {
  return (
    <Lesson
      lesson={opticsLesson}
      number="03"
      className="optics-lesson"
      overviewVisual={<figure className="optics-opening-figure"><StrawDiagram mode={2} compact /><figcaption>● 実際の点 → 水面で曲がる光 → ○ 見える点<br />平らな水面の説明図。一点の見える位置の近似です。</figcaption></figure>}
      subject={{ title: '光学', to: '/optics', label: 'OPTICS' }}
      mechanism={
        <>
          <RefractionJourney />
          <Accordion variant="separated" mt="xl">
            <Accordion.Item value="wave-basics">
              <Accordion.Control>さらに知りたい：光では何が変わる？ 電場・干渉・位相</Accordion.Control>
              <Accordion.Panel><WavePrimer /></Accordion.Panel>
            </Accordion.Item>
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
          <Title order={3}>水面で、光の道筋が分かれる</Title>
          <Text>
            空気から水へ斜めに届いた光は、一部が空気側へ戻り、一部が水中へ進みます。元の側へ戻るのが「反射」、別の物質へ進むときの向きの変化が「屈折」です。同じ水面で、両方が起こります。
          </Text>
          <Title order={3}>角度は、水面に立てた基準線から測る</Title>
          <Text>
            光線図の点線は、二つの物質が接する面に90°で立っています。この線が「法線」です。境界へ届く光と法線の間を入射角θ₁、戻る光との間を反射角θᵣ、向こう側へ進む光との間を屈折角θ₂と呼びます。水面から測る角度とは区別します。
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
          <Text mt="sm">反射では、法線を挟んだ二つの角度が等しくなります。屈折では、速さの違いと二つの角度が「スネルの法則」で結ばれます。sin θは、光の向きを長さ1の矢印で表したとき、境界に沿う成分の大きさです。</Text>
          <Text mt="sm">屈折率nは、真空中の速さcを、物質中の速さvで割った比です。nが大きい物質ほど、光は遅く進みます。</Text>
          <Title order={3}>空気から水へ、45°で入る例</Title>
          <Text>
            空気の屈折率を1.00、水を1.33とすると、sin θ₂ = sin 45° / 1.33。屈折角は約32.1°になり、水中の光は法線に近づきます。反射角は45°のままです。
          </Text>
          <Text mt="sm">水中の速さは約2.25 × 10⁸ m/s。空気中の約3.00 × 10⁸ m/sより小さくなります。</Text>
          <Title order={3}>速さが変わると、なぜ曲がる？</Title>
          <Text>
            速さの変化だけでは、光は曲がりません。水面へまっすぐ届く場合には、波の目印の列全体が同時に水へ入ります。両側が一緒に遅くなるため、列の向きは変わりません。
          </Text>
          <Text mt="sm">斜めに届くと、片側が先に水へ入ります。その側は遅く進み、まだ空気中の側は速く進むので、同じ時間に進む距離に差が付きます。砂地へ入る人の列と同じく、目印の列が傾きます。</Text>
          <Text mt="sm">光の目印は、波の一つの山に相当する場所です。繰り返しの同じ段階にある場所がつくる面を「波面」と呼び、緑の列はその断面を表します。この平らな波では、光は波面に90°の向きへ進みます。波面が傾けば、光の向きも変わります。</Text>
          <Text mt="sm">人は歩く向きを変えていません。光が波面に90°で進む性質は、このたとえとは別に必要です。光の角度はスネルの法則で計算します。</Text>
          <Title order={3}>水中のストローが曲がって見える理由</Title>
          <Text>
            ストローの図では、水中の●から出た光が、水から空気へ進みます。空気中では速くなり、水面の法線から離れる向きへ曲がります。それでも、目へ届く細い束は、●から来た光です。
          </Text>
          <Text mt="sm">目へ入る向きは、水面で曲がった後の向きです。その向きのまま光を逆向きに延ばすと、紫の破線は●より浅い○で交わります。細い束が一直線に来たとみなしたときの出発点が、この○です。</Text>
          <Text mt="sm">水中の部分が実際とは違う位置に見えるため、ストローは水面で折れたように見えます。図の○は一点の見える位置の近似で、ストロー全体の像を再現したものではありません。コップの壁と目のレンズも省いています。</Text>
          <Title order={3}>角度を大きくすると、水から空気へ進む光線がなくなる</Title>
          <Text>
            水から空気へ向かう光は、入射角を大きくするほど法線から離れて進みます。屈折角が90°となり、光線が境界に沿う限界に達したときの入射角が「臨界角」です。出発側の屈折率が大きいn₁ &gt; n₂の場合に、この限界があります。
          </Text>
          <Text mt="sm">θc = asin(n₂ / n₁)。asinは、sinの値から角度を求める操作です。水1.33から空気1.00では、臨界角は約48.8°です。</Text>
          <Text mt="sm">この角度を超える60°では、空気側へ進む屈折光線がなくなります。光が水側へ戻るこの状態が「全反射」です。境界のすぐ先には場がしみ出しますが、空気側の遠くへ伝わる光線はありません。</Text>
          <Title order={3}>光線図が表す範囲</Title>
          <Text>
            境界は平らで、各物質の性質は場所や方向によらず、光を吸収しないと仮定します。波の山から次の山までの距離が「波長」です。物体や境界の形の尺度が波長より十分大きいとき、光の道筋を線で扱う「幾何光学」の近似が使えます。
          </Text>
          <Text>
            屈折率は空気1.00、水1.33、ガラス1.50の代表値に固定します。色や温度、ガラスの種類による値の違いは省きます。同じ屈折率を選んだ場合は、向きの変化と反射光を描きません。
          </Text>
          <Text>
            光線図は、条件に応じた式の計算結果です。実測値や時間に沿う数値シミュレーションではありません。反射と透過の強さ、電場の振れる方向による違い、色による速さの違い、狭い隙間での広がり、粗い面での反射は扱いません。全反射で境界のすぐ先にしみ出す場も、図には描きません。
          </Text>
        </>
      }
    />
  )
}
