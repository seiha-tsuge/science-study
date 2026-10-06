import { Paper, SegmentedControl, Stack, Switch, Text, Title } from '@mantine/core'
import { useId, useState } from 'react'
import { LensDiagram } from './diagrams'
import { traceLensRay } from './model'

const input = { focalLength: .1, objectDistance: .2, objectHeight: .002 }
const entries = [-.0025, .0025]

export default function PaperImageGuide() {
  const [position, setPosition] = useState('20')
  const [secondPoint, setSecondPoint] = useState(false)
  const id = useId()
  const screen = Number(position) / 100
  const aligned = position === '20'
  const hits = (height: number) => entries.map(entry => traceLensRay({ ...input, objectHeight: height }, entry, screen).y)
  const py = (height: number) => 95 - height * 16000
  return <>
    <div className="journey-intro">
      <Title order={4}>紙を動かすと、なぜくっきり映る場所がある？</Title>
      <Text size="sm" mt="sm">文字の縦線を一本取り出し、まず上端Aだけを見ます。Aから別々の向きに出た光を、レンズで曲げて白い紙で受けます。この紙がスクリーンです。レンズは二つの表面で光を曲げますが、この薄いレンズの図では、その曲がりを中心の一か所にまとめています。</Text>
    </div>
    <div className="journey-workspace image-paper-workspace">
      <div className="journey-tools">
        <Text id={id} fw={600} size="sm" mb="xs">動かすのは、白い紙だけ</Text>
        <SegmentedControl fullWidth aria-labelledby={id} value={position} onChange={setPosition} data={[
          { value: '16', label: '手前' }, { value: '20', label: '集まる場所' }, { value: '30', label: '奥' },
        ]} />
        <Text size="sm" mt="xs">紙はレンズの右{position} cm。文字とレンズは動かしません。</Text>
        <Switch mt="md" label="次に、下端Bの光も重ねる" checked={secondPoint} onChange={event => setSecondPoint(event.currentTarget.checked)} />
      </div>
      <div className="journey-visual">
        <Text fw={600} size="sm" mb="xs">横から：光が紙へ届く道筋</Text>
        <LensDiagram input={input} screen={screen} fixedEntry secondPoint={secondPoint} landmarks={false} />
        <Text fw={600} size="sm" mt="md" mb="xs">同じ紙を正面から：当たる場所だけを見る</Text>
        <figure className="image-diagram image-paper-face">
          <svg viewBox="0 0 620 220" role="img" aria-label={`同じ白い紙を正面から見る。上端Aの二本は${aligned ? '一か所に重なる' : '別々の場所に当たる'}。${secondPoint ? '下端Bの光はAとは別の高さに当たる。' : ''}`}>
            <rect x="20" y="20" width="270" height="180" rx="4" fill="white" stroke="#868e96" strokeWidth="2" />
            <line x1="40" x2="270" y1="95" y2="95" stroke="#adb5bd" strokeDasharray="2 5" />
            {secondPoint && hits(0).map((height, index) => <rect key={`B-${index}`} x="151" y={py(height) - 4} width="8" height="8" fill="#d9480f" />)}
            {hits(input.objectHeight).map((height, index) => <circle key={`A-${index}`} cx="155" cy={py(height)} r="5" fill="#1971c2" />)}
            <text x="320" y="65">Aの光：青い丸</text>
            <text x="320" y="103">{aligned ? '二本 → 同じ一か所' : '二本 → 離れた二か所'}</text>
            {secondPoint && <><text x="320" y="151">Bの光：橙の四角</text><text x="320" y="189">Aとは別の高さ</text></>}
          </svg>
          <figcaption>横の図で光が紙に当たる高さを、そのまま正面の紙へ移しました。点は選んだ二本の到着位置です。ぼけの形や明るさ全体は描いていません。</figcaption>
        </figure>
      </div>
      <Paper withBorder p="md" className="journey-explanation">
        <Text className="eyebrow">紙の上の点を見る</Text>
        <Stack gap="sm" mt="xs">
          <Text aria-live="polite">{aligned ? 'Aの二本の光が、紙の同じ一か所へ届きます。上端Aが一つの点として映ります。' : '同じAから出た二本が、紙の別々の場所へ届きます。一点の光が広がって当たることが、ぼける原因です。'}</Text>
          <Text>{secondPoint ? aligned ? 'Bの光も一か所へ届きますが、Aの光とは別の高さです。元の線ではAが上、Bが下。紙ではBが上、Aが下になり、上下の順が逆になります。' : 'Bの二本も別々の高さへ届きます。「集まる場所」へ紙を戻すと、AとBがそれぞれ別の一点へまとまる様子を比べられます。' : '次に下端Bを重ねると、「文字全体が一つの点になる」のではなく、元の各点が別々の点へ映ることを見られます。'}</Text>
          <Text>各点の光が集まる並びが、文字の<strong>像</strong>です。スクリーンの位置が合うと、各点が広がらずに映るので、輪郭がくっきりします。</Text>
          <Text size="sm" c="dimmed">空気中の理想的な薄い凸レンズの作図です。文字とレンズの位置は固定しています。点は二本の光の到着位置で、写真のぼけや明るさ全体は再現しません。</Text>
        </Stack>
      </Paper>
    </div>
  </>
}
