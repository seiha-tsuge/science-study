import { Button, Group, Paper, Slider, Text, Title } from '@mantine/core'
import { useId, useState } from 'react'
import { accelerationDisplacementParts, observeAcceleration } from './model'

const layers = ['最初からある速度', '加速度で増えた速度', '二つを重ねる'] as const

export default function AccumulationDiagram() {
  const [layer, setLayer] = useState(2)
  const [time, setTime] = useState(4)
  const [acceleration, setAcceleration] = useState(1)
  const id = useId()
  const parameters = { initialPosition: 0, initialVelocity: 2, acceleration }
  const observation = observeAcceleration(parameters, time)
  const parts = accelerationDisplacementParts(parameters, time)
  // Fixed display scale across all conditions: t = 0..8 s, v = 0..18 m/s.
  const x = (t: number) => 64 + t * 54
  const y = (v: number) => 284 - v * 12
  const captions = [
    '青の長方形は、高さが開始時の速度2 m/s、横幅が選んだ時間です。時間を2倍にすると横幅だけが2倍になるため、面積が表す位置の差も2倍になります。',
    '緑の三角形は、後から増えた速度の分です。底辺は時間 t、高さは速度の増加 at。時間を2倍にすると両方が2倍になり、面積は4倍になります。',
    '青の長方形と緑の三角形を合わせた面積が、出発時からの位置の差です。この差を「変位」と呼びます。二つの部分に分けると、時間だけが伸びる分と、高さも増える分を比べられます。',
  ]
  return (
    <Paper withBorder p={{ base: 'md', sm: 'xl' }} className="mechanism-panel">
      <Title order={3}>進む量を、長方形と三角形に分ける</Title>
      <Text mt="sm">横軸は時間、縦軸は速度です。速度2 m/sが1秒続けば、右へ2 m進みます。グラフでは「高さ2 m/s × 横幅1 s」の長方形で表せます。</Text>
      <Text mt="sm">速度が変わる場合は、時間を細かく分け、各区間の進む量を足します。区間を限りなく細かくすると、長方形の集まりは線の下の面積になります。この図では、開始時の速度の分を青、後から増えた分を緑に分けています。</Text>
      <Group mt="lg" gap="xs" aria-label="面積の見方">
        {layers.map((label, index) => <Button key={label} variant={layer === index ? 'light' : 'default'} aria-pressed={layer === index} onClick={() => setLayer(index)}>{label}</Button>)}
      </Group>
      <svg className="concept-visual" viewBox="0 0 560 330" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
        <title id={`${id}-title`}>速度と時間の面積を長方形と三角形に分ける</title>
        <desc id={`${id}-desc`}>横軸は時間、縦軸は速度。開始時の速度2 m/s、加速度{acceleration} m/s²、時間{time}秒。青の長方形は{parts.initialVelocityPart} m、緑の三角形は{parts.accelerationPart} m、合わせた変位は{observation.position} mです。</desc>
        {[0, 4, 8, 12, 16].map(v => <g key={v}><line x1="64" x2="496" y1={y(v)} y2={y(v)} stroke="#dbe6f4"/><text x="52" y={y(v) + 5} textAnchor="end">{v}</text></g>)}
        {layer !== 1 && <rect x="64" y={y(2)} width={x(time) - 64} height={y(0) - y(2)} fill="#bfdbfe" stroke="#2563eb"/>}
        {layer !== 0 && <path d={`M64,${y(2)} L${x(time)},${y(observation.velocity)} L${x(time)},${y(2)} Z`} fill="#a7e0d0" stroke="#147a65"/>}
        <path d={`M64,${y(2)} L${x(time)},${y(observation.velocity)}`} fill="none" stroke="#26364b" strokeWidth="3"/>
        <line x1="64" x2="496" y1={y(2)} y2={y(2)} stroke="#617086" strokeDasharray="4 4"/>
        <text x="550" y={y(2) - 5} textAnchor="end">開始時 2 m/s</text>
        <path d="M64 50 V284 H496" fill="none" stroke="#617086"/>
        {[0, 2, 4, 6, 8].map(t => <text key={t} x={x(t)} y="306" textAnchor="middle">{t}</text>)}
        <text x="12" y="25">速度 [m/s]</text><text x="496" y="326" textAnchor="end">時間 [s]</text>
        <circle cx={x(time)} cy={y(observation.velocity)} r="5" fill="#26364b"/>
      </svg>
      <Text className="mechanism-caption" role="status">{captions[layer]}</Text>
      <Text size="sm" mb="sm">開始からの時間 t：{time} s</Text>
      <Slider min={0} max={8} step={0.5} value={time} onChange={setTime} thumbLabel="開始からの時間" label={t => `${t} s`}/>
      <Text size="sm" mt="lg">加速度 a：速度が1秒ごとにどれだけ増えるかを選びます。</Text>
      <Group mt="sm" gap="xs" aria-label="面積図の加速度">
        {[0, 1, 2].map(a => <Button key={a} variant={acceleration === a ? 'light' : 'default'} aria-pressed={acceleration === a} onClick={() => setAcceleration(a)}>a = {a} m/s²</Button>)}
        <Button variant="subtle" onClick={() => { setTime(4); setAcceleration(1); setLayer(2) }}>図を初期値に戻す</Button>
      </Group>
      <Text mt="md">青の長方形：{parts.initialVelocityPart.toFixed(1)} m ＋ 緑の三角形：{parts.accelerationPart.toFixed(1)} m ＝ 変位 {observation.position.toFixed(1)} m</Text>
      <Text size="sm" c="dimmed" mt="md">開始時の速度2 m/s、出発点0 mの式を面積で表した図です。下の運動の条件とは独立しています。ボタンは面積の内訳、時間スライダーは足し合わせる区間を選びます。軸の縮尺は固定です。</Text>
    </Paper>
  )
}
