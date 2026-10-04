import { Button, Group, Paper, Text, Title } from '@mantine/core'
import { useId, useState } from 'react'
import { constructRefractionWavefront, media } from './model'

const scenes = ['境界への到達', '同じ時間に進む距離', '新しい波面と向き'] as const

export default function WavefrontDiagram() {
  const [scene, setScene] = useState(2)
  const [angle, setAngle] = useState(45)
  const [medium, setMedium] = useState<'water' | 'glass'>('water')
  const id = useId()
  // A 1 m construction is geometric; it is not a wavelength or apparatus size.
  const construction = constructRefractionWavefront({ incidentAngle: angle * Math.PI / 180, incidentIndex: 1, transmittedIndex: media[medium].index })!
  const x = (value: number) => 220 + 280 * value
  const y = (value: number) => 215 - 280 * value
  const b = construction.incidentStart
  const c = construction.tangentPoint
  const radius = 280 * construction.radius
  const captions = [
    angle === 0 ? '青い波面は境界と平行です。AとBが同時に境界へ届くため、片側だけが先に遅くなる時間はありません。' : 'Aは境界に着いていますが、Bはまだ空気中にあります。青の線は、波の一つの山に相当する場所の並びです。この線が、到着時の波面の断面です。',
    angle === 0 ? 'この作図の到達時間差は0です。その後は波面全体が新しい速さで進みます。速さは変わっても左右の差がないので向きは変わりません。' : `Bが境界へ届くまでの同じ時間に、Aからの波は${media[medium].name}へ広がります。緑の半円の半径は「進む先の速さ×同じ時間」です。空気中より遅いので、BからB′までの青の破線より短くなります。`,
    angle === 0 ? '新しい波面も境界と平行です。波面に垂直な光線は真っすぐ進みます。曲がるためには、斜めの到達と速さの違いの両方が必要です。' : '緑の半円に触れ、B′を通る緑の直線が、次の波面の断面です。新しい波面に90°の緑の矢印が、光の進む向きです。半円の半径が変わると、接する直線と光の向きも変わります。',
  ]
  return (
    <Paper withBorder p={{ base: 'md', sm: 'xl' }} className="mechanism-panel">
      <Title order={3}>同じ時間に進む距離から、次の波面を作る</Title>
      <Text mt="sm">Bが境界へ届く間に、先に届いたAからの波は進む先の物質をどれだけ進むでしょうか。その距離を半円の半径で示すと、屈折後の向きを作図できます。波の一つの山に相当する場所がつくる面が「波面」で、青と緑の直線はその断面です。</Text>
      <Text mt="sm">波面上の各点から広がる波を考え、それらに接する面を次の波面とする見方を「ホイヘンスの作図」と呼びます。ここではAからの波と、Bが境界へ着く点B′を使います。</Text>
      <Group mt="lg" gap="xs" aria-label="波面の場面">
        {scenes.map((label, i) => <Button key={label} variant={scene === i ? 'light' : 'default'} aria-pressed={scene === i} onClick={() => setScene(i)}>{label}</Button>)}
      </Group>
      <svg className="concept-visual" viewBox="0 0 560 465" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
        <title id={`${id}-title`}>波面の到達時刻と速さの違いから屈折を見る</title>
        <desc id={`${id}-desc`}>空気から{media[medium].name}、入射角{angle}度。{captions[scene]}</desc>
        <defs><marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="#147a65"/></marker></defs>
        <rect x="0" y="215" width="560" height="250" fill="#e5f4ef"/>
        <text x="14" y="24">空気：速い</text><text x="300" y="451">{media[medium].name}：遅い</text>
        <line x1="0" x2="560" y1="215" y2="215" stroke="#617086"/>
        <text x="14" y="203">境界</text>
        <line x1="220" x2="220" y1="35" y2="445" stroke="#8091aa" strokeDasharray="5 5"/>
        <text x="228" y="50">法線</text>
        <line x1={x(0)} y1={y(0)} x2={x(b.x)} y2={y(b.y)} stroke="#2563eb" strokeWidth="4"/>
        <circle cx={x(0)} cy={y(0)} r="5" fill="#2563eb"/><text x="200" y="204">A</text>
        <circle cx={x(b.x)} cy={y(b.y)} r="5" fill="#2563eb"/><text x={x(b.x)+10} y={y(b.y)-12}>B</text>
        {scene >= 1 && <>
          <line x1={x(b.x)} y1={y(b.y)} x2={x(1)} y2={y(0)} stroke="#2563eb" strokeDasharray="6 5" strokeWidth="2"/>
          {radius > 0 && <path d={`M${220-radius},215 A${radius},${radius} 0 0 0 ${220+radius},215`} fill="none" stroke="#147a65" strokeWidth="2"/>}
          <circle cx={x(1)} cy={y(0)} r="5" fill="#26364b"/><text x={x(1)-7} y="239">B′</text>
        </>}
        {scene === 2 && <>
          <line x1={x(c.x)} y1={y(c.y)} x2={x(1)} y2={y(0)} stroke="#147a65" strokeWidth="4"/>
          <line x1={x(0)} y1={y(0)} x2={x(c.x + construction.direction.x * 0.12)} y2={y(c.y + construction.direction.y * 0.12)} stroke="#147a65" strokeWidth="2" markerEnd={`url(#${id}-arrow)`}/>
          <text x={x((c.x + 1) / 2) + 10} y={y(c.y / 2) - 10}>新しい波面</text>
          <text x={x(c.x + construction.direction.x * 0.12) + 10} y={y(c.y + construction.direction.y * 0.12) + 16}>進む向き</text>
        </>}
      </svg>
      <Text className="mechanism-caption" role="status">{captions[scene]}</Text>
      <Text size="sm" mb="sm">角度は、灰色の境界に90°で立つ法線と、光の進む向きとの間で測ります。</Text>
      <Group gap="xs" aria-label="波面図の入射角">
        {[0, 30, 45, 60].map(value => <Button key={value} variant={angle === value ? 'light' : 'default'} aria-pressed={angle === value} onClick={() => setAngle(value)}>波面図 {value}°</Button>)}
      </Group>
      <Group mt="sm" gap="xs" aria-label="波面図の物質">
        {(['water', 'glass'] as const).map(value => <Button key={value} variant={medium === value ? 'light' : 'default'} aria-pressed={medium === value} onClick={() => setMedium(value)}>空気 → {media[value].name}</Button>)}
        <Button variant="subtle" onClick={() => { setAngle(45); setMedium('water'); setScene(2) }}>波面図を初期値に戻す</Button>
      </Group>
      <Text size="sm" c="dimmed" mt="md">作図の段階を切り替える説明図で、物理時刻の再生ではありません。境界上のA–B′間を1 mとして幾何学的な比を示しています。この長さは波長を表しません。半円はAから広がる波（ここでは「二次波」）の断面です。光の粒子の軌道ではありません。下の光線図の条件とは独立しています。反射光・強さ・干渉・全反射時の境界付近の波はこの作図に含みません。</Text>
    </Paper>
  )
}
