import { Accordion, Button, Group, Paper, SegmentedControl, Stack, Text, Title } from '@mantine/core'
import { useState } from 'react'
import { DirectLeafDiagram, LensDiagram, MirrorDiagram } from './diagrams'
import { AnimationControls } from './animation'
import { useImageAnimation } from './use-image-animation'
import type { ImageExperience } from './image-experience'

const stages = [{ value: 'surface', label: '道具の境目' }, { value: 'light', label: '目へ届く光' }, { value: 'image', label: '見える葉の場所' }]

function LeafLight({ mirror, lensVisible, input, mirrorDistance, extensions }: { mirror: boolean; lensVisible: boolean; input: { focalLength: number; objectDistance: number; objectHeight: number }; mirrorDistance: number; extensions: boolean }) {
  const animation = useImageAnimation(true, 8)
  const steps = [{ time: 0, label: '葉と道具' }, { time: 2.8, label: mirror ? '鏡まで' : lensVisible ? 'レンズまで' : '葉から' }, { time: 5.6, label: '目へ届く' }, ...(extensions && (mirror || lensVisible) ? [{ time: 8, label: '見える場所' }] : [])]
  return <div>
    {mirror ? <MirrorDiagram distance={mirrorDistance / 100} extensions={extensions} progress={animation.time / 8} subject="leaf" /> : lensVisible ? <LensDiagram input={input} landmarks={false} extensions={extensions} progress={animation.time / 8} subject="leaf" /> : <DirectLeafDiagram distance={input.objectDistance * 100} progress={Math.min(1, animation.time / 5.6)} />}
    <Accordion mt="sm" onChange={() => animation.seek(animation.time)}><Accordion.Item value="movement"><Accordion.Control>線を順に描いて、途中で止める</Accordion.Control><Accordion.Panel><AnimationControls animation={animation} duration={8} stages={steps} label="線を描く説明時間" /><Text size="xs" mt="xs">8秒は作図の順序を示す時間で、光が届く時間ではありません。閉じると停止します。</Text></Accordion.Panel></Accordion.Item></Accordion>
  </div>
}

export default function ImageJourney({ experience, lensVisible, distance, mirrorDistance }: {
  experience: ImageExperience; lensVisible: boolean; distance: number; mirrorDistance: number
}) {
  const [stage, setStage] = useState('surface')
  const mirror = experience === 'mirror'
  const input = { focalLength: .1, objectDistance: distance / 100, objectHeight: .002 }
  return <Paper withBorder p={{ base: 'md', sm: 'lg' }}>
    <Title order={3}>同じ葉を、見え方から光の道筋へ</Title>
    <Text mt="sm">上で見た葉と道具を配置の図へ置き直し、見る目の位置も示しました。{mirror ? '鏡は、葉から来た光を目の側へ反射します。' : lensVisible ? '虫めがねのレンズは、空気とガラスの境目で光の向きを変えます。' : '虫めがねを外した条件です。'} 下の場面では、同じ条件に光の道筋を重ねられます。</Text>
    <SegmentedControl fullWidth mt="md" aria-label="同じ葉を見るための説明段階" value={stage} onChange={setStage} data={stages} />
    {stage === 'surface' ? <div className="image-daily-layout">
      {mirror ? <MirrorDiagram distance={mirrorDistance / 100} extensions={false} progress={0} subject="leaf" /> : lensVisible ? <LensDiagram input={input} landmarks={false} extensions={false} progress={0} subject="leaf" /> : <DirectLeafDiagram distance={distance} progress={0} />}
      <div>
        <Title order={4}>{mirror ? '光は、鏡の面で戻る' : lensVisible ? '向きが変わるのは、レンズの表面' : '道具を外すと、まっすぐ届く'}</Title>
        <Text mt="sm">{mirror ? '鏡の向こうの葉を直接見ているわけではありません。手前の葉から来た光が、鏡で向きを変えて目へ届いています。次の図では、その実際の道筋だけを重ねます。' : lensVisible ? '光は違う物質へ斜めに入る境目で向きを変えます。これを「屈折」と呼びます。虫めがねでは、入る面と出る面の両方で起こります。面が曲がっているため、通る場所で向きの変わり方も異なります。中央が厚い形のレンズを「凸レンズ」と呼びます。この図は薄いレンズの近似なので、二つの表面での曲がりを中心の一か所へまとめています。線がそこで折れるのは、この省略を表しています。' : '虫めがねを外しても、葉と目の位置は変えていません。光は葉から目へまっすぐ届きます。上で虫めがねを戻すと、同じ配置で光が曲がる場合と比べられます。'}</Text>
      </div>
    </div> : <>
      <Text size="sm" mt="md">{mirror ? `同じ葉を鏡の手前${mirrorDistance} cmに置き、上からの配置へ目を加えます。` : `同じ葉と目を横から見た配置です。${lensVisible ? `虫めがねとの間隔は上と同じ${distance} cm。` : '虫めがねは外しています。'}`} 実線は実際の光の道筋です。葉の先から届く光の一部を、二本の線で代表させています。</Text>
      <div className="image-daily-layout">
        <LeafLight key={`${experience}-${lensVisible}-${distance}-${mirrorDistance}-${stage}`} mirror={mirror} lensVisible={lensVisible} input={input} mirrorDistance={mirrorDistance} extensions={stage === 'image'} />
        <Stack gap="sm">
          <Title order={4}>{stage === 'light' ? '物から来た光が、目へ届く' : '届く向きから、見える場所をたどる'}</Title>
          <Text>{stage === 'light'
            ? mirror ? '葉→鏡→目の順にたどれます。鏡の向こうを光が通ったのではありません。物が鏡の向こうに見える理由は、目へ届いた最後の向きにあります。' : lensVisible ? '光は葉→レンズ→目の順に進みます。この近さでは、レンズを出た後も光は広がりながら目へ届きます。次の場面では、その届く向きと、大きく見える葉の場所をつなぎます。' : '葉から来る光は途中で曲がりません。目へ届いた向きをたどると、元の葉へ戻ります。'
            : mirror ? '目へ届いた最後の向きを、来た側へまっすぐたどると、鏡の向こうの葉先を指します。上の図で見た奥行きに対応する場所です。破線は場所を探すための補助線で、実際の光ではありません。' : lensVisible ? '目へ届く向きを、来た側へまっすぐたどると、元の葉より遠い場所で交わります。その場所にある大きな葉から来たような向きで、光が届きます。見える大きさには、そこでの葉の高さと目からの距離の両方が関係します。この条件では、そのまま見るときより広い角度を占めるため、葉が大きく見えます。' : '光は元の葉からまっすぐ届きます。虫めがねを戻すと、光の届く向きと、見える葉の大きさを同じ条件で比べられます。'}</Text>
          {stage === 'image' && (mirror || lensVisible) && <Text>道具を通して見える、この葉の姿を<strong>像</strong>と呼びます。この場所にもう一枚の葉があるわけでも、光が集まっているわけでもありません。</Text>}
          <Text size="sm" c="dimmed">{mirror ? '十分広い平面鏡の位置の図です。' : '縦を拡大した薄いレンズの図です。角度や写真の見え方は読み取れません。'} 目の中で光が集まる過程と、脳が奥行きを判断する仕組みは省いています。</Text>
        </Stack>
      </div>
    </>}
    <Group mt="md"><Button variant="light" disabled={stage === 'image'} onClick={() => setStage(stage === 'surface' ? 'light' : 'image')}>{stage === 'surface' ? '目へ届く光を重ねる' : '見える場所をたどる'}</Button></Group>
  </Paper>
}
