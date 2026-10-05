import { Accordion, Badge, Button, Group, Paper, SegmentedControl, Slider, Switch, Tabs, Text, Title } from '@mantine/core'
import { useId, useState } from 'react'
import {
  boundaryFrontPoint, observeInterference, observePeriodicWave, observeTeachingLight,
  teachingLight, teachingRope, waveCrestPositions, wavePhysicalTime, WAVE_PRESENTATION_DURATION,
} from './model'
import { useWavePresentation } from './use-wave-presentation'
import './wave-primer.css'

const scenes = [
  { label: 'ひもの印', title: 'ひもの印は上下し、山は右へ進む', text: 'オレンジの印は、ひもの同じ場所に付いています。時間を進めると、印は上下するだけで、右へ運ばれません。一方、青い山の形は右へ進みます。' },
  { label: '光の電場', title: '物体の上下がなくても、光は伝わる', text: 'ひもでは、物質が上下していました。光の図の青い矢印は、小さな＋の電気を帯びた粒を置いたとき、電気の力がはたらく向きです。矢印が長い場所ほど、同じ粒にはたらく力が大きくなります。' },
  { label: '二つの光', title: '光を重ねると、明るくなる場所も暗くなる場所もある', text: '一つの光を二つの細い隙間に通す実験では、壁に明暗の縞が現れます。上の図の緑の点は、二つの光が届く壁上の一点です。下のグラフは、その点での二つの電場と、足し合わせた電場の時間変化を表します。' },
  { label: '繰り返しの段階', title: '値が同じでも、変化の途中は違う', text: '上の図のAとBで、電場の値を比べます。下の円の点は、それぞれが「上がる → 上の端 → 下がる → 下の端」という一周のどこにいるかを示します。同じ高さでも、その後に上がる場合と下がる場合があります。' },
  { label: '波面と光線', title: '変化がそろう場所を、空間の面として見る', text: '前の場面の円で、点が上の端にある場所だけを選び、緑で示します。同じ段階の場所が奥行きにも並ぶ様子を、断面と空間の面で見比べられます。' },
  { label: '水面を通る', title: '先に水へ届く部分から、進む速さが変わる', text: '灰色の横線は、空気と水が接する水面です。緑の線は、波の一つの山に相当する場所の並びで、波面の断面を表します。斜めに届くと、左側が先に水へ入ります。' },
] as const

const lightX = (position: number) => 40 + position / teachingLight.wavelength * 160
const trendLabel = (trend: string) => trend === 'turning' ? '折り返すところ' : trend === 'decreasing' ? 'いま下がる' : 'いま上がる'

function sampledPath(time: number, centre: number, scale: number, field: 'first' | 'second' | 'total', difference: number) {
  return Array.from({ length: 101 }, (_, i) => {
    // Three periods at one observation point; the horizontal axis is time.
    const physicalTime = time + i / 100 * 3 * teachingLight.period
    const result = observeInterference(physicalTime, difference)
    return `${i === 0 ? 'M' : 'L'}${40 + i / 100 * 480},${centre - result[field] * scale}`
  }).join(' ')
}

export default function WavePrimer({ active = true }: { active?: boolean }) {
  const [scene, setScene] = useState(0)
  const [magnetic, setMagnetic] = useState(false)
  const [opposite, setOpposite] = useState(false)
  const [pair, setPair] = useState(0)
  const [space, setSpace] = useState(false)
  const [slanted, setSlanted] = useState(true)
  const [normal, setNormal] = useState(false)
  const clock = useWavePresentation(active)
  const id = useId()
  const physicalTime = wavePhysicalTime(clock.time, teachingLight)
  const ropeTime = wavePhysicalTime(clock.time, teachingRope)
  const lightSamples = Array.from({ length: 121 }, (_, i) => ({ x: i / 120 * 3 * teachingLight.wavelength, ...observeTeachingLight(i / 120 * 3 * teachingLight.wavelength, physicalTime) }))
  const ropeSamples = Array.from({ length: 49 }, (_, i) => ({ x: i / 48 * 3, ...observePeriodicWave(teachingRope, i / 48 * 3, ropeTime) }))
  const phaseOffsets = [1, 0.25, 0.5, 1 / 3]
  const positionA = teachingLight.wavelength / 12
  const positionB = positionA + phaseOffsets[pair] * teachingLight.wavelength
  const a = observeTeachingLight(positionA, physicalTime)
  const b = observeTeachingLight(positionB, physicalTime)
  const crests = waveCrestPositions(teachingLight, physicalTime, 0, 3 * teachingLight.wavelength)
  const highlighted = crests.reduce((best, value) => Math.abs(value - 1.5 * teachingLight.wavelength) < Math.abs(best - 1.5 * teachingLight.wavelength) ? value : best, crests[0])
  const front = Array.from({ length: 101 }, (_, i) => boundaryFrontPoint(-0.6 + i / 100 * 1.2, clock.time, slanted ? Math.PI / 4 : 0))
  // One spatial scale on both axes preserves the wavefront's orientation.
  const frontX = (value: number) => 280 + value * 175
  const frontY = (value: number) => 170 - value * 175
  const chooseScene = (next: number) => { if (next === scene) return; clock.reset(); setScene(next) }
  const interference = observeInterference(physicalTime, opposite ? Math.PI : 0)
  const fieldAtP = observeTeachingLight(teachingLight.wavelength / 4, physicalTime)
  const equalValues = Math.abs(a.value - b.value) < 1e-8
  const title = scene === 5 && !slanted ? '同時に水へ届くと、向きは変わらない' : scenes[scene].title
  const caption = scene === 5 && !slanted ? '灰色の横線は水面、緑の線は波面の断面です。まっすぐ届く光では、この二つの線が平行になり、波面の左右が同時に水へ届きます。' : scenes[scene].text

  return (
    <Paper p={{ base: 0, sm: 'md' }} className="wave-primer">
      <Group justify="space-between" mb="sm"><Title order={3}>光の「波」では、何が変わる？</Title><Badge variant="light">任意の詳細</Badge></Group>
      <Text size="sm" c="dimmed">本筋で使った波の目印を、各場所で繰り返す変化から見直します。どの場面にも直接移れます。</Text>
      <Tabs value={String(scene)} onChange={value => { if (value !== null) chooseScene(Number(value)) }}>
        <Tabs.List className="wave-scenes" aria-label="光の基礎の場面">
          {scenes.map((item, index) => <Tabs.Tab key={item.label} value={String(index)}>{item.label}</Tabs.Tab>)}
        </Tabs.List>
        <Tabs.Panel value={String(scene)} pt="lg">
          <Title order={4}>{title}</Title>
          <Text className="wave-caption" mt="sm">{caption}</Text>
          <div className="wave-workspace">
            <div className="wave-tools">
              {scene === 1 && <Switch label="磁場の向きも重ねる" checked={magnetic} onChange={event => setMagnetic(event.currentTarget.checked)} />}
              {scene === 2 && <>
                <Text size="sm" fw={600} mb="xs" id={`${id}-interference`}>壁の一点に届く、二つの変化</Text>
                <SegmentedControl fullWidth aria-labelledby={`${id}-interference`} value={opposite ? 'opposite' : 'same'} onChange={value => { setOpposite(value === 'opposite'); clock.reset() }} data={[{ value: 'same', label: 'そろえる' }, { value: 'opposite', label: '逆にする' }]} />
              </>}
              {scene === 3 && <>
                <Text size="sm" fw={600} mb="xs" id={`${id}-pair`}>AとBで比べる段階</Text>
                <SegmentedControl fullWidth orientation="vertical" aria-labelledby={`${id}-pair`} value={String(pair)} onChange={value => { setPair(Number(value)); clock.reset() }} data={['同じ進み具合', '¼周ずれる', '½周ずれる', '同じ値・違う途中'].map((label, index) => ({ value: String(index), label }))} />
              </>}
              {scene === 4 && <>
                <Text size="sm" fw={600} mb="xs" id={`${id}-view`}>同じ場所の集まりを見る</Text>
                <SegmentedControl fullWidth aria-labelledby={`${id}-view`} value={space ? 'space' : 'section'} onChange={value => setSpace(value === 'space')} data={[{ value: 'section', label: '上からの断面' }, { value: 'space', label: '空間の面' }]} />
              </>}
              {scene === 5 && <>
                <Text size="sm" fw={600} mb="xs" id={`${id}-boundary`}>水面への入り方</Text>
                <SegmentedControl fullWidth aria-labelledby={`${id}-boundary`} value={slanted ? 'slanted' : 'straight'} onChange={value => { setSlanted(value === 'slanted'); clock.reset() }} data={[{ value: 'slanted', label: '斜めに入る' }, { value: 'straight', label: 'まっすぐ入る' }]} />
                <Switch mt="md" label="水面に90°の基準線（法線）" checked={normal} onChange={event => setNormal(event.currentTarget.checked)} />
              </>}
              <Text size="sm" fw={600} mt={scene === 0 ? 0 : 'lg'} mb="xs">静止した場面を選ぶ</Text>
              <Group gap="xs">
                {(scene === 5 ? [{ time: 0, label: '入る前' }, { time: slanted ? 3 : WAVE_PRESENTATION_DURATION * 0.5 / 1.2, label: slanted ? '片側が入る' : '同時に届く' }, { time: 8, label: '入った後' }] : [{ time: 0, label: '始め' }, { time: 0.5, label: '¼周期後' }, { time: 1, label: '½周期後' }]).map(item => <Button key={item.label} variant="default" onClick={() => clock.seek(item.time)}>{item.label}</Button>)}
              </Group>
              <Group mt="md" gap="xs">
                <Button disabled={clock.reducedMotion} onClick={clock.toggle}>{clock.running ? '説明を停止' : clock.time >= WAVE_PRESENTATION_DURATION ? '説明をもう一度再生' : '動きを再生'}</Button>
                <Button variant="default" onClick={clock.reset}>時間を0秒に戻す</Button>
              </Group>
              <Text size="sm" mt="md" mb="sm">説明の時間：{clock.time.toFixed(2)} / {WAVE_PRESENTATION_DURATION} 秒</Text>
              <Slider min={0} max={WAVE_PRESENTATION_DURATION} step={0.05} value={clock.time} onChange={clock.seek} thumbLabel="基礎アニメーションの時間" thumbProps={{ 'aria-valuetext': `${clock.time.toFixed(2)}秒` }} label={value => `${value.toFixed(2)} s`} />
              <Text size="sm" c="dimmed" mt="md">{scene === 5 ? '説明の8秒を、波面が境目を通る約4ナノ秒に引き延ばしています。' : scene === 0 ? '説明の2秒が、ひもの一周期（実際の2秒）に対応します。' : '説明の2秒が光の一周期です。実際の一周期は約2 × 10⁻¹⁵秒で、表示は約10¹⁵倍に遅くしています。'}</Text>
              {clock.reducedMotion && <Text size="sm" mt="sm">動きを減らす設定です。再生せず、静止場面と時間スライダーで関係をたどれます。</Text>}
            </div>
            <div className="wave-display">
              <svg className="wave-visual" viewBox={`0 0 560 ${scene === 2 ? 490 : scene === 3 ? 420 : 330}`} role="img" aria-labelledby={`${id}-title ${id}-desc`}>
                <title id={`${id}-title`}>{title}</title>
                <desc id={`${id}-desc`}>{caption}{scene === 3 && `場所Aは${trendLabel(a.trend)}、場所Bは${trendLabel(b.trend)}。`}</desc>
                <defs>
                  <marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="context-stroke"/></marker>
                  <clipPath id={`${id}-boundary-clip`}><rect x="25" y="25" width="510" height="275"/></clipPath>
                </defs>
                {scene === 0 && <>
                  <text x="40" y="30">ひもの形</text>
                  <line x1="40" x2="520" y1="160" y2="160" stroke="#9aa7b7" strokeDasharray="4 4"/>
                  <path d={ropeSamples.map((point, i) => `${i ? 'L' : 'M'}${40 + point.x * 160},${160 - point.value * 65}`).join(' ')} fill="none" stroke="#2563eb" strokeWidth="3"/>
                  <line x1="120" x2="120" y1="80" y2="245" stroke="#b45517" strokeDasharray="5 5"/>
                  <circle cx="120" cy={160 - observePeriodicWave(teachingRope, 0.5, ropeTime).value * 65} r="8" fill="#b45517"/>
                  <text x="45" y="275">印の横の位置は変わらない</text>
                  <line x1="330" x2="500" y1="50" y2="50" stroke="#2563eb" strokeWidth="3" markerEnd={`url(#${id}-arrow)`}/>
                  <text x="320" y="82">山の並びは右へ</text>
                </>}
                {scene === 1 && <>
                  <text x="40" y="30">矢印＝電場の向きと大きさ</text>
                  <line x1="40" x2="520" y1="175" y2="175" stroke="#9aa7b7"/>
                  {lightSamples.filter((_, i) => i % 10 === 0).map(point => <g key={point.x}>
                    <line x1={lightX(point.x)} x2={lightX(point.x)} y1="175" y2={175 - point.value * 65} stroke="#2563eb" strokeWidth="2" markerEnd={Math.abs(point.value) > 0.05 ? `url(#${id}-arrow)` : undefined}/>
                    {magnetic && <g><circle cx={lightX(point.x)} cy="275" r="8" fill="white" stroke="#147a65"/>{Math.abs(point.value) > 0.05 && (point.value > 0 ? <circle cx={lightX(point.x)} cy="275" r="3" fill="#147a65"/> : <path d={`M${lightX(point.x)-4},271 l8,8 m0,-8 l-8,8`} stroke="#147a65"/>)}</g>}
                  </g>)}
                  <line x1="80" x2="80" y1="105" y2="245" stroke="#b45517" strokeDasharray="4 4"/>
                  <circle cx="80" cy="175" r="4" fill="#b45517"/><text x="80" y="100" textAnchor="middle">P</text>
                  <line x1="330" x2="500" y1="70" y2="70" stroke="#26364b" strokeWidth="3" markerEnd={`url(#${id}-arrow)`}/>
                  <text x="300" y="100">変化が伝わる向き</text>
                  {magnetic && <><text x="40" y="315">磁場：⊙ 手前 ／ ⊗ 奥へ</text><text x="340" y="315">空の円：ほぼ0</text></>}
                </>}
                {scene === 2 && <>
                  <text x="30" y="25">一つの光を、二つの隙間へ</text>
                  <circle cx="55" cy="85" r="12" fill="#e2b634"/>
                  <text x="30" y="140">光源</text>
                  <path d="M70 85 L170 60 M70 85 L170 110" fill="none" stroke="#93a8c4" strokeWidth="2"/>
                  <path d="M175 38 V53 M175 67 V103 M175 117 V132" stroke="#617086" strokeWidth="8"/>
                  <text x="125" y="155">二つの隙間</text>
                  <path d="M185 60 L465 85" fill="none" stroke="#2563eb" strokeWidth="2"/>
                  <path d="M185 110 L465 85" fill="none" stroke="#b45517" strokeWidth="2" strokeDasharray="7 5"/>
                  <line x1="470" x2="470" y1="38" y2="130" stroke="#617086" strokeWidth="5"/>
                  <circle cx="465" cy="85" r="7" fill="#147a65"/>
                  <text x="495" y="90">壁</text>
                  <text x="310" y="155">この一点を見る ↓</text>
                  <g transform="translate(0 160)">
                  <text x="40" y="26">同じ壁の一点：二つの電場</text>
                  <line x1="40" x2="520" y1="100" y2="100" stroke="#9aa7b7"/>
                  <line x1="40" x2="40" y1="50" y2="300" stroke="#617086" strokeDasharray="4 4"/>
                  <path d={sampledPath(physicalTime, 100, 35, 'first', opposite ? Math.PI : 0)} fill="none" stroke="#2563eb" strokeWidth="3"/>
                  <path d={sampledPath(physicalTime, 100, 35, 'second', opposite ? Math.PI : 0)} fill="none" stroke="#b45517" strokeWidth="3" strokeDasharray="7 5"/>
                  <text x="40" y="175">足し合わせた電場（黒）</text>
                  <line x1="40" x2="520" y1="230" y2="230" stroke="#9aa7b7"/>
                  <path d={sampledPath(physicalTime, 230, 30, 'total', opposite ? Math.PI : 0)} fill="none" stroke="#26364b" strokeWidth="4"/>
                  <text x="40" y="320">今 → 時間 ／ 高さ＝電場の値</text>
                  </g>
                </>}
                {scene === 3 && <>
                  <path d={lightSamples.map((point, i) => `${i ? 'L' : 'M'}${lightX(point.x)},${90 - point.value * 38}`).join(' ')} fill="none" stroke="#9aa7b7" strokeWidth="2"/>
                  {[[positionA, a, 'A', '#2563eb'], [positionB, b, 'B', '#b45517']].map(([position, state, label, colour]) => {
                    const point = state as typeof a
                    const px = lightX(position as number)
                    return <g key={label as string}><line x1={px} x2={px} y1="40" y2="145" stroke={colour as string} strokeDasharray="4 4"/><circle cx={px} cy={90-point.value*38} r="6" fill={colour as string}/><text x={px} y="170" textAnchor="middle">{label as string}</text></g>
                  })}
                  {[a, b].map((state, i) => {
                    const cx = i === 0 ? 155 : 405
                    return <g key={i}>
                      <circle cx={cx} cy="295" r="48" fill="none" stroke="#c4cfdb" strokeWidth="2"/>
                      <text x={cx} y="202" textAnchor="middle">場所{i === 0 ? 'A' : 'B'}の一周</text>
                      <circle cx={cx + 48 * Math.cos(state.phase)} cy={295 - 48 * Math.sin(state.phase)} r="7" fill={i === 0 ? '#2563eb' : '#b45517'}/>
                      <text x={cx} y="235" textAnchor="middle">上の端</text>
                      <text x={cx} y="366" textAnchor="middle">下の端</text>
                      <text x={cx + 58} y="302">下がる</text>
                      <text x={cx - 58} y="302" textAnchor="end">上がる</text>
                      <text x={cx} y="403" textAnchor="middle">{trendLabel(state.trend)}</text>
                    </g>
                  })}
                </>}
                {scene === 4 && !space && <>
                  <text x="40" y="28">上から見る：緑は電場が上の端の場所</text>
                  {crests.map(crest => <g key={crest}>
                    <line x1={lightX(crest)} x2={lightX(crest)} y1="60" y2="260" stroke={crest === highlighted ? '#147a65' : '#b9d9d1'} strokeWidth={crest === highlighted ? 5 : 2}/>
                    {[90, 150, 230].map(py => <circle key={py} cx={lightX(crest)} cy={py} r="5" fill="#147a65"/>)}
                  </g>)}
                  <line x1="40" x2="520" y1="150" y2="150" stroke="#26364b" strokeWidth="3" markerEnd={`url(#${id}-arrow)`}/>
                  <path d={`M${lightX(highlighted)},170 h20 v-20`} stroke="#26364b" fill="none"/>
                  <text x="320" y="305">右へ進む矢印と90°</text>
                </>}
                {scene === 4 && space && <>
                  <text x="40" y="26">面の奥行きも描いた模式図</text>
                  {crests.map(crest => {
                    const px = 55 + crest / teachingLight.wavelength * 130
                    return <polygon key={crest} points={`${px-25},230 ${px-25},95 ${px+25},45 ${px+25},180`} fill="#d6eee7" fillOpacity="0.65" stroke={crest === highlighted ? '#147a65' : '#a6cbbf'} strokeWidth={crest === highlighted ? 4 : 2}/>
                  })}
                  <line x1="40" x2="510" y1="160" y2="160" stroke="#26364b" strokeWidth="3" markerEnd={`url(#${id}-arrow)`}/>
                  <text x="40" y="285">面を突き抜ける向きが、進む向き</text>
                  <text x="40" y="318">この進む向きを線にしたものが「光線」</text>
                </>}
                {scene === 5 && <>
                  <rect x="25" y="170" width="510" height="130" fill="#d6eee7"/>
                  <line x1="25" x2="535" y1="170" y2="170" stroke="#617086" strokeWidth="3"/>
                  <text x="35" y="48">空気</text><text x="35" y="280">水</text>
                  <text x="375" y="158">接する水面</text>
                  <g clipPath={`url(#${id}-boundary-clip)`}>
                    <path d={front.map((point,i) => `${i ? 'L' : 'M'}${frontX(point.x)},${frontY(point.y)}`).join(' ')} fill="none" stroke="#147a65" strokeWidth="5"/>
                    {[-0.5,0.5].map(value => {
                      const point = boundaryFrontPoint(value, clock.time, slanted ? Math.PI / 4 : 0)
                      // Keep a local direction arrow inside its medium, rather than implying a straight path across the water surface.
                      const length = Math.min(55, Math.abs(frontY(point.y) - 170) * 0.8 / Math.abs(point.direction.y))
                      return <g key={value}>
                        {length > 8 && <line x1={frontX(value)} y1={frontY(point.y)} x2={frontX(value) + point.direction.x * length} y2={frontY(point.y) - point.direction.y * length} stroke="#26364b" strokeWidth="2" markerEnd={`url(#${id}-arrow)`}/>}
                        <circle cx={frontX(value)} cy={frontY(point.y)} r="7" fill="#147a65"/>
                      </g>
                    })}
                    {normal && <><line x1="280" x2="280" y1="25" y2="300" stroke="#b45517" strokeDasharray="5 5"/><path d="M280 150 h20 v20" fill="none" stroke="#b45517"/><text x="290" y="80">法線</text></>}
                  </g>
                  <text x="35" y="325">緑＝波面の断面</text><text x="310" y="325">黒＝光の進む向き</text>
                </>}
              </svg>
              <Paper withBorder p="md" className="wave-reading">
                <Text size="sm" fw={600}>図のここを見る</Text>
                {scene === 0 && <Text mt="sm">オレンジの印は同じ横の位置にとどまり、上下します。青い山の並びは右へ進みます。各場所で繰り返す変化が隣の場所へ伝わる、この現象を「波」と呼びます。ひもの一部が右へ流れているわけではありません。</Text>}
                {scene === 1 && <>
                  <Text mt="sm">場所Pの矢印は、今{Math.abs(fieldAtP.value) < 1e-8 ? 'ほぼ0です' : fieldAtP.value > 0 ? '上向きです' : '下向きです'}。場所は固定したまま、力の向きと大きさが変わります。場所ごとに、置いた正の電荷にはたらく力を電荷の量で割ったものが「電場」です。</Text>
                  <Text size="sm" mt="sm">場所Pの電場：{fieldAtP.electricField.toFixed(2)} V/m（上向きを正）</Text>
                  <Text mt="sm">矢印の先端は物体の位置ではありません。ひもの上下の代わりに、光では電場と磁場が繰り返し変わります。その変化が、ひもも水もない真空を伝わります。</Text>
                  {magnetic && <Text size="sm" mt="sm">緑の記号は磁場の向きです。⊙は手前、⊗は奥、空の円はほぼ0。磁場は動く電荷にはたらく力に関わります。この平らな光では、電場の上下・磁場の奥と手前・伝わる右向きが、互いに90°です。記号の大きさは磁場の強さを表しません。</Text>}
                </>}
                {scene === 2 && <>
                  <Text mt="sm">{opposite ? '青の実線とオレンジの破線は、同じ大きさで逆向きに変わります。足した黒い電場は、どの時刻でも0です。この一点は暗くなります。' : '青の実線とオレンジの破線は重なっています。足した黒い電場は、上下の振れ幅が各波の2倍です。この条件では平均の光の強さは一つの光の4倍です。'}</Text>
                  <Text size="sm" mt="sm">グラフの左端が今の値：{interference.first.toFixed(2)} ＋ ({interference.second.toFixed(2)}) ＝ {interference.total.toFixed(2)} V/m</Text>
                  <Text fw={600} mt="sm">時間平均の強さ：{interference.relativeMeanIntensity.toFixed(0)}（一つの光＝1）</Text>
                  <Text mt="sm">二つの変化が重なり、強め合ったり打ち消し合ったりすることを「干渉」と呼びます。壁の場所が変わると、二つの光が進んだ距離の差も変わり、そろう場所と逆になる場所が縞として現れます。</Text>
                  <Text size="sm" c="dimmed" mt="sm">図は壁の一点の重なりを比べる説明です。選択で変えるのは到着した変化のずれで、描いた経路の長さは計算に使いません。同じ周波数・振れ幅・電場の方向で、ずれが一定の二つの光を扱います。</Text>
                </>}
                {scene === 3 && <>
                  <Text mt="sm">{pair === 0 ? 'AとBの円の点は同じ位置にあり、値も、上がる・下がるタイミングもそろいます。' : pair === 3 ? equalValues ? '今、AとBの値は等しいのに、一方は上がり、もう一方は下がっています。同じ値だけでは、繰り返しの途中まで同じとはいえません。' : '今の値は異なります。「始め」に戻すと、値が等しく、変わる向きが反対の瞬間を比べられます。' : 'AとBの円の点は別の位置です。繰り返す形が同じでも、上がる・下がるタイミングはずれています。'}</Text>
                  <Text size="sm" mt="sm">A：{a.electricField.toFixed(2)} V/m・{trendLabel(a.trend)}<br />B：{b.electricField.toFixed(2)} V/m・{trendLabel(b.trend)}</Text>
                  <Text mt="sm">繰り返しの一周のどの段階かを「位相」、段階のずれを「位相差」と呼びます。円はこの段階を示す目盛りで、粒子が円を回っている図ではありません。</Text>
                  {pair === 0 && <Text size="sm" mt="sm">AとBは山から次の山までの距離だけ離れています。一周分離れても、繰り返しの段階は同じです。</Text>}
                </>}
                {scene === 4 && <>
                  <Text mt="sm">{space ? '緑の四角い面は、電場が上の端になる場所を奥行きまでつないだものです。' : '緑の縦線上の点は、電場がどれも上の端です。「空間の面」へ切り替えると、この場所の集まりを奥行きまで見られます。'} 繰り返しの同じ段階にある場所がつくる面を「波面」と呼びます。</Text>
                  <Text mt="sm">この平らな波は、緑の面に90°の向きへ伝わります。黒い矢印がその向きです。向きを線で表したものが「光線」で、本筋の図でも同じ関係を使いました。</Text>
                  <Text size="sm" c="dimmed" mt="sm">緑の面は変化の段階で選んだ場所の集まりです。物質の壁や水の表面ではありません。一様・等方的な空間を進む平面波を扱っています。</Text>
                </>}
                {scene === 5 && <>
                  <Text mt="sm">{slanted ? !front[0].inWater ? '今は波面全体が空気中です。「片側が入る」を選ぶと、左側だけが水中で遅くなった状態を見られます。' : !front[front.length - 1].inWater ? '左側は水中、右側は空気中です。先に水へ入った側から遅く進み、緑の波面の傾きが変わっています。' : '今は波面全体が水中です。入る時刻と速さの違いによって、空気中とは波面の傾きが変わりました。' : !front[0].inWater ? '波面は水面と平行に近づきます。左右に到着時刻の差はありません。' : '波面全体が同時に水へ届き、その後も平行に進みます。速さは変わっても、光の向きは変わりません。'}</Text>
                  <Text mt="sm">黒い矢印は緑の波面に90°の光の向きで、長さは速さを表しません。{normal && ' 点線の法線が90°なのは、灰色の水面です。基準となる対象は、波面と水面で異なります。'}</Text>
                  <Text size="sm" c="dimmed" mt="sm">本筋の「列が傾く → 光の向きが変わる」を、同じ波面の通過として見ています。光の角度はスネルの法則から計算し、反射と電場の強さは省いています。</Text>
                </>}
              </Paper>
            </div>
          </div>
          <Group justify="space-between" mt="lg">
            <Button variant="subtle" disabled={scene === 0} onClick={() => chooseScene(scene - 1)}>← 前の場面</Button>
            <Button variant="light" disabled={scene === scenes.length - 1} onClick={() => chooseScene(scene + 1)}>{scene === scenes.length - 1 ? '最後の場面' : `${scenes[scene + 1].label} →`}</Button>
          </Group>
        </Tabs.Panel>
      </Tabs>
      <Accordion variant="separated" mt="lg">
        <Accordion.Item value="model"><Accordion.Control>図の尺度・式・扱っている範囲</Accordion.Control><Accordion.Panel>
          <Text size="sm">山から次の山までの距離が波長 λ、一周にかかる時間が周期 T です。x は波が進む方向に沿って測る位置、t は物理時刻です。</Text>
          <Text size="sm" mt="sm">ひもは波長1 m、周期2 s、上下の振れ幅0.2 mの理想的な正弦波です。正弦波は、同じ形を滑らかに繰り返す sin の式で表します。</Text>
          <Text size="sm" mt="sm">光は真空中の波長600 nm（1 nm = 10⁻⁹ m）、電場の振れ幅1 V/mの平らな波です。周期は波長÷光速です。電場は E = E₀ sin(2π(x/λ − t/T))、磁場は B = E/c で計算します。E₀は電場の振れ幅、cは真空中の光速です。</Text>
          <Text size="sm" mt="sm">説明の2秒を一周に対応させています。光の一周は約2.00 × 10⁻¹⁵ sで、この表示は約10¹⁵倍に遅くしています。画面の上下の長さは電場の大きさの表示で、空間中の移動距離ではありません。円は位相の説明用で、物体の軌道ではありません。</Text>
          <Text size="sm" mt="sm">干渉は、一秒に繰り返す回数（周波数）、電場の振れ幅、電場が変わる方向が同じ二つの光に限った式です。二つの繰り返しのずれも一定とします。光源・隙間・壁の配置は模式図です。</Text>
          <Text size="sm" mt="sm">青の実線とオレンジの破線が各波、黒が合成した場の時間変化。強さは周期で平均し、瞬間の電場の上下とは区別します。</Text>
          <Text size="sm" mt="sm">最後の水面の図は、境界上1.2 mの幅に一つの波面だけを選んだ幾何学的な説明で、8秒の演出を約4.00 × 10⁻⁹ sに対応させます。縦横の空間の縮尺は同じです。反射光・電場の強さ・色による速さの違いを省きます。</Text>
          <Text size="sm" mt="sm">各場面は解析式または説明の模式図で、実測でも電磁場の数値シミュレーションでもありません。</Text>
        </Accordion.Panel></Accordion.Item>
      </Accordion>
    </Paper>
  )
}
