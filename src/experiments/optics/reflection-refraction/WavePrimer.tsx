import { Accordion, Badge, Button, Group, Paper, Slider, Text, Title } from '@mantine/core'
import { useId, useState } from 'react'
import {
  boundaryFrontPoint, observeInterference, observePeriodicWave, observeTeachingLight,
  teachingLight, teachingRope, waveCrestPositions, wavePhysicalTime, WAVE_PRESENTATION_DURATION,
} from './model'
import { useWavePresentation } from './useWavePresentation'
import './wave-primer.css'

const scenes = [
  { label: '何が伝わる？', title: 'その場所の動きと、伝わる変化を分けて見る', text: 'オレンジの印はひもの同じ場所に付いています。再生すると、印は上下し、山の形は右へ進みます。印の動く向きと、山の進む向きを比べます。' },
  { label: '光で変わるもの', title: '各場所の矢印が変わり、その並びが伝わる', text: '小さな＋の電気を帯びた粒を置いたとき、電気の力がどちらへはたらくかを青い矢印で示します。長い矢印の場所ほど、同じ粒にはたらく力が大きくなります。この図では、矢印の向きと長さが繰り返し変わります。' },
  { label: '波と考える手がかり', title: '光を重ねると、明るくなる場所も暗くなる場所もある', text: '一つの光を二つの細い隙間に通す実験では、壁に明暗の縞が現れます。上の図の緑の点は、二つの光が届く壁上の一点です。下のグラフは、その点での二つの電場と、足し合わせた電場の時間変化を表します。' },
  { label: '同じタイミングとは', title: '二つの場所は、繰り返しのどこにいる？', text: '上の図のAとBは、電場を見る二つの場所です。下の円は、各場所の「上がる → 上の端 → 下がる → 下の端」という一周を表します。円の上の点は、いま一周のどの段階にいるかを示します。' },
  { label: '場所をつないで見る', title: '変化がそろう場所を、空間の面として見る', text: '電場が上の端になる場所を緑で示します。上から見ると縦線になります。「空間の面を見る」に切り替えると、この場所の集まりに奥行きがある様子を見られます。' },
  { label: '空気と水の間', title: '先に水へ届く部分から、進む速さが変わる', text: '灰色の横線は、空気と水が接する水面です。緑の線は、同じ位相を示す波面の断面です。斜めに入る場合、緑の線の左側が先に水へ届きます。' },
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

export default function WavePrimer() {
  const [scene, setScene] = useState(0)
  const [magnetic, setMagnetic] = useState(false)
  const [opposite, setOpposite] = useState(false)
  const [pair, setPair] = useState(0)
  const [space, setSpace] = useState(false)
  const [slanted, setSlanted] = useState(true)
  const [normal, setNormal] = useState(false)
  const clock = useWavePresentation()
  const id = useId()
  const physicalTime = wavePhysicalTime(clock.time, teachingLight)
  const ropeTime = wavePhysicalTime(clock.time, teachingRope)
  const lightSamples = Array.from({ length: 25 }, (_, i) => ({ x: i / 24 * 3 * teachingLight.wavelength, ...observeTeachingLight(i / 24 * 3 * teachingLight.wavelength, physicalTime) }))
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
  const chooseScene = (next: number) => { clock.reset(); setScene(next) }
  const relativeIntensity = observeInterference(physicalTime, opposite ? Math.PI : 0).relativeMeanIntensity

  return (
    <Paper withBorder p={{ base: 'md', sm: 'xl' }} className="wave-primer">
      <Group justify="space-between" mb="sm"><Title order={3}>ひもの動きから、水面での光の向きへ</Title><Badge variant="light">停止して見られる説明図</Badge></Group>
      <Text c="dimmed" size="sm">六つの場面を切り替えられます。再生ボタンで動かし、時間スライダーで途中の静止画を選べます。</Text>
      <nav className="wave-scenes" aria-label="光の基礎の場面">
        {scenes.map((item, index) => <Button key={item.label} variant={scene === index ? 'light' : 'default'} aria-pressed={scene === index} onClick={() => chooseScene(index)}>{index + 1}. {item.label}</Button>)}
      </nav>
      <Title order={4} mt="lg">{scenes[scene].title}</Title>
      <Text className="wave-caption" mt="sm">{scenes[scene].text}</Text>
      <svg className="wave-visual" viewBox={`0 0 560 ${scene === 2 ? 490 : scene === 3 ? 420 : 330}`} role="img" aria-labelledby={`${id}-title ${id}-desc`}>
        <title id={`${id}-title`}>{scenes[scene].title}</title>
        <desc id={`${id}-desc`}>{scenes[scene].text}{scene === 3 && `場所Aは${trendLabel(a.trend)}、場所Bは${trendLabel(b.trend)}。`}</desc>
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
          {lightSamples.filter((_, i) => i % 2 === 0).map(point => <g key={point.x}>
            <line x1={lightX(point.x)} x2={lightX(point.x)} y1="175" y2={175 - point.value * 65} stroke="#2563eb" strokeWidth="2" markerEnd={Math.abs(point.value) > 0.05 ? `url(#${id}-arrow)` : undefined}/>
            {magnetic && <g><circle cx={lightX(point.x)} cy="275" r="8" fill="white" stroke="#147a65"/>{Math.abs(point.value) > 0.05 && (point.value > 0 ? <circle cx={lightX(point.x)} cy="275" r="3" fill="#147a65"/> : <path d={`M${lightX(point.x)-4},271 l8,8 m0,-8 l-8,8`} stroke="#147a65"/>)}</g>}
          </g>)}
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
          <text x="40" y="26">一つの場所で、繰り返す二つの電場</text>
          <path d={sampledPath(physicalTime, 100, 35, 'first', opposite ? Math.PI : 0)} fill="none" stroke="#2563eb" strokeWidth="3"/>
          <path d={sampledPath(physicalTime, 100, 35, 'second', opposite ? Math.PI : 0)} fill="none" stroke="#b45517" strokeWidth="3" strokeDasharray="7 5"/>
          <text x="40" y="175">足し合わせた電場（黒）</text>
          <line x1="40" x2="520" y1="230" y2="230" stroke="#9aa7b7"/>
          <path d={sampledPath(physicalTime, 230, 30, 'total', opposite ? Math.PI : 0)} fill="none" stroke="#26364b" strokeWidth="4"/>
          <text x="40" y="320">横軸＝時間 ／ 高さ＝電場の値</text>
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
            const cx = i === 0 ? 140 : 420
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
          <text x="40" y="28">上から見た図：緑は同じ進み具合</text>
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

      {scene === 0 && <Text className="wave-key">印は右へ運ばれていなくても、ひもの形の変化は右へ伝わります。このように、各場所で起こる変化が周囲へ伝わる現象が「波」です。次の場面では、光で変わるものを見ます。</Text>}
      {scene === 1 && <>
        <Text className="wave-key">各場所で電気の力を決める向きと大きさを「電場」と呼びます。光では電場と磁場が繰り返し変わり、その変化が空間を伝わります。青い矢印の先端は電場の値で、ひものように物体が上下する場所ではありません。</Text>
        <Text size="sm" mt="sm">光は真空でも伝わります。ひもの波と違い、上下する物質を必要としません。</Text>
        <Button variant="default" mt="sm" aria-pressed={magnetic} onClick={() => setMagnetic(!magnetic)}>{magnetic ? '電場だけを見る' : '磁場の向きも重ねる'}</Button>
        {magnetic && <Text mt="sm">動く電気を帯びた粒にはたらく力に関わる、もう一つの量が「磁場」です。緑の記号はその向きを表します。⊙は画面から手前、⊗は画面の奥です。この光では、上下の電場、奥と手前の磁場、右向きの伝わる方向が互いに90°です。</Text>}
      </>}
      {scene === 2 && <>
        <Group gap="xs"><Button variant={!opposite ? 'light' : 'default'} aria-pressed={!opposite} onClick={() => { setOpposite(false); clock.reset() }}>二つの変化をそろえる</Button><Button variant={opposite ? 'light' : 'default'} aria-pressed={opposite} onClick={() => { setOpposite(true); clock.reset() }}>二つの変化を逆にする</Button></Group>
        <Text className="wave-key" mt="md">{opposite ? '青の実線とオレンジの破線が、同じ大きさで逆向きに変わります。足し合わせた黒い電場は0になり、この観察場所は暗くなります。' : '青の実線とオレンジの破線が重なっています。足し合わせた黒い電場の振れ幅は、各波の2倍になります。この条件では、時間平均の光の強さは一つの光の4倍です。'}</Text>
        <Text size="sm" c="dimmed" mt="sm">重なり方によって強め合ったり打ち消し合ったりする性質を「干渉」と呼びます。明暗の縞という実験の結果を、電場の重なりで説明できることが、光を波として扱う手がかりです。この図は壁の一点の式を示し、縞全体や実測値は描いていません。</Text>
        <span className="intensity-swatch" style={{ backgroundColor: opposite ? '#26364b' : '#fff1a8', color: opposite ? 'white' : '#26364b' }}>時間平均の強さ：{relativeIntensity.toFixed(0)}（一つの光＝1）</span>
      </>}
      {scene === 3 && <>
        <Group gap="xs">{['同じ進み具合', '¼周ずれる', '½周ずれる', '高さだけ同じ'].map((label,i) => <Button key={label} variant={pair === i ? 'light' : 'default'} aria-pressed={pair === i} onClick={() => { setPair(i); clock.reset() }}>{label}</Button>)}</Group>
        <Text className="wave-key" mt="md">{pair === 0 ? 'AとBの円の点は同じ位置にあり、電場も同じタイミングで変わります。一周のどの段階かを「位相」と呼びます。この例では山一つ分だけ場所が離れていても、繰り返しの段階は同じなので、同じ位相です。' : pair === 3 ? '時刻0では電場の値が同じですが、Aは下がる途中、Bは上がる途中です。一周のどの段階かを表す「位相」は違います。値の一致と位相の一致を、円の点で区別できます。' : '円の点がずれています。一周のどの段階かを「位相」と呼び、ここではAとBの位相が異なります。どちらの場所にも位相があり、「位相がない場所」を示しているわけではありません。'}</Text>
      </>}
      {scene === 4 && <>
        <Group gap="xs"><Button variant={!space ? 'light' : 'default'} aria-pressed={!space} onClick={() => setSpace(false)}>上から見る</Button><Button variant={space ? 'light' : 'default'} aria-pressed={space} onClick={() => setSpace(true)}>空間の面を見る</Button></Group>
        <Text className="wave-key" mt="md">{space ? '同じ位相の場所がつくる連続した面を「波面」と呼びます。緑はその面、黒い矢印は光の進む向きです。この平らな波では、黒い矢印は緑の面を正面から突き抜けます。進む向きを線で表したものが「光線」です。' : '同じ位相の場所がつくる連続した面を「波面」と呼びます。緑の縦線はその断面です。右向きの黒い矢印との間に描いた四角は、90°の角度、つまり「垂直」を示します。'}</Text>
      </>}
      {scene === 5 && <>
        <Group gap="xs"><Button variant={slanted ? 'light' : 'default'} aria-pressed={slanted} onClick={() => { setSlanted(true); clock.reset() }}>斜めに入る</Button><Button variant={!slanted ? 'light' : 'default'} aria-pressed={!slanted} onClick={() => { setSlanted(false); clock.reset() }}>まっすぐ入る</Button><Button variant="default" aria-pressed={normal} onClick={() => setNormal(!normal)}>水面に90°の基準線を見る</Button></Group>
        <Text className="wave-key" mt="md">{slanted ? '説明の時間を3秒付近で止めると、左側は水中、右側は空気中にあります。左側から進む速さが小さくなり、緑の線の向きが変わります。光の進む向きも変わります。' : 'まっすぐ入ると、緑の線全体が同時に水へ届きます。進む速さは変わりますが、左右の到達時刻に差がないため、光の向きは変わりません。'} 黒い矢印は、その部分の波面に90°の向きです。長さは速さを表しません。{normal && ' 水面に90°で立てた基準線を「法線」と呼びます。黒い矢印が垂直なのは緑の波面で、法線が垂直なのは灰色の水面です。'}</Text>
      </>}

      {scene === 4 && <Text size="sm" mt="sm">「場所を結ぶ」は、条件に合う場所を図でつなぐことです。緑の面は物質の壁や表面を表していません。</Text>}
      <Group mt="lg" gap="sm">
        <Button disabled={clock.reducedMotion} onClick={clock.toggle}>{clock.running ? '説明を停止' : clock.time >= WAVE_PRESENTATION_DURATION ? '説明をもう一度再生' : '動きを再生'}</Button>
        <Button variant="default" onClick={clock.reset}>この場面を初期化</Button>
      </Group>
      <Text size="sm" mt="md" mb="sm">説明の時間：{clock.time.toFixed(1)} / {WAVE_PRESENTATION_DURATION} 秒</Text>
      <Slider min={0} max={WAVE_PRESENTATION_DURATION} step={0.05} value={clock.time} onChange={clock.seek} thumbLabel="基礎アニメーションの時間" thumbProps={{'aria-valuetext':`${clock.time.toFixed(1)}秒`}} label={value => `${value.toFixed(1)} s`}/>
      {clock.reducedMotion && <Text size="sm" mt="md">動きを減らす設定です。再生せず、時間スライダーで静止した場面を見られます。</Text>}
      <Group justify="space-between" mt="lg"><Button variant="subtle" disabled={scene === 0} onClick={() => chooseScene(scene - 1)}>前の場面</Button><Button variant="light" disabled={scene === scenes.length - 1} onClick={() => chooseScene(scene + 1)}>次の場面へ</Button></Group>
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
