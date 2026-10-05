import { Accordion, Badge, Button, Group, Paper, Stack, Switch, Tabs, Text, Title } from '@mantine/core'
import { useState } from 'react'
import { DirectDiagram, LensDiagram, MirrorDiagram } from './Diagrams'
import LensBridge from './LensBridge'
import RayAnimation from './Animation'
import '../../../components/lesson-journey.css'

const lens = { focalLength: .1, objectDistance: .2, objectHeight: .002 }
const scenes = [
  ['bridge', '砂地からレンズへ'],
  ['direct', '物から目へ'], ['focus', 'レンズで曲がる'], ['real', 'スクリーンに映る'], ['virtual', '虫めがねで見る'], ['mirror', '鏡の奥に見える'],
] as const

export default function ImageJourney() {
  const [scene, setScene] = useState<string>('bridge')
  const [extensions, setExtensions] = useState(true)
  const [secondPoint, setSecondPoint] = useState(false)
  const [thirdRay, setThirdRay] = useState(false)
  const sceneIndex = scenes.findIndex(([value]) => value === scene)
  return <Paper withBorder p={{ base: 'md', sm: 'xl' }}>
    <Group justify="space-between" gap="sm"><Title order={3}>砂地の列から、像の理由をたどる</Title><Badge variant="light">図とたとえで見る</Badge></Group>
    <Text size="sm" c="dimmed" mt="sm">六つの場面を自由に選べます。図に重ねるものや途中の時間を選ぶと、再生せずに関係を見られます。</Text>
    <Tabs value={scene} onChange={value => { if (value !== null) setScene(value) }}>
      <Tabs.List className="journey-scenes" aria-label="像の仕組みの場面" grow>{scenes.map(([value, title]) => <Tabs.Tab key={value} value={value}>{title}</Tabs.Tab>)}</Tabs.List>
      <Tabs.Panel value="bridge"><LensBridge active={scene === 'bridge'} /></Tabs.Panel>
      <Tabs.Panel value="direct">
        <div className="journey-intro"><Text className="eyebrow">場面 02 / 06</Text><Title order={4}>届く光を、来た向きへたどる</Title>
        <Text size="sm" c="dimmed" mt="sm">先端Aの一点から、光はさまざまな向きへ出ます。そのうち目へ届く細い束だけを描きます。</Text></div>
        <RayAnimation active={scene === 'direct'} kind="direct" extensions={extensions} tools={<Stack gap="sm">
          <Switch label="逆向きの延長を重ねる" checked={extensions} onChange={event => setExtensions(event.currentTarget.checked)} />
        </Stack>} explanation={<Stack gap="sm">
          <Text>光が途中で曲がらずに届けば、目へ入る向きを逆にたどると、元のAに戻ります。</Text>
          <Text>レンズや鏡を通した光は、途中で向きを変えています。目へ入る最後の向きをまっすぐ逆に延ばすと、元のAとは別の場所へ戻る場合があります。その光が来たように見える場所が、Aの「像」の位置です。</Text>
          <Text size="sm" c="dimmed">目は、届いた光を目のレンズで網膜に集めます。ここでは網膜の結像や脳の距離判断を省き、届く光の方向を幾何学でたどります。</Text>
        </Stack>}>
          {progress => <DirectDiagram extensions={extensions} progress={progress} />}
        </RayAnimation>
      </Tabs.Panel>
      <Tabs.Panel value="focus">
        <div className="journey-intro"><Text className="eyebrow">場面 03 / 06</Text><Title order={4}>平行な光が集まる場所を、目印にする</Title>
        <Text size="sm" c="dimmed" mt="sm">横線はレンズの中心を通る基準の線です。これを「軸」と呼びます。軸に平行な三本の光が、レンズを通る前後でどう変わるかを見ます。</Text></div>
        <RayAnimation active={scene === 'focus'} kind="focus" explanation={<Stack gap="sm">
          <Text>空気中の凸レンズは中央が厚く、両面で光が曲がります。この図では、両面での曲がりを中心の面での向きの変化にまとめています。</Text>
          <Text>軸に平行に入った光は、右のFへ集まります。この点が「焦点」です。レンズの中心からFまでの距離を「焦点距離」と呼びます。反対側から平行な光を入れたときの焦点は、左のFです。2Fは、中心から焦点距離の2倍離れた位置の目印です。</Text>
          <Text>焦点は、平行な光で決める目印です。近くの物の一点から出る光は広がって入るので、その点の像がいつもFにできるわけではありません。</Text>
          <Text size="sm" c="dimmed">空気中の薄い凸レンズを扱います。曲がる理由は「光の反射と屈折」へつながります。レンズの形から焦点距離を求める過程は、ここでは扱いません。</Text>
        </Stack>}>
          {progress => <LensDiagram input={lens} focus progress={progress} />}
        </RayAnimation>
      </Tabs.Panel>
      <Tabs.Panel value="real">
        <div className="journey-intro"><Text className="eyebrow">場面 04 / 06</Text><Title order={4}>一点の光が、別の一点へ集まる</Title>
        <Text size="sm" c="dimmed" mt="sm">物の先端Aから出た光は、軸に平行に入る線と、中心を通る線で代表させます。どちらも同じAから出た光です。</Text></div>
        <RayAnimation active={scene === 'real'} kind="real" tools={<Stack gap="sm">
          <Switch label="根元Bから出た光も重ねる" checked={secondPoint} onChange={event => setSecondPoint(event.currentTarget.checked)} />
          <Switch label="左のFを通って入る第三の光線" checked={thirdRay} onChange={event => setThirdRay(event.currentTarget.checked)} />
        </Stack>} explanation={<Stack gap="sm">
          <Text>軸に平行な線は右のFを通り、中心を通る線は薄いレンズの近似では直進します。第三の線は左のFを通って入り、出た後は軸に平行です。三本だけが存在するのではなく、像を求めやすい線を選んでいます。</Text>
          <Text>レンズの右側で、Aの光が軸の下へ集まります。Bの光は軸上へ集まります。物の各点と、集まる各点が対応して、形が逆向きに並びます。上下の向きが逆になった像を「倒立」と呼びます。</Text>
          <Text>この集まる面にスクリーンを置けば、各点の光がそこで受け止められ、倒立した像が映ります。光が実際に集まる像を「実像」と呼びます。</Text>
          <Text size="sm" c="dimmed">この図は上下の逆転を示す断面です。軸を含む別の断面でも向きが逆になり、スクリーンの像は物を180°回した向きになります。</Text>
        </Stack>}>
          {progress => <LensDiagram input={lens} screen={.2} secondPoint={secondPoint} thirdRay={thirdRay} progress={progress} />}
        </RayAnimation>
      </Tabs.Panel>
      <Tabs.Panel value="virtual">
        <div className="journey-intro"><Text className="eyebrow">場面 05 / 06</Text><Title order={4}>光は広がっても、出発点はたどれる</Title>
        <Text size="sm" c="dimmed" mt="sm">物を左のFよりレンズの近くへ置きます。先端Aから、レンズを通って目へ届く二本の光を描きます。</Text></div>
        <RayAnimation active={scene === 'virtual'} kind="virtual" tools={<Stack gap="sm">
          <Switch label="根元Bから出た光も重ねる" checked={secondPoint} onChange={event => setSecondPoint(event.currentTarget.checked)} />
        </Stack>} explanation={<Stack gap="sm">
          <Text>レンズは光を軸へ曲げますが、この近さでは、出た後もAの光は広がります。レンズの右にスクリーンを置いても、一点へは集まりません。</Text>
          <Text>目へ届くAの二本の光を逆向きに延ばすと、レンズの左側で交わります。そこがAの像です。根元Bの光を重ねると、延長は同じ左30 cmの軸上で交わり、Bの像になります。像の高さはAの像からBの像までの間隔です。</Text>
          <Text>その間隔は元のAとBの間隔の4倍になります。Aの像は軸より上、Bの像は軸上にあり、元のAとBの上下の順が保たれます。この向きを「正立」と呼びます。</Text>
          <Text>光がそこへ実際に集まらず、延長が交わる像を「虚像」と呼びます。レンズを通して見ると、正立した大きな像が見えます。虫めがねで近くの文字を大きく見るときの関係です。</Text>
          <Text size="sm" c="dimmed">「虚像」は見えないという意味ではありません。見える光は実線の道筋を通ります。目のレンズが網膜に作る像とは区別します。</Text>
        </Stack>}>
          {progress => <LensDiagram input={{ ...lens, objectDistance: .075 }} secondPoint={secondPoint} progress={progress} />}
        </RayAnimation>
      </Tabs.Panel>
      <Tabs.Panel value="mirror">
        <div className="journey-intro"><Text className="eyebrow">場面 06 / 06</Text><Title order={4}>反射した光は、鏡の奥から来たように届く</Title>
        <Text size="sm" c="dimmed" mt="sm">ここからは上から見た図です。物の一点A、平らな鏡、目を置きます。実線をAから目の順に追い、次に破線を目から逆向きに追います。</Text></div>
        <RayAnimation active={scene === 'mirror'} kind="mirror" explanation={<Stack gap="sm">
          <Text>鏡の面に90°で立てた点線が、角度の基準です。この線を「法線」と呼びます。届く光と戻る光は、この基準線から測る角度が等しくなります。</Text>
          <Text>反射後の向きを逆に延ばすと、二本の破線は鏡の奥で交わります。その交点は、鏡に対してAと対称な位置です。鏡からの距離は手前と奥で等しくなります。</Text>
          <Text>他の点でも同じ対応ができるので、平面鏡の像は物と同じ大きさです。鏡の奥へ光が進んで集まるわけではなく、この像も虚像です。</Text>
          <Text size="sm" c="dimmed">平面鏡が反転するのは、鏡の面に直角な位置です。面に沿う上下や左右の位置は保たれます。「左右逆」という見え方と、レンズの倒立像の回転を同じ反転として扱いません。</Text>
        </Stack>}>
          {progress => <MirrorDiagram normals progress={progress} />}
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
