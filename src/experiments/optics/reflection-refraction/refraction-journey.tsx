import { Accordion, Badge, Button, Group, Paper, SegmentedControl, Slider, Switch, Tabs, Text, Title } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useId, useState } from 'react'
import { boundaryFrontPoint, observePeriodicWave, observeWalkingRow, teachingRope, wavePhysicalTime, WAVE_PRESENTATION_DURATION } from './model'
import StrawDiagram from './straw-diagram'
import { useWavePresentation } from './use-wave-presentation'
import '../../../components/lesson-journey.css'
import './refraction-journey.css'

const scenes = [
  { label: 'ストローを見る', title: 'ストローはまっすぐでも、見える位置はずれる', text: '茶色の●は、水中のストロー上の一点です。ストローの形はまっすぐなまま。この点から目へ届く光は、水面で曲がります。' },
  { label: '人の列で見る', title: '片側が遅れると、列の向きが変わる', text: '上から見た人の列です。左のAは砂地に近く、右のBより先に入ります。砂地では速さが半分。AとBの間の緑の線を見てください。' },
  { label: '光の図へ移る', title: '波の目印が傾くと、光の向きも変わる', text: '人は歩く向きを変えなくても、列は傾きました。光の場合は、その列に相当する波の目印と、光が進む向きの関係が必要です。水の波にある一つの山を、場所の並びとして見ます。' },
  { label: 'ストローへ戻る', title: '目に届いた向きが、見える位置を決める', text: 'ストローの●から目へ来る光は、水から空気へ出ます。空気中では速くなり、水面に立てた基準線から離れる向きへ曲がります。目が受け取るのは、曲がった後の光です。' },
] as const
const bridgeLabels = ['水の波の山を見る', '光の目印へ置き換える', '水面を通る', '光の向きを重ねる']
const X = (x: number) => 280 + x * 120
const Y = (y: number) => 210 - y * 120
const walkX = (x: number) => 280 + x * 170
const walkY = (y: number) => 210 - y * 170

export default function RefractionJourney() {
  const [scene, setScene] = useState(0)
  const [strawMode, setStrawMode] = useState(0)
  const [bridge, setBridge] = useState(0)
  const [slanted, setSlanted] = useState(true)
  const [slower, setSlower] = useState(true)
  const clock = useWavePresentation()
  const narrow = useMediaQuery('(max-width: 48em)')
  const id = useId()
  const angle = slanted ? Math.PI / 4 : 0
  const walkers = observeWalkingRow(clock.time / WAVE_PRESENTATION_DURATION * 1.5, slanted, slower)
  const front = Array.from({ length: 101 }, (_, i) => boundaryFrontPoint(-0.6 + i / 100 * 1.2, clock.time, angle))
  const before = Array.from({ length: 2 }, (_, i) => boundaryFrontPoint(i ? 0.6 : -0.6, 0, angle))
  const rowPath = (points: readonly { x: number; y: number }[]) => points.map((p, i) => `${i ? 'L' : 'M'}${X(p.x)},${Y(p.y)}`).join(' ')
  const walkPath = (points: readonly { x: number; y: number }[]) => points.map((p, i) => `${i ? 'L' : 'M'}${walkX(p.x)},${walkY(p.y)}`).join(' ')
  const waterProfile = Array.from({ length: 81 }, (_, i) => {
    const p = observePeriodicWave(teachingRope, i / 80 * 2, wavePhysicalTime(0, teachingRope))
    return `${i ? 'L' : 'M'}${70 + i / 80 * 420},${540 - p.value * 40}`
  }).join(' ')
  const boundaryText = !front[20].inWater
    ? '今はA側もB側も空気中です。緑の列と灰色の出発時の列は、同じ傾きです。途中の場面で、A側が先に水へ入る様子を見られます。'
    : front[80].inWater
      ? '今はA側もB側も水中です。A側が先に遅くなった間に進む距離の差が付き、緑の列は出発時とは違う傾きになっています。'
      : 'A側は水中で遅く進み、B側はまだ空気中を速く進みます。両側で進む距離に差が付き、緑の列の向きが変わります。'
  const moving = scene === 1 || (scene === 2 && bridge >= 2)
  const chooseScene = (next: number) => {
    if (next === scene) return
    clock.reset(); setScene(next); setStrawMode(next === 3 ? 2 : 0); setBridge(0); setSlanted(true); setSlower(true)
  }
  const selectBridge = (next: number) => { setBridge(next); clock.seek(next >= 2 ? (slanted ? 3 : 4) : 0) }
  const current = scenes[scene]
  const timeControls = (moving && <Paper withBorder p="md" className="journey-time">
        <Text fw={600} size="sm" mb="sm">時間を選んで、両端を比べる</Text><Group className="journey-time-scenes" gap="xs" aria-label="列の変化の静止場面">
          {[[0, '入る前'], [slanted ? 3 : 4, slanted ? '片側が先に入る' : '同時に入る'], [8, '全体が入った後']].map(([value, label]) => <Button key={value} variant={Math.abs(clock.time - Number(value)) < 0.05 ? 'light' : 'default'} aria-label={String(label)} aria-pressed={Math.abs(clock.time - Number(value)) < 0.05} onClick={() => clock.seek(Number(value))}>{label === '片側が先に入る' ? '片側が入る' : label === '全体が入った後' ? '入った後' : label}</Button>)}
        </Group>
        <Text size="xs" mt="md" mb="xs">説明の時間：{clock.time.toFixed(1)} / {WAVE_PRESENTATION_DURATION} 秒（物理時刻とは別）</Text>
        <Slider min={0} max={8} step={0.05} value={clock.time} onChange={clock.seek} thumbLabel="列の変化の説明時間" thumbProps={{ 'aria-valuetext': `${clock.time.toFixed(1)}秒` }} label={value => `${value.toFixed(1)} s`} />
        <Group mt="md" gap="xs">
          <Button disabled={clock.reducedMotion} aria-label={clock.running ? '説明を停止' : '列の変化を再生'} onClick={clock.toggle}>{clock.running ? '停止' : '再生'}</Button>
          <Button variant="default" aria-label="この場面を初期化" onClick={clock.reset}>先頭へ戻す</Button>
        </Group>
        {clock.reducedMotion && <Text size="sm" mt="sm">動きを減らす設定です。場面ボタンや時間スライダーで、静止した図を選べます。</Text>}
      </Paper>)
  return (
    <Paper withBorder p={{ base: 'md', sm: 'xl' }} className="refraction-journey">
      <Group justify="space-between" gap="sm"><Title order={3}>ストローから、曲がる理由をたどる</Title><Badge variant="light">図とたとえで見る</Badge></Group>
      <Text size="sm" c="dimmed" mt="sm">四つの場面を自由に選べます。図に重ねるものや途中の時間を選ぶと、再生せずに関係を見られます。</Text>
      <Tabs value={String(scene)} onChange={value => { if (value !== null) chooseScene(Number(value)) }}>
      <Tabs.List className="journey-scenes" aria-label="屈折の説明の場面" grow>
        {scenes.map((item, index) => <Tabs.Tab key={item.label} value={String(index)}>{item.label}</Tabs.Tab>)}
      </Tabs.List>
      <Tabs.Panel value={String(scene)}>
      <div className="journey-intro"><Text className="eyebrow">場面 0{scene + 1} / 04</Text><Title order={4}>{current.title}</Title>
      <Text size="sm" c="dimmed" mt="sm">{scene === 1 && !slower ? '砂地に入っても、歩く速さを変えない場合です。境目へ届く順番にかかわらず、全員が同じ時間に同じ距離を進みます。' : scene === 1 && !slanted ? 'AとBを砂地の境目から同じ距離に並べます。全員が同時に砂地へ入り、同時に遅くなる場合です。' : current.text}</Text></div>

      {(scene === 0 || scene === 3) && <div className="journey-workspace">
        <div className="journey-tools">
          <Text size="sm" fw={600} mb="xs" id={`${id}-straw-layers`}>図に重ねるもの</Text>
          <SegmentedControl fullWidth orientation={narrow ? 'horizontal' : 'vertical'} aria-labelledby={`${id}-straw-layers`} value={String(strawMode)} onChange={value => setStrawMode(Number(value))} data={['ストローの形', '目に届く光', '見える位置'].map((label, index) => ({ value: String(index), label }))} />
        </div>
        <StrawDiagram mode={strawMode} />
        <Paper withBorder p="md" className="journey-explanation"><Text className="eyebrow">図のここを見る</Text><Text mt="sm">{strawMode === 0 ? '茶色の●はストローの上にあります。水に入っている部分も、形は一直線です。' : strawMode === 1 ? '青い実線を●から目へたどると、水面で折れ曲がっています。ストローが曲がらなくても、光の道筋は曲がります。' : '紫の破線は、目へ届いた向きのまま光を逆向きに延ばした線です。細い束が一直線に来たとみなすと、その出発点は、破線が交わる○になります。○は実際の●より浅い位置にあります。'}</Text>
        <Text size="sm" c="dimmed" mt="sm">平らな水面を横から見た説明図です。ストロー上の一点と細い光の束を扱い、コップの壁と目のレンズは省いています。○は光の延長から求めた近似の位置です。</Text>
        {strawMode === 2 && <Text mt="sm">水中の部分が実際とは違う位置に見えるため、まっすぐなストローが水面で折れたように見えます。</Text>}
        </Paper>
      </div>}

      {scene === 1 && <div className="journey-workspace">
        <div className="journey-tools">
          <Text size="sm" fw={600} mb="xs" id={`${id}-walk-condition`}>砂地への入り方</Text>
          <SegmentedControl fullWidth aria-labelledby={`${id}-walk-condition`} value={slanted ? 'slanted' : 'straight'} onChange={value => { setSlanted(value === 'slanted'); clock.reset() }} data={[{ value: 'slanted', label: '斜めに入る' }, { value: 'straight', label: '同時に入る' }]} />
          <Switch mt="md" label="砂地で速さを半分にする" checked={slower} onChange={event => { setSlower(event.currentTarget.checked); clock.reset() }} />
        {timeControls}
        </div>
        <svg className="journey-visual refraction-visual" viewBox="0 0 560 520" role="img" aria-labelledby={`${id}-walk-title ${id}-walk-desc`}>
          <title id={`${id}-walk-title`}>人の列が道から砂地へ進む模式図</title>
          <desc id={`${id}-walk-desc`}>{slanted ? 'Aが先に砂地に入り、Bは後から入ります。' : '全員が同時に砂地に入ります。'}{slower ? '砂地で歩く速さが半分になります。' : '道と砂地で同じ速さです。'}人の歩く向きは固定し、列の向きの変化だけを比べます。</desc>
          <defs>
            <pattern id={`${id}-sand`} width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="5" cy="8" r="1" fill="#c3a66f" opacity="0.45" /></pattern>
            <marker id={`${id}-walk-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#62758a" /></marker>
          </defs>
          <rect x="24" y="210" width="512" height="286" fill="#f2e3c8" />
          <rect x="24" y="210" width="512" height="286" fill={`url(#${id}-sand)`} />
          <path d={walkPath([walkers[0].start, { x: walkers[0].start.x + walkers[0].direction.x * 0.32, y: walkers[0].start.y + walkers[0].direction.y * 0.32 }])} fill="none" stroke="#62758a" strokeWidth="2" markerEnd={`url(#${id}-walk-arrow)`} />
          <text x="35" y="35">舗装された道</text><text x="35" y="486">砂地</text>
          <line x1="24" x2="536" y1="210" y2="210" stroke="#617083" strokeWidth="2" />
          <path d={walkPath(walkers.map(w => w.start))} fill="none" stroke="#718096" strokeDasharray="5 5" strokeWidth="2" />
          <path d={walkPath(walkers)} fill="none" stroke="#147a65" strokeWidth="3" />
          {walkers.map((walker, i) => <g key={i}>
            <line x1={walkX(walker.start.x)} y1={walkY(walker.start.y)} x2={walkX(walker.x)} y2={walkY(walker.y)} stroke="#8d9aad" strokeDasharray="2 5" />
            <g transform={`translate(${walkX(walker.x)} ${walkY(walker.y)})`}>
              <circle cy="-8" r="5" fill={i === 0 ? '#b45517' : i === 4 ? '#2563eb' : '#147a65'} />
              <path d="M0 -2 V12 M-7 4 L0 0 L7 4 M0 12 L-6 20 M0 12 L6 20" fill="none" stroke={i === 0 ? '#b45517' : i === 4 ? '#2563eb' : '#147a65'} strokeWidth="2.5" />
              {(i === 0 || i === 4) && <text x={i === 0 ? -25 : 15} y="-18">{i === 0 ? 'A' : 'B'}</text>}
            </g>
          </g>)}
          <text x="35" y="518">破線：出発時　実線：今の列</text>
        </svg>
        <Paper withBorder p="md" className="journey-explanation"><Text className="eyebrow">図のここを見る</Text><Text mt="sm">{!slower ? '同じ速さなら、同じ時間に同じ距離だけ進みます。境目を通っても列の向きは変わりません。' : !slanted ? '全員が同時に遅くなります。左右で進む距離に差が付かないので、列の向きは変わりません。' : !walkers[0].inSand ? '今はAもBも道の上。同じ速さで進んでいます。「片側が入る」を選ぶと、Aだけが遅くなった状態を見られます。' : walkers[4].inSand ? '今はAもBも砂地の上。先に入ったAは、Bより長い時間ゆっくり進んだため、出発時の列と今の列では傾きが違います。' : 'Aは砂地で遅く進み、Bはまだ道の上を速く進みます。同じ時間に進む距離の差が、緑の列の向きを変えています。'}</Text>
        <div className="journey-comparison" aria-label="両端の人の現在の速さ">
          {[walkers[0], walkers[4]].map((walker, index) => <Paper withBorder p="sm" key={index}><strong>{index ? 'B' : 'A'} · {walker.inSand ? '砂地' : '道'}</strong><span>{walker.inSand && slower ? '0.75' : '1.50'} m/s</span></Paper>)}
        </div>
        <Text size="sm" mt="sm">AとBの歩く向きは、列が傾いても変わりません。光へ対応させるのは、境目への到着順と、同じ時間に進む距離の差が列を傾ける関係です。</Text>
        </Paper>
      </div>}

      {scene === 2 && <div className="journey-workspace">
        <div className="journey-tools">
          <Text size="sm" fw={600} mb="xs" id={`${id}-bridge-stages`}>同じ目印で、図をつなぐ</Text>
          <SegmentedControl fullWidth orientation="vertical" aria-labelledby={`${id}-bridge-stages`} value={String(bridge)} onChange={value => selectBridge(Number(value))} data={bridgeLabels.map((label, index) => ({ value: String(index), label }))} />
          {bridge >= 2 && <>
            <Text size="sm" fw={600} mt="md" mb="xs" id={`${id}-light-condition`}>水面への入り方</Text>
            <SegmentedControl fullWidth aria-labelledby={`${id}-light-condition`} value={slanted ? 'slanted' : 'straight'} onChange={value => { setSlanted(value === 'slanted'); clock.seek(value === 'slanted' ? 3 : 4) }} data={[{ value: 'slanted', label: '斜めに入る' }, { value: 'straight', label: 'まっすぐ入る' }]} />
          </>}
        {timeControls}
        </div>
        <div className="journey-bridge-context"><Text mt="md">{bridge === 0 ? '水面の上下を横から見ると、山と谷が並んでいます。緑の印を付けた一つの山を上から見ると、山の頂上にある場所が一本の列になります。' : bridge === 1 ? '光では、水面の高さの代わりに、電気・磁気のはたらきが繰り返し変わります。その変化が空間を伝わります。緑の列は、一つの山に相当する、繰り返しの同じ段階にある場所です。' : bridge === 2 ? slanted ? '灰色の横線は、空気と水の接する水面です。A側が先に水へ入り、B側が後から入ります。途中の場面で、片側だけが遅くなる状態を見られます。' : '水面へまっすぐ届く場合、緑の列は水面と平行です。A側とB側が同時に水へ入り、一緒に遅くなります。' : '黒い矢印が、光の進む向きです。この平らな波では、矢印と緑の列が90°の角度をなします。図の小さな四角が、その直角の印です。'}</Text></div>
        <svg className="journey-visual refraction-visual" viewBox={`0 0 560 ${bridge === 0 ? 620 : 430}`} role="img" aria-labelledby={`${id}-front-title ${id}-front-desc`}>
          <title id={`${id}-front-title`}>{bridgeLabels[bridge]}</title>
          <desc id={`${id}-front-desc`}>{slanted ? 'A側を左下、B側を右上に保った緑の列。' : 'A側とB側を水面と平行に並べた緑の列。'}{bridge >= 2 ? slanted ? '灰色の横線は水面。A側が先に入り、緑の列の向きが変わります。' : '灰色の横線は水面。列全体が同時に入り、向きは変わりません。' : '一つの山に相当する場所を目印にしています。'}{bridge === 3 && '黒い矢印は緑の列と90度をなす光の向きです。'}</desc>
          <defs>
            <marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="context-stroke" /></marker>
            <clipPath id={`${id}-clip`}><rect x="24" y="48" width="512" height={bridge < 2 ? 310 : 354} /></clipPath>
          </defs>
          <text x="35" y="35">{bridge === 0 ? '上から見る：山の頂上の並び' : bridge === 1 ? '光：同じ段階の場所の並び' : '空気：光は速く進む'}</text>
          {bridge < 2 && <rect x="24" y="48" width="512" height="310" rx="8" fill="#e5f0ee" />}
          {bridge >= 2 && <>
            <rect x="24" y="210" width="512" height="192" fill="#d9eeeb" />
            <line x1="24" x2="536" y1="210" y2="210" stroke="#617083" strokeWidth="2" />
            <text x="400" y="200">水面</text><text x="35" y="398">水：光は遅く進む</text>
          </>}
          <g clipPath={`url(#${id}-clip)`}>
            <g transform={bridge < 2 ? 'translate(-140 -20) scale(1.5)' : undefined}>
            {bridge < 2 && [-0.5, 0.5].map(offset => <line key={offset} x1={X(before[0].x)} y1={Y(before[0].y + offset)} x2={X(before[1].x)} y2={Y(before[1].y + offset)} stroke="#a0bfb8" strokeWidth="2" />)}
            {bridge >= 2 && <path d={rowPath(before)} fill="none" stroke="#718096" strokeWidth="2" strokeDasharray="5 5" />}
            <path d={rowPath(bridge >= 2 ? front : before)} fill="none" stroke="#147a65" strokeWidth="4" />
            {[20, 80].map((index, i) => {
              const p = bridge >= 2 ? front[index] : boundaryFrontPoint(i ? 0.36 : -0.36, 0, angle)
              return <g key={i}>
                <circle cx={X(p.x)} cy={Y(p.y)} r="6" fill={i ? '#2563eb' : '#b45517'} />
                <text x={X(p.x) + (i ? 12 : -28)} y={Y(p.y) - 12}>{i ? 'B側' : 'A側'}</text>
                {bridge === 3 && <g>
                  <line x1={X(p.x)} y1={Y(p.y)} x2={X(p.x + p.direction.x * 0.50)} y2={Y(p.y + p.direction.y * 0.50)} stroke="#26364b" strokeWidth="3" markerEnd={`url(#${id}-arrow)`} />
                  <path d={`M${X(p.x + p.direction.x * 0.07)},${Y(p.y + p.direction.y * 0.07)} l${p.direction.y * 12},${p.direction.x * 12} l${-p.direction.x * 12},${p.direction.y * 12}`} fill="none" stroke="#26364b" strokeWidth="1.5" />
                </g>}
              </g>
            })}
            {bridge === 0 && <circle cx={X(0)} cy={Y(boundaryFrontPoint(0, 0, angle).y)} r="7" fill="#fff" stroke="#147a65" strokeWidth="3" />}
            </g>
          </g>
          <text x="35" y={bridge < 2 ? 388 : 426}>{bridge === 3 ? '緑の線：列　矢印：光の向き' : bridge >= 2 ? '破線：入る前　実線：今の列' : bridge === 1 ? '緑の線：光の波の目印' : '緑の印：上下の図で同じ山'}</text>
          {bridge === 0 && <>
            <rect x="24" y="420" width="512" height="178" rx="8" fill="#fff" />
            <text x="35" y="452">横から見る：水面の高さ</text>
            <path d={`${waterProfile} L490,590 L70,590 Z`} fill="#e1eef8" />
            <line x1="70" x2="490" y1="540" y2="540" stroke="#a8bfc7" strokeDasharray="4 5" />
            <path d={waterProfile} fill="none" stroke="#2563eb" strokeWidth="3" />
            <circle cx="122.5" cy="500" r="9" fill="#fff" stroke="#147a65" strokeWidth="4" />
            <text x="35" y="612">山の頂上をつないだ列が、上の緑の線</text>
          </>}
        </svg>
        <Paper withBorder p="md" className="journey-explanation"><Text className="eyebrow">図のここを見る</Text><Text mt="sm">{bridge === 0 ? '水の山が進むと、この場所の並びも移ります。各場所の変化が周囲へ伝わる現象を「波」と呼びます。山が進む向きに、水の粒がそのまま運ばれるわけではありません。' : bridge === 1 ? '繰り返しの同じ段階にある場所は、空間で面をつくります。この面が「波面」で、緑の線はその断面です。波を追うための目印であり、実在する棒や壁ではありません。' : !slanted ? '列全体が同時に水へ入ると、左右で進む距離に差が付きません。速さは小さくなりますが、緑の列も光も向きを変えません。' : bridge === 2 ? boundaryText : '緑の列が傾くと、列に90°の黒い矢印も向きを変えます。斜めに届く波では、速さの差が列を傾け、その傾きが光の向きを変えます。進む向きを線で表したものが「光線」、別の物質へ進むときの向きの変化が「屈折」です。'}</Text>
        <Text size="sm" mt="sm">光が波面に90°で進む性質は、人のたとえとは別の条件です。平らな波と、場所や方向によって性質が変わらない透明な物質を扱います。物質中で光が遅くなる微視的な理由は、この図の範囲外です。</Text>
        </Paper>
      </div>}

      <Group justify="space-between" mt="lg">
        <Button variant="subtle" disabled={scene === 0} onClick={() => chooseScene(scene - 1)}>← 前の場面</Button>
        <Button variant="light" disabled={scene === 3} onClick={() => chooseScene(scene + 1)}>{scenes[scene + 1]?.label ?? '次の場面'} →</Button>
      </Group>
      </Tabs.Panel>
      </Tabs>
      <Accordion variant="separated" mt="lg">
        <Accordion.Item value="scope"><Accordion.Control>たとえの対応・図の尺度・説明の範囲</Accordion.Control><Accordion.Panel>
          <Text>人の並びは、各自が歩く向きを保ち、道で1.5 m/s、砂地で0.75 m/sとした模式図です。説明の8秒を歩行の1.5秒へ対応させます。人が手をつないだり、列の向きを保つように動いたりする条件は置きません。</Text>
          <Text mt="sm">人の列と波面には「先に境目へ届く側」「遅い側の進む距離」「列の向きの変化」を対応させます。光の曲がる角度は、人の列の傾きから計算しません。光の図はスネルの法則を使った解析式の可視化です。</Text>
          <Text mt="sm">水の山の図は、平らに並ぶ山と谷の模式図です。上からの図と横からの図で同じ山に緑の印を付け、水深や水の粒の運動は省きます。光の目印へ置き換える場面までは、列を大きく表示しています。</Text>
          <Text mt="sm">水面を通る光の図は空気1.00から水1.33へ、45°または0°で進む一つの波面の断面です。幅1.2 mを選び、縦横を同じ縮尺で描きます。説明の8秒は約4.00 ns（1 ns = 10⁻⁹ s）に対応します。これは波長を1.2 mに設定した意味ではありません。A側・B側は見る場所の目印で、光の粒の軌道を示しません。黒い矢印の長さは速さを表しません。</Text>
          <Text mt="sm">ストローの図は、平らな水面で屈折する近接した二本の光線を使い、その延長の交点を見える点の近似とします。水中の実際の点は x = −0.35 m、y = −0.65 m、水面は y = 0 mです。全体の像、見る向きによる像のゆがみ、コップの壁、目のレンズは再現しません。</Text>
          <Text mt="sm">この教材では、光の速さが違うと向きが変わる関係まで扱います。物質中で速さが決まる微視的な理由は、電磁場と物質の相互作用へつながります。反射光と強さの変化はこの仕組みの図では省き、反射と全反射は下の条件操作で扱います。</Text>
        </Accordion.Panel></Accordion.Item>
      </Accordion>
    </Paper>
  )
}
