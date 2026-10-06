import { Button, Group, SegmentedControl, Slider, Stack, Tabs, Text, Title } from '@mantine/core'
import { useId } from 'react'
import { imagesLesson } from './meta'
import { observeLens } from './model'
import Leaf from './leaf'

export type ImageExperience = 'magnifier' | 'mirror'

export function LeafView({ distance, lensVisible }: { distance: number; lensVisible: boolean }) {
  const id = useId()
  const objectDistance = distance / 100
  const image = observeLens({ focalLength: .1, objectDistance, objectHeight: .002 })
  // Compare h'/L' with h/L at the SAME object/eye positions, in the small-angle limit.
  // This is not a magnifier rating relative to a 25 cm near point.
  const eyeDistance = .4
  const plainSize = 35 * (.475 / (eyeDistance + objectDistance))
  const size = lensVisible ? plainSize * image.magnification! * (eyeDistance + objectDistance) / (eyeDistance - image.imageDistance!) : plainSize
  return <figure className="image-experience-figure">
    <svg viewBox="0 0 620 300" role="img" aria-label={lensVisible ? '同じ葉を虫めがねでのぞく模式表示。葉脈の間隔が広く見える。' : '虫めがねを外して、同じ位置から葉を見る模式表示。'}>
      <defs><clipPath id={`${id}-lens`}><circle cx="310" cy="149" r="95" /></clipPath></defs>
      <rect x="14" y="14" width="592" height="272" rx="14" fill="#f6f4ee" />
      <path d="M30 256H592" stroke="#d8d4ca" strokeWidth="2" />
      <Leaf x={310} y={149 + plainSize / 2} height={plainSize} />
      {lensVisible && <>
        <path d="M375 218L420 263" stroke="#687164" strokeWidth="22" strokeLinecap="round" />
        <g clipPath={`url(#${id}-lens)`}><circle cx="310" cy="149" r="95" fill="#fffdf7" /><Leaf x={310} y={149 + size / 2} height={size} /></g>
        <circle cx="310" cy="149" r="97" fill="none" stroke="#687164" strokeWidth="8" />
      </>}
      <text x="310" y="40" textAnchor="middle">{lensVisible ? '虫めがねでのぞく' : 'そのまま見る'}</text>
    </svg>
    <figcaption>目までの距離も含めて、見える大きさを比べる近似です。小さな葉先を理想レンズで見る図で、写真やぼけの再現ではありません。</figcaption>
  </figure>
}

export function MirrorLeafView({ distance }: { distance: number }) {
  const shift = distance * 4
  return <figure className="image-experience-figure">
    <svg viewBox="0 0 620 300" role="img" aria-label={`机の鏡と同じ葉を上から見る配置図。葉は手前${distance}cm、見える葉は奥${distance}cm。`}>
      <rect x="12" y="14" width="596" height="272" rx="14" fill="#f6f4ee" />
      <rect x="310" y="40" width="290" height="224" fill="#edf2e8" />
      <line x1="310" x2="310" y1="46" y2="248" stroke="#687164" strokeWidth="8" />
      <Leaf x={310 - shift} y={172} height={60} /><Leaf x={310 + shift} y={172} height={60} reflected />
      <text x="310" y="32" textAnchor="middle">鏡</text>
      <text x="150" y="220" textAnchor="middle">鏡の前の葉</text><text x="470" y="220" textAnchor="middle">鏡の向こうに見える葉</text>
    </svg>
    <figcaption>机の上を上から描いた位置の模式図です。鏡の向こうにもう一枚の葉があるわけではありません。正面から見た景色とは区別します。</figcaption>
  </figure>
}

export default function ImageObservation({ experience, onExperienceChange, distance, onDistanceChange, mirrorDistance, onMirrorDistanceChange, lensVisible, onLensVisibleChange }: {
  experience: ImageExperience; onExperienceChange: (experience: ImageExperience) => void
  distance: number; onDistanceChange: (distance: number) => void
  mirrorDistance: number; onMirrorDistanceChange: (distance: number) => void
  lensVisible: boolean; onLensVisibleChange: (visible: boolean) => void
}) {
  const id = useId()
  return <Stack gap="sm" className="image-opening">
    <Text className="eyebrow">今回理解すること</Text>
    <Title order={2}>道具を変えると、同じ葉が違って見える。</Title>
    <Text>{imagesLesson.learningGoal.understand}</Text>
    <Text><strong>身近な行為から考える。</strong>{imagesLesson.startingPoint.scene}</Text>
    <Tabs value={experience} onChange={value => { if (value === 'magnifier' || value === 'mirror') onExperienceChange(value) }}>
      <Tabs.List grow><Tabs.Tab value="magnifier">虫めがねをのぞく</Tabs.Tab><Tabs.Tab value="mirror">鏡に近づける</Tabs.Tab></Tabs.List>
      <Tabs.Panel value="magnifier" pt="sm">
        <LeafView distance={distance} lensVisible={lensVisible} />
        <Group grow><SegmentedControl fullWidth aria-label="虫めがねを使うか" value={lensVisible ? 'with' : 'without'} onChange={value => onLensVisibleChange(value === 'with')} data={[{ value: 'without', label: 'そのまま見る' }, { value: 'with', label: '虫めがねを使う' }]} /></Group>
        <Text id={`${id}-distance`} size="sm" mt="md" mb="xs">葉と虫めがねの間隔を変える</Text>
        <Slider aria-labelledby={`${id}-distance`} value={distance} min={5} max={7.5} step={.5} onChange={onDistanceChange} label={null} marks={[{ value: 5, label: '近づける' }, { value: 7.5, label: '少し離す' }]} />
        <Text mt="xl" role="status">{lensVisible ? 'この近さでは、葉の向きはそのまま、葉脈の間隔が広く見えます。虫めがねを外すと元の見え方へ戻ります。葉そのものは大きくなっていません。' : '葉と目の位置を保って、虫めがねだけを外しました。同じ葉を比べています。'}</Text>
      </Tabs.Panel>
      <Tabs.Panel value="mirror" pt="sm">
        <MirrorLeafView distance={mirrorDistance} />
        <Text id={`${id}-mirror`} size="sm" mb="xs">葉を鏡に近づけたり、離したりする</Text>
        <Slider aria-labelledby={`${id}-mirror`} value={mirrorDistance} min={10} max={40} step={1} onChange={onMirrorDistanceChange} label={null} marks={[{ value: 10, label: '近づける' }, { value: 40, label: '離す' }]} />
        <Text mt="xl" role="status">鏡に近づけると、向こうに見える葉も鏡へ近づきます。見える位置までの奥行きは、手前の葉と鏡の間隔に対応しています。</Text>
      </Tabs.Panel>
    </Tabs>
    <Text>{imagesLesson.overview}</Text>
    <Text size="sm" c="dimmed">扱う範囲：{imagesLesson.learningGoal.scope}</Text>
    <Button component="a" href="#mechanism" variant="light" w="fit-content">同じ葉と道具で、理由を見る ↓</Button>
  </Stack>
}
