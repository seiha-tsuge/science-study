import { Badge, Button, Group, NumberInput, Paper, Slider, Stack, Switch, Tabs, Text, Title } from '@mantine/core'
import { useState } from 'react'
import { LensDiagram, MirrorDiagram } from './Diagrams'
import { cm } from './format'
import { nearestScreenPosition, observeLens, observeMirror, traceLensRay } from './model'

function Parameter({ label, value, min, max, onChange }: {
  label: string; value: number; min: number; max: number; onChange: (value: number) => void
}) {
  const [editing, setEditing] = useState<{ value: number; draft: string | number } | null>(null)
  const draft = editing?.value === value ? editing.draft : value
  const setDraft = (next: string | number) => setEditing({ value, draft: next })
  const commit = () => {
    const parsed = typeof draft === 'number' ? draft : Number(draft)
    if (draft === '' || !Number.isFinite(parsed)) { setEditing(null); return }
    const next = Math.round(Math.min(max, Math.max(min, parsed)) * 100) / 100
    onChange(next)
    setEditing(null)
  }
  // Input keeps its spelling while focused; a committed value drives the entire model.
  return <div className="image-parameter">
    <NumberInput label={label} description={`${min}〜${max} cm。数値はEnterまたは欄を離れたときに反映。`} value={draft} onChange={setDraft} onBlur={commit} onKeyDown={event => { if (event.key === 'Enter') { commit(); event.currentTarget.blur() } }} min={min} max={max} step={.5} decimalScale={2} suffix=" cm" />
    <Slider thumbLabel={`${label} スライダー`} value={value} onChange={next => { onChange(next); setEditing(null) }} min={min} max={max} step={.5} label={v => `${v} cm`} marks={[{ value: min, label: `${min} cm` }, { value: max, label: `${max} cm` }]} />
  </div>
}

export default function ImageSimulation() {
  const [scene, setScene] = useState<string | null>('lens')
  const [distance, setDistance] = useState(20)
  const [screen, setScreen] = useState(20)
  const [secondPoint, setSecondPoint] = useState(true)
  const [mirrorDistance, setMirrorDistance] = useState(25)
  const [eyeY, setEyeY] = useState(-12)
  const [extensions, setExtensions] = useState(true)
  const [normals, setNormals] = useState(false)
  const input = { focalLength: .1, objectDistance: distance / 100, objectHeight: .002 }
  const image = observeLens(input)
  const nearestScreen = nearestScreenPosition(image, .05, .6, .0001)
  const separation = Math.abs(traceLensRay(input, .0025, screen / 100).y - traceLensRay(input, -.0025, screen / 100).y)
  const focused = image.kind === 'real' && separation < 1e-8
  const mirror = observeMirror({ x: -mirrorDistance / 100, y: .08 }, { x: -.34, y: eyeY / 100 })
  return <Paper withBorder p={{ base: 'md', sm: 'xl' }}>
    <Tabs value={scene} onChange={setScene}>
      <Tabs.List className="journey-scenes" aria-label="条件を変える対象" grow><Tabs.Tab value="lens">凸レンズ</Tabs.Tab><Tabs.Tab value="mirror">平面鏡</Tabs.Tab></Tabs.List>
      <Tabs.Panel value="lens" pt="lg">
        <Title order={3}>物の近さと、光が集まる場所</Title>
        <Text size="sm" mt="xs">図のFはレンズの中心から10 cm、2Fは20 cmの目印です。焦点距離は10 cm、物の高さは0.2 cm（2 mm）に固定します。物の位置だけを変え、スクリーンの位置はそのままにして比べられます。</Text>
        <Group mt="md" gap="xs" aria-label="物の位置の例"><Text size="sm" fw={600}>場面を比べる</Text>{[[30, '2Fの外：30 cm'], [20, '2F：20 cm'], [15, 'Fと2Fの間：15 cm'], [10, 'F：10 cm'], [7.5, 'Fの内：7.5 cm']].map(([value, label]) => <Button key={value} variant={distance === value ? 'light' : 'default'} aria-pressed={distance === value} onClick={() => setDistance(Number(value))}>{label}</Button>)}</Group>
        <div className="image-scene">
          <LensDiagram input={input} fixedEntry screen={screen / 100} secondPoint={secondPoint} />
          <Stack gap="md">
            <Group><Badge variant="light">{image.kind === 'real' ? '実像・倒立' : image.kind === 'virtual' ? '虚像・正立' : '有限の距離に像なし'}</Badge></Group>
            <Text aria-live="polite">{image.kind === 'real'
              ? `Aから出た光は、レンズの右 ${cm(image.imageDistance)} cmで集まります。像の高さは${cm(Math.abs(image.imageHeight))} cm、物の${Math.abs(image.magnification).toLocaleString('ja-JP', { maximumFractionDigits: 2 })}倍です。`
              : image.kind === 'virtual'
                ? `Aから出てレンズを通った光の延長は、レンズの左 ${cm(-image.imageDistance)} cmで交わります。像の高さは${cm(image.imageHeight)} cm、物の${image.magnification.toLocaleString('ja-JP', { maximumFractionDigits: 2 })}倍です。`
                : '物がFにあると、同じ一点Aから出てレンズを通った二本は互いに平行になります。Aは軸より上なので、二本とも軸に対して斜めに進みます。有限の距離では集まりません。「像が無限遠」と表す条件です。'}</Text>
            <Text size="sm">Aの二本の光がレンズへ入る位置を、軸の上下2.5 mmに固定しています。Fをまたいでも同じ場所で、入る向きと出た後の広がりを比較できます。破線は出た光の逆向きの延長です。</Text>
            <Text size="sm">{image.kind === 'at-infinity' ? 'Aの光とBの光は、出た後の向きが異なります。それぞれの点から出た二本は互いに平行ですが、AとBの光すべてが同じ向きになるわけではありません。この条件には、有限の像の高さもありません。' : 'Aの像とBの像の間隔が、像の高さです。元のAとBの間隔と比べます。根元Bの光を重ねると、各点が別の各点へ対応することをたどれます。'}</Text>
            {image.kind === 'virtual' && <Text size="sm">目へ届く光を選ぶ作図は、仕組みの「虫めがねで見る」で示しています。ここでは同じ入射位置を保ちます。右のスクリーンには、一点の光が一点へ集まる像は映りません。</Text>}
            <Switch label="根元Bの光を重ねる" checked={secondPoint} onChange={event => setSecondPoint(event.currentTarget.checked)} />
            <div className="image-result">
              <Text fw={600}>スクリーン：レンズの右 {screen.toLocaleString('ja-JP', { maximumFractionDigits: 2 })} cm</Text>
              <Text size="sm" mt="xs">{focused ? 'Aの二本の光が同じ場所に当たります。ほかの各点の光も集まる面なので、像が映ります。' : image.kind === 'virtual' ? '虚像の位置へは光が集まりません。スクリーンは光を遮りますが、虚像をそのまま映すことはできません。' : `Aの二本の光が当たる高さの差は ${cm(separation)} cmです。一点の光が別々の場所へ届くので、ぼけの原因になります。`}</Text>
              {image.kind === 'real' && !focused && <Text size="sm" mt="xs">スクリーンと理想的な像の面の距離は {cm(Math.abs(screen / 100 - image.imageDistance))} cmです。</Text>}
              <Text size="xs" c="dimmed" mt="xs">二本の光の当たる場所を示す作図です。光の明るさや、ぼけた像の形全体は再現していません。実線の光はスクリーンで受け止められます。像の目印は、スクリーンがなければ光が集まる位置です。</Text>
            </div>
            <Group gap="xs">
              <Button variant="light" disabled={nearestScreen === null} onClick={() => { if (nearestScreen !== null) setScreen(Math.round(nearestScreen * 10000) / 100) }}>スクリーンを像に最も近い位置へ</Button>
              <Button variant="default" onClick={() => { setDistance(20); setScreen(20); setSecondPoint(true) }}>レンズの条件を初期化</Button>
            </Group>
            <Text size="sm">位置合わせも手入力も0.01 cm単位です。像の位置がその刻みに一致しない場合は、最も近い位置でも小さな差が残ります。</Text>
            {image.kind === 'real' && nearestScreen === null && <Text size="sm">像はスクリーン操作の上限60 cmより遠くにあります。物をFから遠ざけると、像はレンズへ近づきます。</Text>}
          </Stack>
        </div>
        <div className="image-parameters">
          <Parameter label="物からレンズの中心まで" value={distance} min={5} max={40} onChange={setDistance} />
          <Parameter label="レンズの中心からスクリーンまで" value={screen} min={5} max={60} onChange={setScreen} />
        </div>
        <Text size="sm" mt="md">物を近づけると、同じレンズ上の場所へ届く光も、入る前の広がりが大きくなります。その場所でレンズが与える向きの変化は同じなので、出た光の集まろうとする傾きが弱まり、交点は遠ざかります。Fでは平行、Fの内側では出た光も広がります。</Text>
        <Text size="sm" mt="sm">物が2Fの外なら実像は小さく、2Fなら同じ大きさ、Fと2Fの間なら大きくなります。Fの内側では、正立した大きな虚像になります。Fをまたぐと像は一度図の外へ遠ざかるため、連続してレンズの面を通り抜ける動きにはしません。</Text>
      </Tabs.Panel>
      <Tabs.Panel value="mirror" pt="lg">
        <Title order={3}>目を動かしても、像の位置は同じ</Title>
        <Text size="sm" mt="xs">上から見た図です。物の点Aを固定したまま目だけ動かすと、反射する場所は変わり、延長の交点は変わりません。</Text>
        <div className="image-scene"><MirrorDiagram distance={mirrorDistance / 100} eyeY={eyeY / 100} extensions={extensions} normals={normals} /><Stack gap="sm">
          <Switch label="逆向きの延長と、鏡からの距離" checked={extensions} onChange={event => setExtensions(event.currentTarget.checked)} />
          <Switch label="鏡の面に90°の基準線（法線）" checked={normals} onChange={event => setNormals(event.currentTarget.checked)} />
          <Text aria-live="polite">Aは鏡の手前 {mirrorDistance} cm、像は鏡の奥 {cm(mirror.image.x)} cmです。目の位置を変えても、この距離と像の位置は保たれます。</Text>
          <Text size="sm">図の二本は、目の入口の両端に届く光です。その中間の、入口の中央へ届く光で計算すると、法線から測る入射角と反射角はどちらも {(mirror.incidenceAngle * 180 / Math.PI).toFixed(1)}°です。</Text>
          <Text>物を鏡に近づければ、像も奥から鏡へ近づきます。すべての点で鏡からの距離だけが反転し、点どうしの間隔は保たれるので、像の大きさは物と等しくなります。</Text>
          <Text size="sm" c="dimmed">ここでは一枚の理想的な平面鏡を扱います。鏡の広さ、端で見えなくなる条件、ガラスの厚さは省きます。正面から見た像の図ではありません。</Text>
          <Button variant="default" onClick={() => { setMirrorDistance(25); setEyeY(-12); setExtensions(true); setNormals(false) }}>鏡の条件を初期化</Button>
        </Stack></div>
        <div className="image-parameters">
          <Parameter label="物の点Aから鏡まで" value={mirrorDistance} min={10} max={40} onChange={setMirrorDistance} />
          <Parameter label="目の位置：図の上下方向（上向きが正）" value={eyeY} min={-16} max={8} onChange={setEyeY} />
        </div>
      </Tabs.Panel>
    </Tabs>
  </Paper>
}
