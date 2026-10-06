import { Badge, Button, Group, Paper, SegmentedControl, SimpleGrid, Stack, Tabs, Text, Title } from '@mantine/core'
import { useId, useState } from 'react'
import { observeStrawScenePoint, observeStrawShape, strawScene } from './model'

const x = (value: number) => 260 + value * 250
const y = (value: number) => 235 - value * 250
const pointPath = (points: readonly { x: number; y: number }[]) => points.map((p, i) => `${i ? 'L' : 'M'}${x(p.x)},${y(p.y)}`).join(' ')
const steps = ['同じストロー', '目へ届く光', '見える場所'] as const

export function StrawScene({ water, explanation = false, step = 0, caption = true }: { water: boolean; explanation?: boolean; step?: number; caption?: boolean }) {
  const id = useId()
  const result = observeStrawScenePoint(water)
  const shape = observeStrawShape(water)
  const actual = [strawScene.top, { x: 0, y: 0 }, strawScene.tip]
  const visible = [strawScene.top, { x: 0, y: 0 }, ...shape]
  const showRays = explanation && step >= 1
  const showPosition = explanation && step >= 2
  const path = explanation ? actual : visible
  const marker = explanation ? result.object : result.apparent
  return <figure className="straw-scene">
    <svg viewBox="0 0 560 430" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
      <title id={`${id}-title`}>{explanation ? '同じストローの下端と、目へ届く道筋' : `水${water ? 'あり' : 'なし'}で見えるストローの形の模式表示`}</title>
      <desc id={`${id}-desc`}>{explanation ? '横からの配置図。実際のストローは一直線。' : water ? '水に入る部分の見える位置が浅くなり、上側とのつながりがずれる近似。' : '水がなく、ストローは一直線に見える。'}{showRays && `青い実線は同じ下端から目へ届く光。${water ? '水面で向きを変える。' : '向きを変えず目へ届く。'}`}{showPosition && '紫の破線は最後に目へ届く向きを来た側へ延ばす補助線。光が逆走する道筋ではない。'}</desc>
      <defs>
        <linearGradient id={`${id}-water`} x2="0" y2="1"><stop stopColor="#c5e8ea" /><stop offset="1" stopColor="#e5f4f5" /></linearGradient>
        <linearGradient id={`${id}-straw`}><stop stopColor="#b85d27" /><stop offset=".45" stopColor="#e7a05b" /><stop offset="1" stopColor="#b85d27" /></linearGradient>
        <marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#1971c2" /></marker>
      </defs>
      <rect x="140" y="235" width="220" height="143" fill={water ? `url(#${id}-water)` : '#f8fbfc'} />
      <path d="M140 218 L155 378 Q250 400 345 378 L360 218" fill="none" stroke="#a1b5bd" strokeWidth="3" />
      <ellipse cx="250" cy="218" rx="110" ry="13" fill="none" stroke="#a1b5bd" strokeWidth="2" />
      <line x1="100" x2="455" y1="235" y2="235" stroke={water ? '#4c969e' : '#aebbc2'} strokeDasharray={water ? undefined : '3 6'} />
      {explanation && <text x="375" y="257">{water ? '水面' : '水を入れる高さ'}</text>}
      <path d={pointPath(path)} fill="none" stroke={`url(#${id}-straw)`} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={x(marker.x)} cy={y(marker.y)} r="7" fill="#9c3620" stroke="white" strokeWidth="2" />
      {explanation && <>
        <text x="38" y="355">実際の下端</text>
        <path d={`M148 350 L${x(result.object.x) - 10} ${y(result.object.y)}`} fill="none" stroke="#9c3620" />
      </>}
      {showRays && <>
        <path d="M364 70 Q397 44 430 70 Q397 96 364 70 Z" fill="white" stroke="#344c58" strokeWidth="2" /><circle cx="397" cy="70" r="8" fill="#344c58" /><text x="446" y="76">目</text>
        {result.rays.map((ray, i) => <g key={i}>
          <path d={pointPath([result.object, ray.surface, ray.eye])} fill="none" stroke="#1971c2" strokeWidth="2.5" markerEnd={`url(#${id}-arrow)`} />
          {showPosition && <path d={pointPath([ray.surface, result.apparent])} fill="none" stroke="#7950b4" strokeWidth="2" strokeDasharray="6 5" />}
        </g>)}
      </>}
      {showPosition && <>
        <circle cx={x(result.apparent.x)} cy={y(result.apparent.y)} r="8" fill="white" stroke="#7950b4" strokeWidth="3" />
        <text x="35" y="292">見える下端</text><path d={`M147 287 L${x(result.apparent.x) - 12} ${y(result.apparent.y)}`} fill="none" stroke="#7950b4" />
      </>}
    </svg>
    {caption && <figcaption>{explanation ? step === 0 ? '横から見た実際の配置。光の線は、次の場面で重ねます。' : step === 1 ? '横から見た配置の説明図。実線は同じ下端から目へ届く光の道筋です。' : '横から見た配置の説明図。実線は光の道筋、破線は見える場所を探す補助線です。' : '水面を斜め上から見た位置を、横からの配置へ描き戻した模式表示。実物の写真ではありません。'}</figcaption>}
  </figure>
}

export function StrawObservation({ water, onWaterChange }: { water: boolean; onWaterChange: (water: boolean) => void }) {
  const id = useId()
  return <Stack gap="sm" className="straw-opening">
    <Group justify="space-between"><Text className="eyebrow">水ありと水なしの見え方</Text><Badge variant="light">見え方の計算モデル</Badge></Group>
    <SimpleGrid cols={2} spacing={{ base: 'xs', sm: 'lg' }}>
      <div><Title order={3} size="h4">比較：水なし</Title><StrawScene water={false} caption={false} /></div>
      <div><Title order={3} size="h4">今の見え方：水{water ? 'あり' : 'なし'}</Title><StrawScene water={water} caption={false} /></div>
    </SimpleGrid>
    <Paper withBorder p="md">
      <Text id={id} fw={600} size="sm" mb="xs">変えるのは、水だけ</Text>
      <SegmentedControl aria-labelledby={id} fullWidth value={water ? 'water' : 'air'} onChange={value => onWaterChange(value === 'water')} data={[{ value: 'air', label: '水を抜く' }, { value: 'water', label: '水を入れる' }]} />
      <Text role="status" mt="sm">{water ? '水中の下端が浅い場所に見え、上側とのつながりがずれます。水より上の部分はそのままです。' : '水を抜くと、下端は元の場所に見え、一本の直線につながります。ストローは動かしていません。'}</Text>
      <Button variant="subtle" mt="sm" onClick={() => onWaterChange(true)}>水ありの初期条件へ戻す</Button>
    </Paper>
  </Stack>
}

export function StrawExplanation({ water }: { water: boolean }) {
  const [step, setStep] = useState('0')
  const current = Number(step)
  return <Paper withBorder p={{ base: 'md', sm: 'xl' }}>
    <Title order={3}>見え方から、同じ下端の道筋へ</Title>
    <Text size="sm" mt="sm">水の条件は上の観察と共通です。ストローと見る場所を保ったまま、図に重ねるものだけを変えます。どの場面も直接選べます。</Text>
    <Tabs value={step} onChange={value => { if (value !== null) setStep(value) }} mt="md">
      <Tabs.List grow className="journey-scenes" aria-label="ストローを説明する場面">{steps.map((label, i) => <Tabs.Tab value={String(i)} key={label}>{label}</Tabs.Tab>)}</Tabs.List>
      <Tabs.Panel value={step}>
        <div className="straw-explanation-layout">
          <StrawScene water={water} explanation step={current} />
          <Stack gap="sm">
            <Badge variant="light" w="fit-content">今の条件：水{water ? 'あり' : 'なし'}</Badge>
            {current === 0 && <>
              <Title order={4}>見える場所と、物の形を分ける</Title>
              <Text>先ほどの見え方から、実際の配置へ戻しました。茶色のストローは一直線で、下端の赤い目印も動いていません。水を入れると変わったのは、見える場所です。「目へ届く光」を選ぶと、同じ赤い下端から目までの道筋を重ねられます。</Text>
            </>}
            {current === 1 && <>
              <Title order={4}>下端から来る光が、目へ届く</Title>
              <Text>照らされたストローで反射した光の一部が、目へ届きます。青い線は、赤い下端から目へ届く細い束を二本で代表させたものです。{water ? '下端から目へたどると、水面で向きが変わります。水と空気の境目を通るときの向きの変化を「屈折」と呼びます。' : '水がないので、下端から目へ一直線に届きます。水面を通るときの向きの変化（屈折）は、この条件ではありません。'} 目から光を出す図ではなく、写真に青い線が写るという意味でもありません。</Text>
            </>}
            {current >= 2 && <>
              <Title order={4}>届いた向きをたどると、別の場所を指す</Title>
              <Text>紫の破線は、目へ最後に届く向きを、そのまま来た側へ延ばした補助線です。二本が交わる白い丸が、そこから光が来たように見える下端の位置です。{water ? '白い丸は、赤い下端より水面に近い場所です。水中の点ごとに同じたどり方をすると、観察で見た下側のずれにつながります。ストローを折ったのではなく、届く向きが変わっています。' : '水なしでは補助線が赤い下端へ戻ります。光が途中で曲がらないため、実際の場所と見える場所が一致します。'} 破線を光が逆走するわけではありません。</Text>
            </>}
            {current >= 2 && <Text size="sm" c="dimmed">同じ目の入口へ届く近接した二本から求めた、見える位置の近似です。ぼけ、明るさ、目の中で像ができる仕組みは再現しません。</Text>}
          </Stack>
        </div>
      </Tabs.Panel>
    </Tabs>
    <Group justify="space-between" mt="md">
      <Button variant="subtle" disabled={current === 0} onClick={() => setStep(String(current - 1))}>← 前の場面</Button>
      <Button variant="light" disabled={current === 2} onClick={() => setStep(String(current + 1))}>{steps[current + 1] ?? '見える場所'} →</Button>
    </Group>
  </Paper>
}
