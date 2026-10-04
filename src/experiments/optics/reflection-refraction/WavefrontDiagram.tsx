import { Accordion, Badge, Button, Group, NativeSelect, Paper, SegmentedControl, Switch, Tabs, Text, Title } from '@mantine/core'
import { useId, useState } from 'react'
import { constructRefractionWavefront, media } from './model'
import './wave-primer.css'

const scenes = ['境目に届く', '距離を比べる', '次の波面'] as const

export default function WavefrontDiagram() {
  const [scene, setScene] = useState(0)
  const [angle, setAngle] = useState(45)
  const [medium, setMedium] = useState<keyof typeof media>('water')
  const [normal, setNormal] = useState(false)
  const id = useId()
  // A–B′ = 1 m is a geometric scale, not a wavelength or apparatus size.
  const construction = constructRefractionWavefront({ incidentAngle: angle * Math.PI / 180, incidentIndex: 1, transmittedIndex: media[medium].index })!
  const x = (value: number) => 240 + 260 * value
  const y = (value: number) => 215 - 260 * value
  const b = construction.incidentStart
  const c = construction.tangentPoint
  const direction = construction.direction
  const tangent = { x: -direction.y, y: direction.x }
  const radius = 260 * construction.radius
  const incidentDistance = Math.hypot(1 - b.x, b.y)
  const refractedAngle = Math.atan2(direction.x, -direction.y) * 180 / Math.PI
  const captions = [
    angle === 0 ? '青い線ABは境目と平行です。AとBが同時に届くので、この作図の到着時刻の差は0です。' : 'Aは境目に着いています。青い線ABのもう一方の端Bは、まだ空気中です。Bが境目へ届くまで、A側だけが進む先の速さで進みます。',
    angle === 0 ? '同時到着ではΔt = 0なので、到着直後の進行距離も半円の半径も0です。ここでは大きさのある半円を描きません。その後は列全体が新しい速さで進みます。' : medium === 'air' ? '青い破線BB′と緑の半円の半径は同じ長さです。同じ時間に、両側が同じ速さで進むためです。半円はAから広がる波の断面で、粒子の通り道ではありません。' : `Bは青い破線に沿ってB′へ届きます。その間にAから${media[medium].name}へ広がる波は、緑の半円の半径だけ進みます。同じ時間でも、進む先では遅いため、この半径はBB′より短くなります。`,
    angle === 0 ? '到着直後の波面は境目と平行です。その後も列全体が平行に進むので、黒い光の矢印の向きは変わりません。' : medium === 'air' ? 'B′から半円に接する線を引くと、緑の線CB′は最初の青い線ABと平行になります。同じ速さなら、斜めに届いても光の向きは変わりません。' : `B′から半円に接する緑の線CB′を引きます。この線が次の波面の断面です。半円が小さい分、最初の青い線ABと傾きが変わり、波面に90°の光の向きも変わります。${media[medium].name}では法線に近い${refractedAngle.toFixed(1)}°へ進みます。`,
  ]
  return (
    <Paper p={{ base: 0, sm: 'md' }}>
      <Group justify="space-between" mb="sm"><Title order={3}>同じ時間の距離から、曲がる向きを作る</Title><Badge variant="light">幾何学の作図</Badge></Group>
      <Text size="sm" c="dimmed">本筋の「先に届く側が遅れる」を、長さで確かめる図です。青い線と緑の線は、一つの山に相当する場所がつくる面（波面）の断面です。</Text>
      <Tabs value={String(scene)} onChange={value => { if (value !== null) setScene(Number(value)) }}>
        <Tabs.List className="wavefront-scenes" aria-label="波面の作図の段階">
          {scenes.map((label, index) => <Tabs.Tab key={label} value={String(index)}>{index + 1}. {label}</Tabs.Tab>)}
        </Tabs.List>
        <Tabs.Panel value={String(scene)} pt="lg">
          <Title order={4}>{(angle === 0 ? ['AとBが、同時に境目へ届く', '到着時刻の差が0なら、半径も0', '同時に進む波面は、向きを変えない'] : ['Aが先に届き、Bはまだ空気中にある', 'Bが届くまでの時間で、二つの距離を比べる', 'B′から半円へ接する線を引く'])[scene]}</Title>
          {angle === 0 && <Text mt="sm">0°では左右が同時に届きます。各段階で、この違いを比べられます。</Text>}
          <div className="wave-workspace">
            <div className="wave-tools">
              <Text size="sm" fw={600} mb="xs" id={`${id}-angle`}>境目へ届く光の角度</Text>
              <SegmentedControl fullWidth aria-labelledby={`${id}-angle`} value={String(angle)} onChange={value => setAngle(Number(value))} data={[0, 30, 45, 60].map(value => ({ value: String(value), label: `${value}°` }))} />
              <Text size="sm" c="dimmed" mt="sm">境目に90°で立つ法線から測ります。0°は、境目へまっすぐ届く向きです。</Text>
              <NativeSelect mt="md" label="空気から進む先" value={medium} onChange={event => setMedium(event.currentTarget.value as keyof typeof media)} data={[{ value: 'water', label: '水（空気より遅い）' }, { value: 'glass', label: 'ガラス（さらに遅い）' }, { value: 'air', label: '空気（同じ速さを比べる）' }]} />
              <Switch mt="md" label="角度の基準線（法線）を重ねる" checked={normal} onChange={event => setNormal(event.currentTarget.checked)} />
              {scene >= 1 && <Paper withBorder p="md" mt="lg">
                <Text size="sm" fw={600}>同じ経過時間 Δt</Text>
                <Text mt="xs">{(construction.elapsedTime * 1e9).toFixed(2)} ns（ナノ秒）</Text>
                <Text size="sm" mt="md">空気中の距離 BB′：{incidentDistance.toFixed(3)} m</Text>
                <Text size="sm" mt="xs">進む先の半径：{construction.radius.toFixed(3)} m</Text>
                <Text size="sm" c="dimmed" mt="sm">同じ時間 × それぞれの速さ。条件を変えても、境目のA–B′間は1 mで固定しています。</Text>
              </Paper>}
              <Button variant="default" mt="lg" onClick={() => { setAngle(45); setMedium('water'); setScene(0); setNormal(false) }}>作図を初期値に戻す</Button>
            </div>
            <div className="wave-display">
              <svg className="wave-visual" viewBox="0 0 560 460" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
                <title id={`${id}-title`}>波面の作図：{scenes[scene]}</title>
                <desc id={`${id}-desc`}>空気から{media[medium].name}、入射角{angle}度。{captions[scene]}</desc>
                <defs><marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="context-stroke" /></marker></defs>
                <rect x="0" y="215" width="560" height="245" fill="#e5f4ef" />
                <text x="20" y="30">空気</text><text x="20" y="437">{media[medium].name}</text>
                <line x1="0" x2="560" y1="215" y2="215" stroke="#617086" strokeWidth="2" />
                <text x="20" y="200">境目</text>
                {normal && <><line x1={x(0)} x2={x(0)} y1="35" y2="435" stroke="#617086" strokeDasharray="4 5" /><text x={x(0) + 10} y="55">法線</text><path d={`M${x(0)} 195 h20 v20`} fill="none" stroke="#617086" /></>}
                <line x1={x(0)} y1={y(0)} x2={x(b.x)} y2={y(b.y)} stroke="#2563eb" strokeWidth={scene === 0 ? 4 : 2} />
                {scene === 0 && <line x1={x(b.x - Math.sin(angle * Math.PI / 180) * 0.22)} y1={y(b.y + Math.cos(angle * Math.PI / 180) * 0.22)} x2={x(b.x)} y2={y(b.y)} stroke="#26364b" strokeWidth="2" markerEnd={`url(#${id}-arrow)`} />}
                <circle cx={x(0)} cy={y(0)} r="5" fill="#2563eb" /><text x={x(0) - 24} y="204">A</text>
                <circle cx={x(b.x)} cy={y(b.y)} r="5" fill="#2563eb" /><text x={angle === 0 ? x(b.x) - 8 : x(b.x) + 10} y={y(b.y) - 12} textAnchor={angle === 0 ? 'end' : 'start'}>{angle === 0 && scene >= 1 ? 'B = B′' : 'B'}</text>
                {scene >= 1 && <>
                  <line x1={x(b.x)} y1={y(b.y)} x2={x(1)} y2={y(0)} stroke="#2563eb" strokeDasharray="6 5" strokeWidth="3" />
                  {radius > 0 && <>
                    <path d={`M${x(0) - radius},215 A${radius},${radius} 0 0 0 ${x(0) + radius},215`} fill="none" stroke="#147a65" strokeWidth="2" />
                    <line x1={x(0)} y1="215" x2={scene === 1 ? x(0) : x(c.x)} y2={scene === 1 ? 215 + radius : y(c.y)} stroke="#147a65" strokeDasharray="3 4" strokeWidth="3" />
                    {scene === 1 && <text x={x(0) + 14} y={230 + radius / 2}>半径</text>}
                  </>}
                  {angle !== 0 && <><circle cx={x(1)} cy={y(0)} r="5" fill="#26364b" /><text x={x(1) - 7} y="240">B′</text></>}
                </>}
                {scene === 2 && <>
                  <line x1={x(c.x)} y1={y(c.y)} x2={x(1)} y2={y(0)} stroke="#147a65" strokeWidth="4" />
                  <line x1={x(c.x)} y1={y(c.y)} x2={x(c.x + direction.x * 0.25)} y2={y(c.y + direction.y * 0.25)} stroke="#26364b" strokeWidth="3" markerEnd={`url(#${id}-arrow)`} />
                  {angle !== 0 && <><circle cx={x(c.x)} cy={y(c.y)} r="5" fill="#147a65" /><text x={x(c.x) - 24} y={y(c.y) + 10}>C</text></>}
                  <path d={`M${x(c.x + tangent.x * 0.055)},${y(c.y + tangent.y * 0.055)} L${x(c.x + tangent.x * 0.055 - direction.x * 0.055)},${y(c.y + tangent.y * 0.055 - direction.y * 0.055)} L${x(c.x - direction.x * 0.055)},${y(c.y - direction.y * 0.055)}`} stroke="#617086" fill="none" />
                  <text x="335" y="410">黒：光の向き</text>
                </>}
              </svg>
              <Text size="sm" c="dimmed" mb="md">青の実線AB：到着時の波面。{scene >= 1 && '青の破線BB′：空気中で進む距離。'}{scene === 2 && '緑の実線：次の波面。四角の印：90°。'}</Text>
              <Paper withBorder p="md"><Text size="sm" fw={600}>図のここを見る</Text><Text mt="sm" role="status">{captions[scene]}</Text>
                {scene === 2 && <Text size="sm" mt="sm">{angle === 0 ? '到着時刻の差がない場合です。速さの変化だけでは向きは変わりません。' : 'Cは、半円と緑の線が触れる点です。A–Cの半径は、この接する線に90°で、光の進む向きに対応します。'} 境目に対する法線と、波面に対する光の向きは、基準となる面が異なります。</Text>}
              </Paper>
            </div>
          </div>
          <Group justify="space-between" mt="lg"><Button variant="subtle" disabled={scene === 0} onClick={() => setScene(scene - 1)}>← 前の段階</Button><Button variant="light" disabled={scene === 2} onClick={() => setScene(scene + 1)}>{scene === 0 ? '同じ時間の距離を見る →' : scene === 1 ? '接する線を引く →' : '最後の段階'}</Button></Group>
        </Tabs.Panel>
      </Tabs>
      <Accordion variant="separated" mt="lg"><Accordion.Item value="scope"><Accordion.Control>半円を使う理由・式・作図の範囲</Accordion.Control><Accordion.Panel>
        <Text size="sm">波面の各点から小さな波が広がると考え、それらに接する面を次の波面とする見方が「ホイヘンスの作図」です。各点からの波を「二次波」と呼びます。ここでは、先に届いたAからの半円と、Bが境目へ届いたB′だけで、平らな次の波面を決めています。</Text>
        <Text size="sm" mt="sm">空気中の距離BB′ = v₁Δt、進む先の半径AC = v₂Δt。v₁・v₂は速さ [m/s]、Δtは経過時間 [s]です。二つの直角三角形の共通の辺A–B′を使うと、sin θ₁ = BB′/AB′、sin θ₂ = AC/AB′。比を取ると sin θ₂ / sin θ₁ = v₂/v₁、つまりスネルの法則につながります。0°では両方の距離が0なので、この比の割り算は使わず同時到着として扱います。</Text>
        <Text size="sm" mt="sm">境目のA–B′間を1 mとして比を示します。この長さは波長ではありません。1 ns = 10⁻⁹ s。空気1.00、水1.33、ガラス1.50の屈折率から速さを計算しています。作図の段階を選ぶ静止図で、物理時刻の再生や実測ではありません。</Text>
        <Text size="sm" mt="sm">平らな境目と、一様・等方的で光を吸収しない物質を仮定します。反射光、強さ、干渉、全反射時の境界付近の波、速さが決まる電磁的な詳細は扱いません。下の光線図とは条件が独立しています。</Text>
      </Accordion.Panel></Accordion.Item></Accordion>
    </Paper>
  )
}
