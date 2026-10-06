import { Button, Group, Paper, SegmentedControl, Slider, Stack, Switch, Text, Title } from '@mantine/core'
import { useId, useState } from 'react'
import { boundaryFrontPoint, observeOptics, observeWalkingRow } from './reflection-refraction/model'
import { useWavePresentation } from './reflection-refraction/use-wave-presentation'
import { StrawExplanation, StrawObservation } from './reflection-refraction/straw-experience'
import { LeafView, MirrorLeafView } from './lenses-mirrors/image-experience'
import ImageJourney from './lenses-mirrors/image-journey'
import PaperImageGuide from './lenses-mirrors/paper-image-guide'
import '../../components/lesson-journey.css'
import './reflection-refraction/optics-lesson.css'
import './lenses-mirrors/images.css'

function TimeControls({ clock, middle = 3, simultaneous = false }: { clock: ReturnType<typeof useWavePresentation>; middle?: number; simultaneous?: boolean }) {
  const id = useId()
  return <Stack gap="sm" mt="md">
    <Group><Button variant="default" onClick={() => clock.seek(0)}>入る前</Button><Button variant="default" onClick={() => clock.seek(middle)}>{simultaneous ? '同時に入る' : '片側が入る'}</Button><Button variant="default" onClick={() => clock.seek(8)}>入った後</Button></Group>
    <Text id={id} size="sm">説明の時刻：{clock.time.toFixed(1)} / 8 秒</Text>
    <Slider aria-labelledby={id} min={0} max={8} step={.05} value={clock.time} onChange={clock.seek} label={null} />
    <Group><Button onClick={clock.toggle} disabled={clock.reducedMotion}>{clock.running ? '停止' : '再生'}</Button><Button variant="subtle" onClick={clock.reset}>最初へ戻す</Button></Group>
    {clock.reducedMotion && <Text size="sm">動きを減らす設定では、静止場面か時刻を選べます。</Text>}
  </Stack>
}

export function WalkingRow() {
  const [slanted, setSlanted] = useState(true)
  const [slower, setSlower] = useState(true)
  const clock = useWavePresentation()
  const id = useId()
  const people = observeWalkingRow(clock.time / 8 * 1.5, slanted, slower)
  const x = (v: number) => 280 + v * 170
  const y = (v: number) => 210 - v * 170
  const path = (points: readonly { x: number; y: number }[]) => points.map((p, i) => `${i ? 'L' : 'M'}${x(p.x)},${y(p.y)}`).join(' ')
  return <div className="concept-workspace">
    <div>
      <Text id={id} fw={600}>砂地への入り方</Text>
      <SegmentedControl fullWidth mt="sm" aria-labelledby={id} value={slanted ? 'slanted' : 'straight'} onChange={value => { setSlanted(value === 'slanted'); clock.reset() }} data={[{ value: 'slanted', label: '斜めに入る' }, { value: 'straight', label: '同時に入る' }]} />
      <Switch mt="md" label="砂地で速さを半分にする" checked={slower} onChange={event => { setSlower(event.currentTarget.checked); clock.reset() }} />
      <TimeControls clock={clock} middle={slanted ? 3 : 4} simultaneous={!slanted} />
      <Text size="sm" mt="md">8秒は説明の時間で、歩行の1.5秒に対応します。道では1.5 m/s、砂地では{slower ? '0.75' : '1.5'} m/sです。</Text>
    </div>
    <figure>
      <svg viewBox="0 0 560 520" role="img" aria-label="人の列が道から砂地へ進む模式図。個人の歩く向きは保ち、列の向きだけを比べる。">
        <rect x="24" y="210" width="512" height="286" fill="#f2e3c8" />
        <line x1="24" x2="536" y1="210" y2="210" stroke="#617083" strokeWidth="2" />
        <text x="35" y="35">舗装された道</text><text x="35" y="486">砂地</text>
        <path d={path(people.map(p => p.start))} fill="none" stroke="#718096" strokeDasharray="5 5" strokeWidth="2" />
        <path d={path(people)} fill="none" stroke="#147a65" strokeWidth="3" />
        {people.map((person, i) => <g key={i}>
          <line x1={x(person.start.x)} y1={y(person.start.y)} x2={x(person.x)} y2={y(person.y)} stroke="#8d9aad" strokeDasharray="2 5" />
          <g transform={`translate(${x(person.x)} ${y(person.y)})`}>
            <circle cy="-8" r="5" fill={i === 0 ? '#b45517' : i === 4 ? '#2563eb' : '#147a65'} />
            <path d="M0 -2 V12 M-7 4 L0 0 L7 4 M0 12 L-6 20 M0 12 L6 20" fill="none" stroke="#147a65" strokeWidth="2.5" />
            {(i === 0 || i === 4) && <text x={i === 0 ? -25 : 15} y="-18">{i === 0 ? 'A' : 'B'}</text>}
          </g>
        </g>)}
        <text x="35" y="518">破線：出発時　実線：今の列</text>
      </svg>
      <figcaption>足元の位置を結んだ緑の線が、並びの向きです。点線は各人が歩いた道筋です。</figcaption>
    </figure>
    <Paper withBorder p="md" className="concept-reason">
      <Title order={3}>AとBが進んだ距離を比べる</Title>
      <Text mt="sm" role="status">{!slower ? '速さが同じなら、同じ時間に同じ距離だけ進みます。境目を通っても列の向きは変わりません。' : !slanted ? '全員が同時に遅くなります。進む距離に左右の差がないので、列の向きは変わりません。' : !people[0].inSand ? 'AもBも道の上で同じ速さです。「片側が入る」で、Aだけが遅くなった場面を選べます。' : people[4].inSand ? 'Aは先に砂地へ入り、Bより長い時間ゆっくり進みました。その間の距離の差が、今の列を傾けています。' : 'Aは砂地で遅く進み、Bはまだ道を速く進みます。同じ時間に進む距離の差が、列の向きを変えています。'}</Text>
      <Text mt="sm">一人ずつの歩く向きは変わりません。変わるのは、人の位置を結んだ列の向きです。この図では互いに手をつないで引っ張る条件を置きません。</Text>
      <Text size="sm" mt="sm">光へつながる手がかりは、境目への到着順と距離の差です。光は波の同じ段階を結ぶ面に直角に進みますが、人は列に直角な向きへ曲がるわけではありません。</Text>
    </Paper>
  </div>
}

export function Refraction() {
  const [slanted, setSlanted] = useState(true)
  const clock = useWavePresentation()
  const id = useId()
  const angle = slanted ? Math.PI / 4 : 0
  const front = Array.from({ length: 101 }, (_, i) => boundaryFrontPoint((i - 50) * .012, clock.time, angle))
  const before = [boundaryFrontPoint(-.6, 0, angle), boundaryFrontPoint(.6, 0, angle)]
  const x = (v: number) => 280 + v * 140
  const y = (v: number) => 210 - v * 140
  const path = (points: readonly { x: number; y: number }[]) => points.map((p, i) => `${i ? 'L' : 'M'}${x(p.x)},${y(p.y)}`).join(' ')
  return <div className="concept-workspace">
    <div>
      <Text id={id} fw={600}>水面への入り方</Text>
      <SegmentedControl fullWidth mt="sm" aria-labelledby={id} value={slanted ? 'slanted' : 'straight'} onChange={value => { setSlanted(value === 'slanted'); clock.reset() }} data={[{ value: 'slanted', label: '斜めに入る' }, { value: 'straight', label: 'まっすぐ入る' }]} />
      <Text mt="md">光の波で、繰り返しの同じ段階にある場所を緑の線で結びます。この面を<strong>波面</strong>と呼び、ここではその断面を見ています。実在する棒ではありません。</Text>
      <TimeControls clock={clock} middle={slanted ? 3 : 4} simultaneous={!slanted} />
      <Text size="sm" mt="md">8秒は作図の説明時間です。実際の光の約4.00 nsを引き伸ばしています。1 nsは10億分の1秒です。</Text>
    </div>
    <figure>
      <svg viewBox="0 0 560 440" role="img" aria-label="水へ入る同じ光の波面。緑の線と直角な黒い矢印が光の進む向き。">
        <defs><marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#26364b" /></marker><clipPath id={`${id}-clip`}><rect x="24" y="20" width="512" height="380" /></clipPath></defs>
        <rect x="24" y="210" width="512" height="190" fill="#d9eeeb" /><line x1="24" x2="536" y1="210" y2="210" stroke="#617083" strokeWidth="2" />
        <text x="35" y="30">空気：光は速く進む</text><text x="420" y="200">水面</text><text x="35" y="395">水：光は遅く進む</text>
        <g clipPath={`url(#${id}-clip)`}>
          <path d={path(before)} fill="none" stroke="#718096" strokeWidth="2" strokeDasharray="5 5" />
          <path d={path(front)} fill="none" stroke="#147a65" strokeWidth="4" />
          {[20, 80].map((index, i) => { const p = front[index]; return <g key={index}>
            <circle cx={x(p.x)} cy={y(p.y)} r="6" fill={i ? '#2563eb' : '#b45517'} />
            <text x={x(p.x) + (i ? 12 : -28)} y={y(p.y) - 12}>{i ? 'B側' : 'A側'}</text>
            <line x1={x(p.x)} y1={y(p.y)} x2={x(p.x + p.direction.x * .35)} y2={y(p.y + p.direction.y * .35)} stroke="#26364b" strokeWidth="3" markerEnd={`url(#${id}-arrow)`} />
          </g> })}
        </g>
        <text x="35" y="430">緑：同じ段階　矢印：進む向き</text>
      </svg>
      <figcaption>矢印は各領域の平らな波面に直角です。AとBは場所の目印で、粒の軌道ではありません。縦横は同じ縮尺です。</figcaption>
    </figure>
    <Paper withBorder p="md" className="concept-reason">
      <Title order={3}>速さの違いが、同じ段階の線を傾ける</Title>
      <Text mt="sm" role="status">{!slanted ? '全体が同時に水へ入ると、左右の進み方に差が付きません。速さは小さくなっても、向きは変わりません。' : !front[20].inWater ? '水へ入る前は、A側もB側も同じ速さで進みます。「片側が入る」で、先に水へ届く側を見られます。' : !front[80].inWater ? 'A側が先に水へ入り、遅くなります。まだ空気にあるB側は速く進むので、緑の線が傾き始めます。' : '水の中では、緑の線が入る前と違う傾きを持ちます。この平らな波では、光の向きは線に直角なので、黒い矢印も向きを変えます。'}</Text>
      <Text mt="sm">物質の境目を通って進む向きが変わることを<strong>屈折</strong>と呼びます。速さと波面の関係を示した図で、光が水面で何かにぶつかって曲がる説明ではありません。</Text>
      <Text size="sm" mt="sm">前提の人の列から引き継ぐのは、到着順と同じ時間の距離の差です。人の歩く向きは光と同じではありません。光の角度はスネルの法則で求めています。平らな波と等方的な透明物質を扱い、反射や微視的な相互作用は省いています。</Text>
    </Paper>
  </div>
}

export function ApparentDepth() {
  const [water, setWater] = useState(true)
  return <Stack gap="lg"><StrawObservation water={water} onWaterChange={setWater} /><StrawExplanation water={water} /></Stack>
}

export function Reflection() {
  const [angle, setAngle] = useState(35)
  const id = useId()
  const result = observeOptics({ incidentAngle: angle * Math.PI / 180, incidentIndex: 1, transmittedIndex: 1.33 })
  const origin = { x: 280, y: 280 }
  const start = { x: origin.x - result.incidentDirection.x * 215, y: origin.y + result.incidentDirection.y * 215 }
  const end = { x: origin.x + result.reflectedDirection.x * 215, y: origin.y - result.reflectedDirection.y * 215 }
  return <div className="concept-workspace">
    <div><Text id={id} fw={600}>鏡に直角な線から、届く角度を変える</Text><Slider mt="md" aria-labelledby={id} value={angle} onChange={setAngle} min={0} max={60} step={1} label={value => `${value}°`} marks={[{ value: 0, label: '0°' }, { value: 60, label: '60°' }]} /><Text mt="xl" role="status">届く角度：{angle}°。戻る角度：{angle}°。</Text></div>
    <figure><svg viewBox="0 0 560 370" role="img" aria-label={`机の鏡へ届く光と戻る光。鏡に直角な線から、どちらも${angle}度。`}>
      <defs><marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="context-stroke" /></marker></defs>
      <rect x="25" y="280" width="510" height="20" fill="#bcc6d1" /><text x="420" y="325">机の鏡</text>
      <line x1="280" x2="280" y1="35" y2="280" stroke="#64748b" strokeDasharray="5 5" /><text x="290" y="38">面に直角な線</text>
      <line x1={start.x} y1={start.y} x2={origin.x} y2={origin.y} stroke="#1971c2" strokeWidth="3" markerEnd={`url(#${id}-arrow)`} />
      <line x1={origin.x} y1={origin.y} x2={end.x} y2={end.y} stroke="#d9480f" strokeWidth="3" markerEnd={`url(#${id}-arrow)`} />
      <text x="40" y="350">青：届く光　橙：戻る光</text>
    </svg><figcaption>同じ平らな鏡を横から見た図です。矢印は進む向きで、光の強さを表しません。</figcaption></figure>
    <Paper withBorder p="md" className="concept-reason"><Title order={3}>基準の線から、両側を同じ角度で比べる</Title><Text mt="sm">光が届いた点で、鏡に90°の線を立てます。この基準線を<strong>法線</strong>と呼びます。鏡で手前へ戻る光は、この線の反対側へ、届いたときと同じ角度で進みます。これが<strong>反射</strong>の向きの規則です。</Text><Text mt="sm">0°では同じ道筋を戻ります。斜めに届くほど、戻る光も基準線から離れます。鏡の面から測った角度と、法線から測った角度を混ぜずに比べます。</Text><Text size="sm" mt="sm">平らな理想鏡の向きだけを求めています。表面の粗さ、散乱、明るさの変化はこの図に含めません。</Text></Paper>
  </div>
}

export function MirrorImage() {
  const [distance, setDistance] = useState(20)
  const id = useId()
  return <Stack gap="lg"><MirrorLeafView distance={distance} /><div><Text id={id} mb="sm">葉を鏡に近づけたり、離したりする</Text><Slider aria-labelledby={id} value={distance} min={10} max={40} step={1} onChange={setDistance} label={value => `${value} cm`} marks={[{ value: 10, label: '近づける' }, { value: 40, label: '離す' }]} /><Text mt="xl" role="status">葉は手前{distance} cm、見える葉は奥{distance} cmです。動かすのは同じ葉です。</Text></div><ImageJourney experience="mirror" lensVisible={false} distance={5} mirrorDistance={distance} /></Stack>
}

export function Magnifier() {
  const [distance, setDistance] = useState(5)
  const [visible, setVisible] = useState(true)
  const id = useId()
  return <Stack gap="lg"><LeafView distance={distance} lensVisible={visible} /><SegmentedControl fullWidth aria-label="同じ葉で虫めがねを使うか" value={visible ? 'with' : 'without'} onChange={value => setVisible(value === 'with')} data={[{ value: 'without', label: 'そのまま見る' }, { value: 'with', label: '虫めがねを使う' }]} /><div><Text id={id} mb="sm">葉と虫めがねの間隔を変える</Text><Slider aria-labelledby={id} value={distance} min={5} max={7.5} step={.5} onChange={setDistance} label={value => `${value} cm`} marks={[{ value: 5, label: '近づける' }, { value: 7.5, label: '少し離す' }]} /><Text mt="xl" role="status">葉と目の位置を保って、道具の有無を比べます。{visible ? 'この近さでは、葉脈の間隔が広く見えます。' : '虫めがねを外しました。葉そのものは変わりません。'}</Text></div><ImageJourney experience="magnifier" lensVisible={visible} distance={distance} mirrorDistance={20} /></Stack>
}

export function PaperImage() { return <PaperImageGuide /> }
