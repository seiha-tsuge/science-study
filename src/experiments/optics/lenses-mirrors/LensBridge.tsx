import { Paper, SegmentedControl, Stack, Switch, Text, Title } from '@mantine/core'
import { useId, useState } from 'react'
import { observeSandRow } from './model'
import { AnimationControls } from './Animation'
import { useImageAnimation } from './useImageAnimation'
import WaveMarkerGuide from './WaveMarkerGuide'
import Observation from './Observation'

const stages = [
  { time: .25, label: '砂地に入る前' },
  { time: .7, label: '中央はまだ砂地' },
  { time: 1.1, label: '全員が出た後' },
]
const walkingObservations = [
  '道でも砂地でも同じ速さなら、同じ時間に進む距離は同じです。中央の砂地が長くても、列はまっすぐなままです。',
  'まだ全員が道の上です。右へ同じ距離だけ進むので、緑の列はまっすぐです。',
  '中央の人ほど長い砂地を通るため、遅い速さで歩く時間が長くなります。中央と両端が砂地にいるかを見比べてください。両端が道へ戻った後も中央は遅い速さで歩き、距離の差が広がります。',
  '全員が道へ戻っても、砂地でついた差は残ります。両端が先へ出て、中央が後ろに残るため、緑の列がくぼみます。',
]

export default function LensBridge({ active }: { active: boolean }) {
  const [view, setView] = useState('people')
  const [slower, setSlower] = useState(true)
  const [directions, setDirections] = useState(false)
  const id = useId().replaceAll(':', '')
  const people = view === 'people'
  const animation = useImageAnimation(active && people, 6.6, 1.5)
  const walkingTime = people ? animation.time / 6 : 1.1
  const row = observeSandRow(walkingTime, slower)
  const px = (x: number) => 30 + x * 440
  const py = (y: number) => 205 - y * 440
  const names = ['下端', '', '', '中央', '', '', '上端']
  const outline = Array.from({ length: 41 }, (_, index) => {
    const y = row.halfWidth * (index / 20 - 1)
    return `${index ? 'L' : 'M'}${px(row.entrance + row.widthAt(y))} ${py(y)}`
  }).join(' ') + ` L${px(row.entrance)} ${py(row.halfWidth)} L${px(row.entrance)} ${py(-row.halfWidth)} Z`
  const curved = slower && row.afterSand
  const angleMark = (p: { x: number; y: number }) => {
    const dx = row.focus ? px(row.focus.x) - px(p.x) : 55
    const dy = row.focus ? py(row.focus.y) - py(p.y) : 0
    const length = Math.hypot(dx, dy)
    const nx = dx / length * 10, ny = dy / length * 10
    const tx = -ny, ty = nx
    return `M${px(p.x) + nx} ${py(p.y) + ny} L${px(p.x) + nx + tx} ${py(p.y) + ny + ty} L${px(p.x) + tx} ${py(p.y) + ty}`
  }
  const front = curved
    ? Array.from({ length: 41 }, (_, index) => {
      const y = row.halfWidth * (index / 20 - 1)
      return `${index ? 'L' : 'M'}${px(row.center.x + .24 - row.widthAt(y))} ${py(y)}`
    }).join(' ')
    : row.walkers.map((p, index) => `${index ? 'L' : 'M'}${px(p.x)} ${py(p.y)}`).join(' ')
  return <>
    <div className="journey-intro"><Text className="eyebrow">場面 01 / 06</Text><Title order={4}>中央だけ長く遅れると、並びはどう変わる？</Title>
    <Text size="sm" c="dimmed" mt="sm">人の列を上から見た配置です。図の上下に並ぶ人が、全員右へ歩きます。真ん中の人ほど長い砂地を通ります。速さが変わる場合と変わらない場合を、「中央」「上端」「下端」の位置で比べます。</Text></div>
    <div className="journey-workspace">
      <div className="journey-tools">
        <Text fw={600} size="sm" mb="xs" id={`${id}-view`}>同じ並びを、何で見るか</Text>
        <SegmentedControl fullWidth aria-labelledby={`${id}-view`} value={view} onChange={next => { if (next !== view) { animation.seek(animation.time); setView(next) } }} data={[{ value: 'people', label: '人の列' }, { value: 'light', label: '光の目印へ' }]} />
        <Switch mt="md" label={people ? '砂地で歩く速さを半分にする' : 'レンズ内の光の速さが空気より遅い場合'} checked={slower} onChange={event => { setSlower(event.currentTarget.checked); animation.seek(animation.time) }} />
        {!people && <Switch mt="md" label="光の進む向き（緑の並びに90°）" checked={directions} onChange={event => setDirections(event.currentTarget.checked)} />}
        {people && <AnimationControls animation={animation} duration={6.6} stages={stages.map(item => ({ ...item, time: item.time * 6 }))} label="歩行時刻" timeScale={6} title="時間を選んで、中央と両端を比べる" />}
      </div>
      <div className="journey-visual">
        {!people && <WaveMarkerGuide />}
      <figure className="image-diagram image-bridge">
        <svg viewBox={`0 0 620 ${people ? 450 : 480}`} role="img" aria-label={people ? '中央だけ長い砂地を横一列で歩く人。中央と両端の位置を同じ時刻で比較する模式図。' : '人の列の中央と両端を、レンズを通った光の波の目印へ対応させる模式図。'}>
          <defs><marker id={`${id}-arrow`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8" fill="none" stroke="#1971c2" /></marker></defs>
          <path d={outline} fill={people ? '#f2e3c8' : '#e7f5ff'} stroke="#868e96" strokeWidth="2" />
          <text x={px(.52)} y="55" textAnchor="middle">{people ? '中央だけ長い砂地' : '中央が厚い透明なレンズ'}</text>
          <text x="35" y="85">{people ? '道' : '空気'}</text>
          {!people && <>
            <line x1={px(.2)} x2={px(.2)} y1={py(-row.halfWidth)} y2={py(row.halfWidth)} stroke="#147a65" strokeWidth="3" strokeDasharray="8 5" />
            <text x={px(.2)} y="380" textAnchor="middle">入る前</text>
            <text x={px(row.center.x)} y="380" textAnchor="middle">出た後</text>
            {directions && [-row.halfWidth, 0, row.halfWidth].map(y => <line key={y} x1={px(.2)} x2={px(.2) + 50} y1={py(y)} y2={py(y)} stroke="#1971c2" strokeWidth="2" markerEnd={`url(#${id}-arrow)`} />)}
          </>}
          <path d={front} fill="none" stroke="#147a65" strokeWidth="3" />
          {row.walkers.map((p, index) => <g key={index}>
            {people ? <g transform={`translate(${px(p.x)} ${py(p.y)})`}>
              <circle cy="-8" r="5" fill={p.inSand ? '#d9480f' : '#147a65'} /><path d="M0 -2 V12 M-7 4 L0 0 L7 4 M0 12 L-6 20 M0 12 L6 20" fill="none" stroke="#147a65" strokeWidth="2.5" />
            </g> : <circle cx={px(p.x)} cy={py(p.y)} r="5" fill="#147a65" />}
            {names[index] && <text x={px(p.x) + 13} y={py(p.y) - 14}>{names[index]}</text>}
            {people && (index === 0 || index === 3 || index === 6) && <line x1={px(p.x) - 65} x2={px(p.x) - 25} y1={py(p.y)} y2={py(p.y)} stroke="#1971c2" strokeWidth="2" markerEnd={`url(#${id}-arrow)`} />}
            {!people && directions && (index === 0 || index === 3 || index === 6) && <>
              <line x1={px(p.x)} y1={py(p.y)} x2={row.focus ? px(row.focus.x) : px(p.x) + 55} y2={row.focus ? py(row.focus.y) : py(p.y)} stroke="#1971c2" strokeWidth="2" markerEnd={`url(#${id}-arrow)`} />
              <path d={angleMark(p)} fill="none" stroke="#1971c2" strokeWidth="1.5" />
              <text x={px(p.x) - 33} y={py(p.y) + 25}>90°</text>
            </>}
          </g>)}
          {!people && directions && row.focus && <><circle cx={px(row.focus.x)} cy={py(0)} r="5" fill="#7048a5" /><text x={px(row.focus.x)} y={py(0) + 34} textAnchor="middle">集まる点</text></>}
          <text x="30" y={people ? 390 : 425}>{people ? '矢印：人はずっと右へ歩く' : '緑：波の同じ段階を結ぶ目印'}</text>
          <text x="30" y={people ? 425 : 460}>{people ? '緑：今の列 ／ 橙の頭：砂地の中' : '青：光が進む向き'}</text>
        </svg>
        <figcaption>{people ? '説明用の歩行の模式図。全員の出発時刻と道での速さは同じです。歩行時刻は0〜1.10秒。動きを6倍の時間に引き伸ばして見せます。' : '通過後の列の形だけを光の目印へ移した模式図です。人の軌道を光路へ置き換えた図でも、レンズ内部の光の運動を再現した図でもありません。'}</figcaption>
      </figure>
      </div>
      <Paper withBorder p="md" className="journey-explanation">
        <Text className="eyebrow">図のここを見る</Text>
        {people && <Observation current={walkingObservations[!slower ? 0 : walkingTime < .4 ? 1 : !row.afterSand ? 2 : 3]} alternatives={walkingObservations} />}
        <Stack gap="sm" mt="sm">
        {people ? <>
          <Text>人は全員、ずっと右へ歩きます。人の向きが内側へ曲がる、というたとえではありません。光へ渡すのは「中央ほど長く遅れると、並びの形が変わる」という関係です。</Text>
          <Text size="sm" c="dimmed">「光の目印へ」を選ぶと、通過後の並びへ直接移ります。途中の場面をすべて見る必要はありません。</Text>
        </> : <>
          <Text>まず水面の山を、横からの高さと上からの並びで見比べます。光では水の上下運動の代わりに、電気・磁気の状態が繰り返し変わり、その変化が伝わります。光そのものが水面のように上下するわけではありません。</Text>
          <Text>水面の山に当たる、繰り返しの同じ段階の場所を緑で結びます。人の中央・両端は、この光の目印の中央・両端へ対応させました。粒が並んで歩く意味ではありません。破線はレンズへ入る前、実線は出た後の目印です。</Text>
          <Text>{slower ? '空気より光の速さが遅い透明なレンズでは、厚い中央を通る波ほど長く遅れます。平らだった目印の並びは、中央が後ろに残る形へ変わります。' : '周囲と同じ速さなら、厚い中央でも余分な遅れはつきません。目印の並びは平らなままです。'}</Text>
          <Text>{!directions ? '次に「光の進む向き」を重ねて、並びの形と進む方向を分けて見ます。' : slower ? '光が進む向きは、人の歩いた向きではなく、各場所の緑の並びに90°の向きです。中央がくぼんだ並びでは、上端は下へ、下端は上へ向き、先の一点へ集まります。この平行に入った光が集まる点が焦点です。' : '平らな並びに90°の向きは、どこでも右向きです。上端と下端が内側へ向かないので、集まる点はできません。'}</Text>
          <Text size="sm" c="dimmed">この対応は、中央の遅れと並びの曲がり、空気中での光の向きの関係に限ります。砂地の形から実レンズの焦点距離は求めません。破線と実線は同じ目印の通過前後で、同時刻の二つの波ではありません。電気・磁気の変化の詳しい図は「光の反射と屈折」の任意の詳細へつながります。</Text>
        </>}
        </Stack>
      </Paper>
    </div>
    <Text mt="md">平行に入る光が集まる点を、「レンズで曲がる」の図ではFという目印で示します。次の図は焦点距離10 cmの別の縮尺ですが、平行に入る光が集まる点という役割は同じです。虫めがねでも、近くの文字からは光が広がって入るため、その広がりとレンズでの向きの変化を比べると、実際に集まる場合と、出た後も広がる場合へつながります。</Text>
  </>
}
