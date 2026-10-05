import { Anchor, Table, Text, Title } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import Lesson from '../../../components/Lesson'
import ImageJourney from './ImageJourney'
import ImageSimulation from './Simulation'
import { imagesLesson, imageSources } from './meta'
import './images.css'

export default function ImagesLessonPage() {
  return <Lesson lesson={imagesLesson} number="04" subject={{ title: '光学', to: '/optics', label: 'OPTICS' }}
    mechanism={<ImageJourney />} simulation={<ImageSimulation />} sources={imageSources}
    next={<Anchor component={Link} to="/optics/reflection-refraction">光が曲がる理由：反射と屈折へ →</Anchor>}
    explanation={<>
      <Title order={3}>像の一点は、二本の線の交点から求められる</Title>
      <Text>レンズの中心を原点とし、光は左から右へ進みます。物は左に置き、物から中心までの距離をa、焦点距離をfとします。右にできる像までの距離bは正、左にできる像は負とします。画面の「左○cm」は、この負の距離の大きさを表します。</Text>
      <div className="formula">1/f = 1/a + 1/b<br />b = fa / (a − f)<br />m = h′/h = −b/a</div>
      <Text>物の高さhは下端Bから上端Aまで、像の高さh′はBの像からAの像までです。下端Bとその像は軸上に置き、軸より上を正、下を負とします。mは倍率で、単位はありません。mの絶対値が大きさの比、負号が倒立を表します。a・b・f・h・h′の計算単位はm、画面ではcmへ換算します。</Text>
      <Title order={3}>中心を通る線と、平行に入る線を比べる</Title>
      <Text>中心を通る線は、距離aで高さhから0へ下がります。この直線を像まで延ばすと、h′/h = −b/aです。軸に平行に入る線は、レンズで高さhにあり、距離fで高さ0へ下がるので、像まで延ばすとh′/h = 1 − b/fです。</Text>
      <Text mt="sm">両方が同じ像の一点を指すため、−b/a = 1 − b/f。この関係を整理すると1/f = 1/a + 1/bになります。二つの三角形の、高さと横の距離の比を使っています。虚像では、出た後の直線を逆向きへ延ばして同じ関係を使います。</Text>
      <Title order={3}>物を近づけたときの境界</Title>
      <Table.ScrollContainer minWidth={480}><Table withTableBorder><Table.Thead><Table.Tr><Table.Th>物の位置</Table.Th><Table.Th>像の位置と向き</Table.Th><Table.Th>大きさ</Table.Th></Table.Tr></Table.Thead><Table.Tbody>
        {[
          ['a > 2f', 'f < b < 2f、実像・倒立', '物より小さい'], ['a = 2f', 'b = 2f、実像・倒立', '物と同じ'], ['f < a < 2f', 'b > 2f、実像・倒立', '物より大きい'], ['a = f', '出た光は平行、有限の像なし', '有限の倍率なし'], ['0 < a < f', 'b < 0、虚像・正立', '物より大きい'],
        ].map(row => <Table.Tr key={row[0]}>{row.map(cell => <Table.Td key={cell}>{cell}</Table.Td>)}</Table.Tr>)}
      </Table.Tbody></Table></Table.ScrollContainer>
      <Text mt="sm">a = fではbの式の分母が0になります。0で割った数を像の位置として描かず、出た光が平行になる条件として扱います。焦点に近づくと像は遠ざかり、焦点をまたいだ先では反対側の遠くから虚像が近づきます。</Text>
      <Title order={3}>平面鏡は、面に直角な座標だけを反転する</Title>
      <Text>鏡の面をx = 0とし、手前をx &lt; 0とします。物の点が(x, y)なら像は(−x, y)です。反射する点を通り、鏡の面に90°で立つ法線から測って、入射角と反射角が等しくなります。物と対称な点から目へ直線を引くと、この反射の条件を満たします。</Text>
      <div className="formula">(x, y) → (−x, y)<br />θᵢ = θᵣ</div>
      <Text>二点のx方向の差は符号だけが変わり、面に沿う差は変わりません。点どうしの距離が保たれるので、像の大きさは物と等しくなります。3Dでも面に沿う二方向の位置はそのままで、面に直角な方向が反転します。</Text>
      <Title order={3}>この図とモデルが表す範囲</Title>
      <Text>砂地の人は道を1 m/s、砂地を0.5 m/sで右へ歩く説明用のモデルです。渡すのは中央ほど長く遅れることで並びが変わる関係だけです。水面の図は山の高さと山が並ぶ場所を対応させる静止した模式図です。光では水の高さの代わりに電気・磁気の状態が変わり、その同じ繰り返しの段階にある場所を目印にします。空気中では並びに90°の向きを光線で表します。水の上下運動、人の軌道やm/sの数値を、光の運動や速さへ対応させません。</Text>
      <Text mt="sm">光へ移すのは全員が砂地を出た後の並びです。集まる向きが読み取れる円弧を選んだ模式図であり、その砂地の輪郭が実レンズの正確な形になるという意味ではありません。レンズの二つの表面での屈折や、内部の波の伝わり方を、この歩行から計算していません。</Text>
      <Text>レンズは空気中の薄い凸レンズで、軸に近い光、小さい角度を仮定します。焦点距離は10 cmに固定しています。二つの表面での屈折を一つの面へまとめた解析式の可視化で、電磁場の数値計算や実測ではありません。中心を通る光の直進も、この薄いレンズの近似です。</Text>
      <Text mt="sm">レンズの口径による光の制限、厚さ、色で変わる屈折、球面収差、回折、明るさは扱いません。描画範囲を超えた像は位置を数値で示します。縦を拡大した図から角度や実際のレンズの形は求められません。</Text>
      <Text mt="sm">鏡は一枚の理想的な平面鏡で、十分広いと仮定します。図は上から見た断面で、目の位置は鏡に沿う方向へ動かします。実物の鏡の縁やガラスの厚さは省きます。目のレンズ、網膜と脳による見え方は扱いません。</Text>
      <Text mt="sm">スクリーン上の点は二本の光が当たる場所で、ぼけた像の形や明るさ全体を表しません。虚像はスクリーンに直接映せませんが、目やカメラの別のレンズが、届いた光を網膜やセンサーへ集めることはできます。</Text>
    </>}
  />
}
