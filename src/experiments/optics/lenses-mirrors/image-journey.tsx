import { Accordion, Badge, Button, Group, Paper, Stack, Switch, Tabs, Text, Title } from '@mantine/core'
import { useState } from 'react'
import { DirectDiagram, LensDiagram, MirrorDiagram } from './diagrams'
import LensBridge from './lens-bridge'
import PaperImageGuide from './paper-image-guide'
import RayAnimation from './animation'
import '../../../components/lesson-journey.css'

const lens = { focalLength: .1, objectDistance: .2, objectHeight: .002 }
const scenes = [
  ['direct', '① 文字を見る'], ['real', '② 紙に映す'], ['virtual', '③ 虫めがね'], ['mirror', '④ 鏡の奥'],
  ['focus', '焦点の目印'], ['bridge', '曲がる理由'],
] as const

export default function ImageJourney() {
  const [scene, setScene] = useState<string>('direct')
  const [extensions, setExtensions] = useState(false)
  const [virtualExtensions, setVirtualExtensions] = useState(false)
  const [mirrorExtensions, setMirrorExtensions] = useState(false)
  const [normals, setNormals] = useState(false)
  const [secondPoint, setSecondPoint] = useState(false)
  const sceneIndex = scenes.findIndex(([value]) => value === scene)
  return <Paper withBorder p={{ base: 'md', sm: 'xl' }}>
    <Group justify="space-between" gap="sm"><Title order={3}>同じ文字を、光の道筋でたどる</Title><Badge variant="light">一点ずつ見る</Badge></Group>
    <Text size="sm" c="dimmed" mt="sm">①〜④は、文字の同じ上端Aを追う場面です。「焦点の目印」「曲がる理由」は、さらに理由を知りたいときに選べます。どの場面も直接開けます。</Text>
    <Tabs value={scene} onChange={value => { if (value !== null) setScene(value) }}>
      <Tabs.List className="journey-scenes" aria-label="像の仕組みの場面" grow>{scenes.map(([value, title]) => <Tabs.Tab key={value} value={value}>{title}</Tabs.Tab>)}</Tabs.List>
      <Tabs.Panel value="bridge"><LensBridge active={scene === 'bridge'} /></Tabs.Panel>
      <Tabs.Panel value="direct">
        <div className="journey-intro"><Text className="eyebrow">場面 01 / 06</Text><Title order={4}>文字を見るとき、目には何が届く？</Title>
        <Text size="sm" c="dimmed" mt="sm">明るい場所で文字を見ると、文字で反射した光の一部が目に入ります。文字の縦線を一本取り出し、上端をA、下端をBと呼びます。まずAから目へ届く光だけを青い線で描きます。</Text></div>
        <RayAnimation active={scene === 'direct'} kind="direct" extensions={extensions} tools={<Stack gap="sm">
          <Switch label="目に届く向きを、来た側へたどる（破線）" checked={extensions} onChange={event => setExtensions(event.currentTarget.checked)} />
        </Stack>} explanation={<Stack gap="sm">
          <Text>青い矢印は文字から目へ向かっています。目から文字へ光を出して見ている、という図ではありません。Aから出た光のうち、目の入口に届く細い束を二本で代表させています。</Text>
          <Text>{extensions ? '破線は、目へ届く光の向きを、光が来た側へまっすぐたどる補助線です。途中で曲がらないこの場面では、二本は元のAで交わります。虫めがねと鏡でも、この同じたどり方を比べます。' : '破線を重ねると、目へ届く光が、どの場所から来たように見えるかを図でたどれます。実際の光と、場所を探すための線を分けて見ます。'}</Text>
          <Text size="sm" c="dimmed">目は、届いた光を目のレンズで網膜に集めます。ここでは網膜の結像や脳の距離判断を省き、届く光の方向を幾何学でたどります。</Text>
        </Stack>}>
          {progress => <DirectDiagram extensions={extensions} progress={progress} />}
        </RayAnimation>
      </Tabs.Panel>
      <Tabs.Panel value="focus">
        <div className="journey-intro"><Text className="eyebrow">さらに見る / 焦点</Text><Title order={4}>平行な光が集まる場所を、目印にする</Title>
        <Text size="sm" c="dimmed" mt="sm">ここでは文字から出る光をいったん外し、同じ向きに進む三本だけを入れます。横線はレンズの中心を通る基準の線です。これを「軸」と呼びます。軸に平行な三本の光が、レンズを通る前後でどう変わるかを見ます。</Text></div>
        <RayAnimation active={scene === 'focus'} kind="focus" explanation={<Stack gap="sm">
          <Text>空気中の凸レンズは中央が厚く、両面で光が曲がります。この図では、両面での曲がりを中心の面での向きの変化にまとめています。</Text>
          <Text>軸に平行に入った光は、右のFへ集まります。この点が「焦点」です。レンズの中心からFまでの距離を「焦点距離」と呼びます。反対側から平行な光を入れたときの焦点は、左のFです。2Fは、中心から焦点距離の2倍離れた位置の目印です。</Text>
          <Text>焦点は、平行な光で決める目印です。近くの物の一点から出る光は広がって入るので、その点の像がいつもFにできるわけではありません。</Text>
          <Text size="sm" c="dimmed">空気中の薄い凸レンズを扱います。曲がる理由は「光の反射と屈折」へつながります。レンズの形から焦点距離を求める過程は、ここでは扱いません。</Text>
        </Stack>}>
          {progress => <LensDiagram input={lens} focus progress={progress} />}
        </RayAnimation>
      </Tabs.Panel>
      <Tabs.Panel value="real"><PaperImageGuide /></Tabs.Panel>
      <Tabs.Panel value="virtual">
        <div className="journey-intro"><Text className="eyebrow">場面 03 / 06</Text><Title order={4}>光は広がっても、出発点はたどれる</Title>
        <Text size="sm" c="dimmed" mt="sm">同じ文字の線を、今度はレンズから7.5 cmの近くに置きます。上端Aからレンズを通って目へ届く二本を選びます。紙に映す場面より、入る前の光の広がりが大きくなります。横線はレンズの中心を通る基準の線（軸）です。</Text></div>
        <RayAnimation active={scene === 'virtual'} kind="virtual" extensions={virtualExtensions} tools={<Stack gap="sm">
          <Switch label="目に届く向きを、来た側へたどる（破線）" checked={virtualExtensions} onChange={event => setVirtualExtensions(event.currentTarget.checked)} />
          <Switch label="下端Bから出た光も重ねる" checked={secondPoint} onChange={event => setSecondPoint(event.currentTarget.checked)} />
        </Stack>} explanation={<Stack gap="sm">
          <Text>レンズは光を軸へ曲げますが、この近さでは、出た後もAの光は広がります。レンズの右にスクリーンを置いても、一点へは集まりません。</Text>
          <Text>{virtualExtensions ? '破線は、目に届く二本を「レンズで曲がらず、この向きのまま来た」として、来た側へ延ばした線です。二本はレンズの左30 cmで交わります。そこから光が来たように見える位置が、Aの像です。元のAは左7.5 cmにあり、像の位置とは違います。' : '次に破線を重ねると、目に届く向きから、光が来たように見える場所を探せます。①の文字を見る場面と同じたどり方ですが、今回は途中でレンズが光を曲げています。'}</Text>
          {virtualExtensions && <>
            <Text>{secondPoint ? 'Aの像は軸の上、Bの像は軸上で交わります。元のAとBの上下の順が保たれ、二点の間隔は元の4倍です。向きが同じ像を「正立」と呼びます。虫めがねで近くの文字を大きく見るときの関係です。' : '下端Bも重ねると、像の二点の上下の順と間隔を、元の線と比べられます。'}</Text>
            <Text>この交点へ光が実際に集まるわけではありません。目でのぞくと見えるけれど、その位置に紙を置いて直接は映せない像を「虚像」と呼びます。</Text>
          </>}
          <Text size="sm" c="dimmed">「虚像」は見えないという意味ではありません。見える光は実線の道筋を通ります。目のレンズが網膜に作る像とは区別します。</Text>
        </Stack>}>
          {progress => <LensDiagram input={{ ...lens, objectDistance: .075 }} landmarks={false} extensions={virtualExtensions} secondPoint={secondPoint} progress={progress} />}
        </RayAnimation>
      </Tabs.Panel>
      <Tabs.Panel value="mirror">
        <div className="journey-intro"><Text className="eyebrow">場面 04 / 06</Text><Title order={4}>反射した光は、鏡の奥から来たように届く</Title>
        <Text size="sm" c="dimmed" mt="sm">ここからは上から見た図です。同じ文字の上端A、平らな鏡、目を置きます。まず実線をA→鏡→目の順に追います。次に破線を重ねると、光が来たように見える場所を探せます。</Text></div>
        <RayAnimation active={scene === 'mirror'} kind="mirror" extensions={mirrorExtensions} tools={<Stack gap="sm">
          <Switch label="目に届く向きを、来た側へたどる（破線）" checked={mirrorExtensions} onChange={event => setMirrorExtensions(event.currentTarget.checked)} />
          <Switch label="反射する角度の基準線を重ねる" checked={normals} onChange={event => setNormals(event.currentTarget.checked)} />
        </Stack>} explanation={<Stack gap="sm">
          <Text>目へ届く光は、Aから鏡へ進み、そこで向きを変えて目に入ります。鏡の奥へは進んでいません。</Text>
          {normals && <Text>鏡の面に90°で立てた点線が、角度の基準です。この線を「法線」と呼びます。届く光と戻る光は、この基準線から測る角度が等しくなります。</Text>}
          <Text>{mirrorExtensions ? '目から、届いた最後の向きをまっすぐ来た側へたどると、二本の破線が鏡の奥で交わります。物は鏡の手前25 cm、交点は奥25 cmです。文字が鏡の奥にあるように見える位置を、この交点が表しています。' : '破線を重ねると、鏡で折れ曲がった実際の道筋と、目からまっすぐたどる補助線を比べられます。'}</Text>
          <Text>鏡の奥の像も、そこへ光が集まらない「虚像」です。①・③と同じたどり方で位置を探せます。他の点も同じだけ鏡の奥へ対応するので、像は物と同じ大きさです。</Text>
          <Text size="sm" c="dimmed">平面鏡が反転するのは、鏡の面に直角な位置です。面に沿う上下や左右の位置は保たれます。「左右逆」という見え方と、レンズの倒立像の回転を同じ反転として扱いません。</Text>
        </Stack>}>
          {progress => <MirrorDiagram normals={normals} extensions={mirrorExtensions} progress={progress} />}
        </RayAnimation>
      </Tabs.Panel>
    </Tabs>
    <Group justify="space-between" mt="lg">
      <Button variant="subtle" disabled={sceneIndex === 0} onClick={() => setScene(scenes[sceneIndex - 1][0])}>← 前の場面</Button>
      <Button variant="light" disabled={sceneIndex === scenes.length - 1} onClick={() => setScene(scenes[sceneIndex + 1][0])}>{scenes[sceneIndex + 1]?.[1] ?? '次の場面'} →</Button>
    </Group>
    <Accordion variant="separated" mt="lg">
      <Accordion.Item value="scope"><Accordion.Control>たとえの対応・図の尺度・説明の範囲</Accordion.Control><Accordion.Panel>
        <Text>砂地の人は右へ歩き続けます。光へ渡すのは、中央ほど長く遅れると並びの形が変わる関係です。人の軌道、歩行時刻、砂地の輪郭から光路や焦点距離を求める意味ではありません。</Text>
        <Text mt="sm">レンズは空気中の薄い凸レンズで、軸に近い光と小さい角度を仮定します。横からの図は縦を拡大しているため、角度は測れません。鏡は十分広い平面鏡を上から見た断面です。レンズの収差や回折、像の明るさ、目の網膜と脳による見え方は扱いません。</Text>
        <Text mt="sm">歩行は0〜1.10秒を6倍にゆっくり表示します。光線の8秒は線を描く順序の説明時間で、光が届く速さや時刻ではありません。式と単位、詳しい成立条件は「式と前提」で参照できます。</Text>
      </Accordion.Panel></Accordion.Item>
    </Accordion>
  </Paper>
}
