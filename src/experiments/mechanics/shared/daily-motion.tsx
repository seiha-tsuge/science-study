import { Button, Group, Paper, SegmentedControl, Slider, Stack, Text, Title } from '@mantine/core'
import { useId, useState } from 'react'
import { observeMotion } from '../motion/model'
import { observeAcceleration } from '../acceleration/model'
import { useExperimentClock } from './use-experiment-clock'
import type { Observation } from './types'
import './daily-motion.css'

type Subject = 'walker' | 'car'

function Traveller({ subject, x }: { subject: Subject; x: number }) {
  return <g transform={`translate(${x} ${subject === 'car' ? 101 : 94})`} fill="#246b9a" stroke="#246b9a" strokeWidth="2">
    {subject === 'walker' ? <><circle cy="-35" r="8" /><path d="M0 -24V0M-12 -13L0 -22L15 -12M0 0L-12 22M0 0L14 22" fill="none" strokeWidth="5" strokeLinecap="round" /></> : <><path d="M-28 2V-11L-15 -14L-7 -28H15L27 -12L31 -10V2Z" /><path d="M-4 -24H12L21 -13H-10Z" fill="#e5f0ef" /><circle cx="-17" cy="5" r="7" fill="#39485a" /><circle cx="21" cy="5" r="7" fill="#39485a" /></>}
    <circle cy="34" r="4" fill="#246b9a" />
  </g>
}

export function RoadScene({ subject, time, observe, marks }: { subject: Subject; time: number; observe: (time: number) => Observation; marks: boolean }) {
  const extent = subject === 'walker' ? 20 : 36
  const x = (position: number) => 60 + position / extent * 480
  const current = observe(time)
  const samples = Array.from({ length: Math.floor(time) + 1 }, (_, t) => ({ t, ...observe(t) }))
  return <figure className="daily-road">
    <svg viewBox="0 0 600 230" role="img" aria-label={`${subject === 'walker' ? '道を同じペースで歩く人' : '止まっていた車が発進する道'}。同じ対象の開始${time.toFixed(1)}秒後の場所。`}>
      <rect x="24" y="113" width="552" height="32" rx="5" fill="#e5e9e4" /><path d="M24 145H576" stroke="#9aa797" />
      <path d="M24 55V124M24 55H45V78H24" fill="#f7e7b4" stroke="#8e815b" /><text x="28" y="43">出発点</text>
      {[0, extent / 2, extent].map(value => <g key={value}><line x1={x(value)} x2={x(value)} y1="145" y2="154" stroke="#64748b" /><text x={x(value)} y="180" textAnchor="middle">{value} m</text></g>)}
      {marks && samples.map(sample => <g key={sample.t}><circle cx={x(sample.position)} cy="128" r="5" fill="white" stroke="#246b9a" strokeWidth="2" />{sample.t === Math.floor(time) && <text x={x(sample.position)} y="209" textAnchor="middle">{sample.t}秒</text>}</g>)}
      <Traveller subject={subject} x={x(current.position)} />
    </svg>
    <figcaption>足元または車の下の丸が、場所の目印です。{marks && '白い印は同じ対象が1秒ごとにいた場所です。'}体や車体の大きさは模式表示で、道の距離を測る尺度ではありません。</figcaption>
  </figure>
}

function Playback({ clock, duration }: { clock: ReturnType<typeof useExperimentClock>; duration: number }) {
  const id = useId()
  return <Stack gap="sm">
    <Group gap="xs"><Button variant="default" onClick={() => clock.seek(0)}>出発時</Button><Button variant="default" onClick={() => clock.seek(2)}>2秒後</Button><Button variant="default" onClick={() => clock.seek(4)}>4秒後</Button><Button onClick={clock.toggle} disabled={clock.reducedMotion}>{clock.running ? '停止' : '再生'}</Button></Group>
    <Text size="sm" id={id}>開始からの時間：{clock.time.toFixed(1)}秒（選ぶと停止）</Text><Slider aria-labelledby={id} min={0} max={duration} step={.1} value={clock.time} onChange={clock.seek} label={value => `${value.toFixed(1)}秒`} />
    {clock.reducedMotion && <Text size="sm">動きを減らす設定では、時刻を選んで静止図で比べられます。</Text>}
  </Stack>
}

export function PositionGraph({ time, speed }: { time: number; speed: number }) {
  const x = (t: number) => 55 + t * 48
  const y = (position: number) => 270 - position * 10
  const times = Array.from({ length: Math.floor(time) + 1 }, (_, t) => t)
  const end = observeMotion({ initialPosition: 0, velocity: speed }, time)
  return <figure className="daily-graph"><svg viewBox="0 0 600 335" role="img" aria-label="同じ歩行の時刻を横軸、道の場所を縦軸へ移す。1秒ごとの印が直線に並ぶ。">
    <path d="M55 45V270H555" stroke="#64748b" fill="none" />
    {[0, 5, 10, 15, 20].map(value => <g key={value}><line x1="55" x2="535" y1={y(value)} y2={y(value)} stroke="#e2e8f0" /><text x="44" y={y(value) + 6} textAnchor="end">{value}</text></g>)}
    {[0, 2, 4, 6, 8, 10].map(t => <text key={t} x={x(t)} y="296" textAnchor="middle">{t}</text>)}
    <path d={`M${x(0)} ${y(0)} L${x(time)} ${y(end.position)}`} stroke="#246b9a" strokeWidth="3" fill="none" />
    {times.map(t => <circle key={t} cx={x(t)} cy={y(observeMotion({ initialPosition: 0, velocity: speed }, t).position)} r="5" fill="white" stroke="#246b9a" strokeWidth="2" />)}
    <text x="20" y="27">道の場所 [m]</text><text x="540" y="327" textAnchor="end">開始からの時間 [秒]</text>
  </svg><figcaption>白い印は道の図と同じ時刻の場所です。縦の高さは、道の上り下りを表していません。条件を変えても軸の縮尺は保ちます。</figcaption></figure>
}

export function WalkingMotion() {
  const [speed, setSpeed] = useState(1)
  const [view, setView] = useState('road')
  const clock = useExperimentClock(4)
  const id = useId()
  const observe = (time: number) => observeMotion({ initialPosition: 0, velocity: speed }, time)
  return <Paper withBorder p="md" className="daily-motion">
    <SegmentedControl fullWidth aria-label="同じ歩行をたどる見方" value={view} onChange={value => { clock.seek(clock.time); setView(value) }} data={[{ value: 'road', label: '歩く場面' }, { value: 'marks', label: '1秒ごとの場所' }, { value: 'graph', label: 'グラフへ移す' }]} />
    <RoadScene subject="walker" time={clock.time} observe={observe} marks={view !== 'road'} />
    <div className="daily-tools"><Playback clock={clock} duration={10} /><Text id={id} size="sm" mt="md">歩くペース：1秒に{speed.toFixed(1)} m進む</Text><Slider aria-labelledby={id} value={speed} min={0} max={2} step={.1} onChange={value => { setSpeed(value); clock.reset() }} label={value => `${value.toFixed(1)} m/s`} /></div>
    {view === 'graph' && <PositionGraph time={clock.time} speed={speed} />}
    <Title order={3} mt="md">同じ時間に進む量が、印の間隔になる</Title>
    <Text mt="sm" role="status">{speed === 0 ? 'ペースを0にすると、その場に止まり、どの時刻の印も出発点に重なります。グラフは同じ高さになります。' : `毎秒${speed.toFixed(1)} mずつ進むので、1秒ごとの道の印は等間隔です。${clock.time.toFixed(1)}秒後は出発点から${observe(clock.time).position.toFixed(1)} mにいます。`} {view === 'graph' ? '時刻を横、道の場所を縦へ移すと、毎秒同じだけ高さが増えます。そのため白い印が直線に並びます。' : '「1秒ごとの場所」で印を残し、「グラフへ移す」で同じ時刻と場所を座標へ渡せます。'}</Text>
    <Text size="sm" mt="sm">一秒あたりの位置の変化が<strong>速度</strong>です。この図は右向きに一定の速度で歩く条件を決めています。歩き方や速度を保つ力の仕組みは再現しません。</Text>
  </Paper>
}

export function AccelerationArea({ time, acceleration }: { time: number; acceleration: number }) {
  const x = (t: number) => 55 + t * 80
  const y = (v: number) => 270 - v * 16
  const velocity = observeAcceleration({ initialPosition: 0, initialVelocity: 0, acceleration }, time).velocity
  return <figure className="daily-graph"><svg viewBox="0 0 600 340" role="img" aria-label="同じ車の速度と時間のグラフ。時間と速度の増加が三角形の底辺と高さになり、面積が進んだ距離に対応する。">
    <path d="M55 45V270H535" fill="none" stroke="#64748b" />
    {[0, 4, 8, 12].map(value => <g key={value}><line x1="55" x2="535" y1={y(value)} y2={y(value)} stroke="#e2e8f0" /><text x="44" y={y(value) + 6} textAnchor="end">{value}</text></g>)}
    <path d={`M55 270L${x(time)} ${y(velocity)}L${x(time)} 270Z`} fill="#b4dfce" stroke="#147a65" strokeWidth="2" />
    {[0, 2, 4, 6].map(t => <text key={t} x={x(t)} y="295" textAnchor="middle">{t}</text>)}
    <text x="20" y="27">車の速度 [m/s]</text><text x="540" y="331" textAnchor="end">開始からの時間 [秒]</text>
  </svg><figcaption>横幅が時間、縦の高さが車の速度です。短い時間ごとの「速度 × 時間」を足し、区切りを細かくした結果がこの面積です。道で進んだ距離に対応し、道の広さではありません。</figcaption></figure>
}

export function StartingCar() {
  const [acceleration, setAcceleration] = useState(1)
  const [view, setView] = useState('road')
  const clock = useExperimentClock(4, 6)
  const id = useId()
  const observe = (time: number) => observeAcceleration({ initialPosition: 0, initialVelocity: 0, acceleration }, time)
  const current = observe(clock.time)
  const half = observe(clock.time / 2)
  return <Paper withBorder p="md" className="daily-motion">
    <SegmentedControl fullWidth aria-label="同じ車をたどる見方" value={view} onChange={value => { clock.seek(clock.time); setView(value) }} data={[{ value: 'road', label: '発進する車' }, { value: 'marks', label: '1秒ごとの場所' }, { value: 'area', label: '距離の理由を見る' }]} />
    <RoadScene subject="car" time={clock.time} observe={observe} marks={view !== 'road'} />
    <div className="daily-tools"><Playback clock={clock} duration={6} /><Text id={id} size="sm" mt="md">車の速度を、毎秒{acceleration.toFixed(1)} m/sずつ増やす</Text><Slider aria-labelledby={id} value={acceleration} min={0} max={2} step={.5} onChange={value => { setAcceleration(value); clock.reset() }} label={value => `${value.toFixed(1)} m/s²`} /></div>
    {view === 'area' && <AccelerationArea time={clock.time} acceleration={acceleration} />}
    <Title order={3} mt="md">{acceleration === 0 ? '止まった車は出発点に残る' : '後の1秒ほど、車は遠くへ進む'}</Title>
    <Text mt="sm" role="status">{acceleration === 0 ? '速度を増やさない条件では、止まった車はその場に残ります。' : clock.time === 0 ? '車は止まった状態から出発します。「2秒後」と「4秒後」で、同じ車が進む距離を比べられます。' : `${(clock.time / 2).toFixed(2)}秒後に約${half.position.toFixed(2)} m、${clock.time.toFixed(2)}秒後に約${current.position.toFixed(2)} m進みます。時間が2倍なら、進んだ距離は4倍です。`} {view === 'area' ? acceleration === 0 || clock.time === 0 ? 'この条件では面積も進んだ距離も0です。速度を増やして時刻を進めると、三角形の広がりと道の距離が対応します。' : '時間が2倍になると、三角形の底辺も、増えた速度を表す高さも2倍になります。積が4倍になるため、距離に時間の二乗が現れます。' : '「1秒ごとの場所」で広がる印を見てから、「距離の理由を見る」で同じ車の速度と時間へ対応させられます。'}</Text>
    <Text size="sm" mt="sm">一秒あたりに速度が変わる割合が<strong>加速度</strong>です。この図は出発時の速度を0にし、加速度を一定にしたモデルです。出発時にすでに動いている車の全距離が4倍になるという規則ではありません。エンジンや力の仕組みは扱いません。</Text>
  </Paper>
}
