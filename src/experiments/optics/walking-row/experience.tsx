import { Button, Group, SegmentedControl, Slider, Switch, Text, Title } from '@mantine/core'
import { useId, useState } from 'react'
import { observeWalkingRow } from '../reflection-refraction/model'
import { useWavePresentation } from '../reflection-refraction/use-wave-presentation'

const clothes = ['#ab653b', '#607976', '#607976', '#607976', '#347a8c']

function Person({ index, x, y }: { index: number; x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <ellipse cy="3" rx="13" ry="4" fill="#233b3b" opacity=".1" />
    <path d="M-4 -18L-8 -3M4 -18L8 -3" fill="none" stroke="#394a4a" strokeWidth="5" strokeLinecap="round" />
    <path d="M-9 -35L-16 -20M9 -35L16 -20" fill="none" stroke={clothes[index]} strokeWidth="6" strokeLinecap="round" />
    <path d="M-8 -37Q0 -41 8 -37L10 -17H-10Z" fill={clothes[index]} />
    <circle cy="-47" r="8" fill="#d6b89a" /><path d="M-8 -48Q-5 -59 5 -54L8 -48" fill="#3d4948" />
    <circle r="3.5" fill="white" stroke="#2e7467" strokeWidth="2" />
    {(index === 0 || index === 4) && <g transform={`translate(${index === 0 ? -30 : 30} -34)`}><circle r="13" fill={clothes[index]} /><text y="5" textAnchor="middle" className="row-person-label">{index === 0 ? 'A' : 'B'}</text></g>}
  </g>
}

export function WalkingRow() {
  const [slanted, setSlanted] = useState(true)
  const [slower, setSlower] = useState(true)
  const clock = useWavePresentation()
  const id = useId()
  const people = observeWalkingRow(clock.time / 8 * 1.5, slanted, slower)
  const x = (value: number) => 300 + value * 165
  const y = (value: number) => 220 - value * 165
  const path = (points: readonly { x: number; y: number }[]) => points.map((point, i) => `${i ? 'L' : 'M'}${x(point.x)},${y(point.y)}`).join(' ')
  const middle = slanted ? 3 : 4
  const phase = !people[0].inSand ? '全員が道の上' : !people[4].inSand ? 'Aは砂地、Bはまだ道' : '全員が砂地に入った'
  const reason = !slower ? '道でも砂地でも速さが同じなら、AとBは同じ時間に同じ距離だけ進みます。境目を通っても、列の向きは変わりません。' : !slanted ? '全員が同時に砂地へ入り、同時に遅くなります。左右に進む距離の差が付かないため、列の向きは変わりません。' : !people[0].inSand ? 'AもBも、道の上を同じ速さで進んでいます。「片側が入る」で、Aだけが砂地へ入った場面を比べられます。' : people[4].inSand ? 'AはBより先に砂地へ入り、長い時間ゆっくり進みました。その距離の差が、今の列を傾けています。' : 'Aは砂地でゆっくり進み、Bはまだ道を速く進みます。同じ時間に進む距離の差が、列を傾け始めます。'
  return <div className="walking-row-experiment">
    <figure className="row-stage">
      <div className="row-stage-heading"><span>道から砂地へ</span><span className="row-stage-state">{phase}</span></div>
      <div className="row-canvas">
        <svg viewBox="0 0 600 400" role="img" aria-label={`人の列が道から砂地へ歩く模式図。${phase}。個人の歩く向きは同じで、足元の丸を結んだ列の向きを比べる。`}>
          <defs>
            <pattern id={`${id}-road`} width="45" height="45" patternUnits="userSpaceOnUse"><path d="M45 0H0V45" fill="none" stroke="#c7d1cd" strokeWidth=".6" opacity=".45" /></pattern>
            <pattern id={`${id}-sand`} width="30" height="24" patternUnits="userSpaceOnUse"><circle cx="5" cy="7" r="1" fill="#ba9b69" opacity=".35" /><circle cx="22" cy="19" r=".8" fill="#ba9b69" opacity=".25" /><path d="M16 5l3 1" stroke="#c4a879" opacity=".35" /></pattern>
            <marker id={`${id}-direction`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#5c7470" /></marker>
          </defs>
          <rect width="600" height="220" fill="#e8eeea" /><rect width="600" height="220" fill={`url(#${id}-road)`} />
          <rect y="220" width="600" height="180" fill="#f0e4cc" /><rect y="220" width="600" height="180" fill={`url(#${id}-sand)`} />
          <path d="M0 220H600" stroke="#b2bba9" strokeWidth="2" />
          <text x="110" y="38" className="row-ground-label">舗装された道</text><text x="110" y="375" className="row-ground-label">砂地</text>
          <g className="row-direction"><text x="432" y="38">歩く向き</text><path d={`M465 60l${people[0].direction.x * 46} ${-people[0].direction.y * 46}`} stroke="#5c7470" strokeWidth="2" fill="none" markerEnd={`url(#${id}-direction)`} /></g>
          <path d={path(people.map(person => person.start))} fill="none" stroke="#899792" strokeDasharray="7 7" strokeWidth="2.5" />
          {people.map((person, i) => <path key={i} d={`M${x(person.start.x)} ${y(person.start.y)}L${x(person.x)} ${y(person.y)}`} fill="none" stroke="#899792" strokeDasharray="2 6" strokeWidth="1.5" />)}
          <path d={path(people)} fill="none" stroke="#2e7467" strokeWidth="4" strokeLinecap="round" />
          {people.map((person, index) => <Person key={index} index={index} x={x(person.x)} y={y(person.y)} />)}
        </svg>
      </div>
      <figcaption><span className="row-legend"><span><i className="row-line-now" />今の列</span><span><i className="row-line-before" />出発時の列</span><span><i className="row-line-path" />一人ずつの道筋</span></span><span>足元の丸が場所の目印です。人の姿と地面の質感は模式表示です。</span></figcaption>
    </figure>
    <div className="row-controls">
      <div className="row-time-controls">
        <div className="row-control-heading"><Text id={`${id}-time`} size="sm" fw={600}>場面を選ぶ</Text><Text size="sm" className="row-time-readout">説明の時刻 {clock.time.toFixed(1)} / 8 秒</Text></div>
        <Group gap="xs" className="row-preset-buttons">
          <Button color="#2e7467" variant="light" onClick={clock.toggle} disabled={clock.reducedMotion}>{clock.running ? '停止' : '再生'}</Button>
          {[{ time: 0, label: '入る前' }, { time: middle, label: slanted ? '片側が入る' : '同時に入る' }, { time: 8, label: '入った後' }].map(scene => <Button key={scene.time} variant={clock.time === scene.time ? 'light' : 'subtle'} color="gray" onClick={() => clock.seek(scene.time)}>{scene.label}</Button>)}
        </Group>
        <Slider color="#2e7467" aria-labelledby={`${id}-time`} min={0} max={8} step={.05} value={clock.time} onChange={clock.seek} label={null} mt="md" />
        {clock.reducedMotion && <Text size="sm" mt="sm">動きを減らす設定では、場面か時刻を選んで比べられます。</Text>}
      </div>
      <div className="row-condition-controls">
        <Text id={`${id}-entry`} fw={600} size="sm" mb="xs">砂地への入り方</Text>
        <SegmentedControl color="#2e7467" fullWidth aria-labelledby={`${id}-entry`} value={slanted ? 'slanted' : 'straight'} onChange={value => { setSlanted(value === 'slanted'); clock.reset() }} data={[{ value: 'slanted', label: '斜めに入る' }, { value: 'straight', label: '同時に入る' }]} />
        <Switch color="#2e7467" mt="md" label="砂地で速さを半分にする" checked={slower} onChange={event => { setSlower(event.currentTarget.checked); clock.reset() }} />
      </div>
    </div>
    <Text size="sm" className="row-time-note">8秒は説明用の時間で、歩行の1.5秒に対応します。道では1.5 m/s、砂地では{slower ? '0.75' : '1.5'} m/sです。</Text>
    <div className="row-explanation">
      <Title order={3}>同じ時間に、AとBが進む距離を比べる</Title>
      <Text mt="sm" role="status">{reason}</Text>
      <Text size="sm" mt="sm">一人ずつの歩く向きは変わりません。変わるのは、足元を結んだ列の向きです。互いに引っ張る条件は置いていません。光へ引き継ぐのは到着順と距離の差で、人の歩く向きは光の向きに対応しません。</Text>
    </div>
  </div>
}
