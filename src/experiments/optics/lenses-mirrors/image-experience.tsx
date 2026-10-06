import { Button, Group, Paper, SegmentedControl, Slider, Stack, Tabs, Text, Title } from '@mantine/core'
import { useId } from 'react'
import { imagesLesson } from './meta'
import { observeLens, observeMirror } from './model'

export type ImageExperience = 'magnifier' | 'mirror'

function Letter({ x, height, name }: { x: number; height: number; name: string }) {
  const top = 245 - height
  return <g>
    <path d={`M${x} 245 V${top} H${x + height * .55} M${x} ${top + height * .45} H${x + height * .4}`} fill="none" stroke="#343a40" strokeWidth="5" />
    <circle cx={x} cy={top} r="5" fill="#343a40" />
    <rect x={x - 4} y="241" width="8" height="8" fill="#343a40" />
    <text x={x - 12} y={top - 12} textAnchor="end">{name} A</text>
    <text x={x - 12} y="268" textAnchor="end">{name} B</text>
  </g>
}

export default function ImageObservation({ experience, onExperienceChange, distance, onDistanceChange, mirrorDistance, onMirrorDistanceChange, lensVisible, onLensVisibleChange }: {
  experience: ImageExperience; onExperienceChange: (experience: ImageExperience) => void
  distance: number; onDistanceChange: (distance: number) => void
  mirrorDistance: number; onMirrorDistanceChange: (distance: number) => void
  lensVisible: boolean; onLensVisibleChange: (visible: boolean) => void
}) {
  const id = useId()
  const image = observeLens({ focalLength: .1, objectDistance: distance / 100, objectHeight: .002 })
  const magnification = image.magnification ?? 1
  const mirror = observeMirror({ x: -mirrorDistance / 100, y: .08 }, { x: -.34, y: -.12 })
  const number = (value: number) => value.toLocaleString('ja-JP', { maximumFractionDigits: 2 })
  const px = (metres: number) => 310 + metres * 400
  return <Stack gap="md" className="image-opening">
    <Text className="eyebrow">01 — 身近な見え方を、まず比べる</Text>
    <Title order={2}>今回理解すること</Title>
    <Text fw={500}>{imagesLesson.learningGoal.understand}</Text>
    <Text fw={600}>身近な行為から考える</Text>
    <Text>{imagesLesson.startingPoint.scene}</Text>
    <Tabs value={experience} onChange={value => { if (value === 'magnifier' || value === 'mirror') onExperienceChange(value) }}>
      <Tabs.List grow><Tabs.Tab value="magnifier">虫めがねで文字を見る</Tabs.Tab><Tabs.Tab value="mirror">鏡の奥を見る</Tabs.Tab></Tabs.List>
      <Tabs.Panel value="magnifier" pt="md">
        <Title order={3}>同じ文字が、向きを保って大きく見える</Title>
        <Text mt="sm">本に虫めがねを近づけて、同じ文字をのぞく場面です。文字の縦線の上端をA、下端をBと呼びます。元の文字とレンズあり・なしの表示を、同じ縮尺で比べます。文字そのものは変えません。</Text>
        <figure className="image-experience-figure">
          <div className="image-opening-comparison">
          <svg viewBox="0 0 310 290" role="img" aria-label="比較の基準となる、元の文字。縦線の上端Aと下端B。">
            <text x="155" y="32" textAnchor="middle">比較：元の文字</text>
            <rect x="10" y="62" width="290" height="222" rx="8" fill="white" stroke="#adb5bd" />
            <Letter x={145} height={40} name="元の" />
          </svg>
          <svg viewBox="0 0 310 290" role="img" aria-labelledby={`${id}-lens-title ${id}-lens-desc`}>
            <title id={`${id}-lens-title`}>{`元の文字と、${lensVisible ? '虫めがねの像' : 'レンズなしの文字'}の高さを比べる模式図`}</title>
            <desc id={`${id}-lens-desc`}>{lensVisible ? `向きは同じで、像の高さは元の${number(magnification)}倍。` : '両側の高さと向きは同じ。'}Aは縦線の上端、Bは下端です。見える角度や網膜像の再現ではありません。</desc>
            <text x="155" y="32" textAnchor="middle">{lensVisible ? '虫めがね：像の高さ' : 'レンズなし：同じ文字'}</text>
            <rect x="10" y="62" width="290" height="222" rx="8" fill="white" stroke="#adb5bd" />
            <Letter x={145} height={40 * (lensVisible ? magnification : 1)} name={lensVisible ? '像の' : '元の'} />
          </svg>
          </div>
          <figcaption>像の高さの比を、正面から比べる模式図です。写真や目に映る見え方の再現ではなく、見える角度の倍率とは異なります。</figcaption>
        </figure>
        <Paper withBorder p="md" mt="md">
          <Text id={`${id}-lens-control`} fw={600} mb="xs">変えるのは、レンズを通すかどうか</Text>
          <SegmentedControl fullWidth aria-labelledby={`${id}-lens-control`} value={lensVisible ? 'with' : 'without'} onChange={value => onLensVisibleChange(value === 'with')} data={[{ value: 'without', label: 'レンズなし' }, { value: 'with', label: '虫めがねあり' }]} />
          <Text id={`${id}-distance`} fw={600} mt="md">文字からレンズまで：{number(distance)} cm</Text>
          <Text size="sm" mb="md">文字を固定し、レンズとの距離を5〜7.5 cmで変えます。レンズなしでも、この距離の設定は保持します。</Text>
          <Slider thumbLabel="文字からレンズまで（cm）" aria-labelledby={`${id}-distance`} value={distance} min={5} max={7.5} step={.5} onChange={onDistanceChange} label={value => `${value} cm`} marks={[{ value: 5, label: '5 cm' }, { value: 7.5, label: '7.5 cm' }]} />
          <Text mt="xl" aria-live="polite">{lensVisible ? `この条件では像の高さは元の${number(magnification)}倍です。元のAが上、像のAも上で、文字自体が大きくなったわけではありません。` : 'レンズを外すと、比較の表示も元の文字と同じ高さです。文字の位置と形、距離の設定は保っています。'}</Text>
        </Paper>
        <Text size="sm" mt="md">空気中の理想的な薄い凸レンズ（焦点距離10 cm）で計算しています。目とレンズの距離による見かけの大きさ、ぼけや明るさは再現しません。</Text>
      </Tabs.Panel>
      <Tabs.Panel value="mirror" pt="md">
        <Title order={3}>鏡に近づけると、奥の位置も近づく</Title>
        <Text mt="sm">文字を鏡に近づける場面です。文字の縦線の上端をAと呼び、上からの配置図で、Aと鏡の奥にあるように見える位置を比べます。文字の上下方向はこの図に描いていません。</Text>
        <figure className="image-experience-figure">
          <svg viewBox="0 0 620 320" role="img" aria-labelledby={`${id}-mirror-title ${id}-mirror-desc`}>
            <title id={`${id}-mirror-title`}>文字の点Aと、鏡の奥に見える位置の比較</title>
            <desc id={`${id}-mirror-desc`}>Aは鏡の手前{mirrorDistance} cm、像は奥{mirrorDistance} cm。鏡からの距離は等しく、奥に文字が移動したわけではありません。</desc>
            <rect x="308" y="65" width="6" height="215" fill="#868e96" />
            <text x="310" y="38" textAnchor="middle">鏡</text>
            <circle cx={px(-mirrorDistance / 100)} cy="158" r="7" fill="#343a40" />
            <circle cx={px(mirror.image.x)} cy="158" r="7" fill="white" stroke="#343a40" strokeWidth="2" />
            <text x="150" y="114" textAnchor="middle">元のA</text>
            <text x="470" y="210" textAnchor="middle">奥に見えるA</text>
            <path d={`M${px(-mirrorDistance / 100)} 245 H300 M320 245 H${px(mirror.image.x)}`} fill="none" stroke="#495057" />
            <text x="150" y="303" textAnchor="middle">手前 {mirrorDistance} cm</text>
            <text x="470" y="303" textAnchor="middle">奥 {mirrorDistance} cm</text>
          </svg>
          <figcaption>上から見た位置の模式図です。黒い丸は元のA、白い丸は鏡の奥に見えるAです。白い丸は実物でも光が集まる場所でもありません。</figcaption>
        </figure>
        <Paper withBorder p="md" mt="md">
          <Text id={`${id}-mirror-control`} fw={600}>文字から鏡まで：{mirrorDistance} cm</Text>
          <Text size="sm" mb="md">鏡と目を固定し、文字だけを近づけたり離したりします。</Text>
          <Slider thumbLabel="文字から鏡まで（cm）" aria-labelledby={`${id}-mirror-control`} value={mirrorDistance} min={10} max={40} step={1} onChange={onMirrorDistanceChange} label={value => `${value} cm`} marks={[{ value: 10, label: '10 cm' }, { value: 40, label: '40 cm' }]} />
          <Text mt="xl" aria-live="polite">手前{mirrorDistance} cmと奥{mirrorDistance} cmが対応します。鏡に近づけると、奥に見える位置も同じだけ鏡へ近づきます。</Text>
        </Paper>
        <Text size="sm" mt="md">十分広い平面鏡の位置関係です。正面からの見え方、鏡の縁やガラスの厚さは再現しません。</Text>
      </Tabs.Panel>
    </Tabs>
    <Title order={3}>{imagesLesson.question}</Title>
    <Text>{imagesLesson.overview}</Text>
    <Text size="sm">扱う範囲：{imagesLesson.learningGoal.scope}</Text>
    <Group><Button component="a" href="#mechanism" variant="light" onClick={() => onExperienceChange(experience)}>同じ条件の光の道筋へ ↓</Button></Group>
    <Paper withBorder p="md">
      <Title order={3} size="h4">眼鏡は、文字を大きくすることと同じ？</Title>
      <Text mt="sm">虫めがねでは、近い文字の大きな像をのぞきます。眼鏡の補正は、目に入る前の光を調整して、目の奥の光を受ける面（網膜）に像が合うようにすることです。</Text>
      <Text size="sm" mt="sm">近視の補正では、遠くの物から来る光を凹レンズで広げる方向へ変え、網膜より手前へ集まりすぎるのを補います。遠視の補正では、凸レンズで光を集める方向へ変え、網膜までに集まりきらないのを補います。どちらも「文字を大きくすれば補正できる」という関係ではありません。</Text>
      <Text size="sm" mt="sm">この教材の操作図は虫めがねと平面鏡を扱います。眼鏡の度数、目のピント調節や網膜への結像の計算は、この先の眼の光学です。</Text>
    </Paper>
  </Stack>
}
