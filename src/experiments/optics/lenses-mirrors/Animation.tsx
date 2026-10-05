import { Button, Group, Paper, Slider, Text } from '@mantine/core'
import type { ReactNode } from 'react'
import { useImageAnimation } from './useImageAnimation'
import { rayObservation } from './animation-observation'
import type { RayScene } from './animation-observation'
import Observation from './Observation'

type AnimationState = ReturnType<typeof useImageAnimation>
export function AnimationControls({ animation, duration, stages, label, timeScale = 1, title = '時間を選んで、光の道筋を追う' }: {
  animation: AnimationState; duration: number; stages: { time: number; label: string }[]; label: string; timeScale?: number; title?: string
}) {
  const { time, running, reducedMotion, seek, toggle } = animation
  return <Paper withBorder p="md" className="journey-time image-animation-controls">
    <Text fw={600} size="sm" mb="sm">{title}</Text>
    <Group gap="xs" aria-label="静止した段階を選ぶ">{stages.map(stage => {
      const selected = Math.abs(Math.min(stage.time, duration) - time) < .005
      return <Button key={stage.time} variant={selected ? 'light' : 'default'} aria-pressed={selected} onClick={() => seek(stage.time)}>{stage.label}</Button>
    })}</Group>
    <Text size="xs" mt="md" mb="xs" className="image-time-readout">{label}：{(time / timeScale).toFixed(2)} / {(duration / timeScale).toFixed(2)} 秒{timeScale === 1 && '（物理時刻とは別）'}</Text>
    <Slider thumbLabel={label} value={time / timeScale} min={0} max={duration / timeScale} step={.01} onChange={value => seek(value * timeScale)} label={value => `${value.toFixed(2)} 秒`} />
    <Group mt="md" gap="xs">
      <Button onClick={toggle} disabled={reducedMotion}>{running ? '停止' : '再生'}</Button>
      <Button variant="default" onClick={() => seek(0)}>先頭へ戻す</Button>
    </Group>
    {reducedMotion && <Text size="sm" mt="sm">動きを減らす設定です。段階のボタンやスライダーで、静止した図を選べます。</Text>}
  </Paper>
}


export default function RayAnimation({ active, kind, extensions = true, children, tools, explanation }: {
  active: boolean; kind: RayScene; extensions?: boolean; children: (progress: number) => ReactNode; tools?: ReactNode; explanation: ReactNode
}) {
  const animation = useImageAnimation(active, 8)
  const progress = animation.time / 8
  const backward = kind === 'direct' || kind === 'virtual' || kind === 'mirror'
  const stages = [
    { time: 0, label: kind === 'focus' ? 'レンズと目印' : '物と目印' },
    { time: 2.8, label: kind === 'mirror' ? '鏡まで' : kind === 'direct' ? '目まで届く' : 'レンズまで' },
    { time: 5.6, label: kind === 'real' ? 'スクリーンへ集まる' : kind === 'focus' ? 'Fへ集まる' : '届く光の向き' },
    { time: 8, label: backward ? extensions ? '逆向きの延長' : '延長は非表示' : '完成図' },
  ]
  return <div className="journey-workspace">
    <div className="journey-tools">
      {tools && <><Text fw={600} size="sm" mb="xs">図に重ねるもの</Text>{tools}</>}
      <AnimationControls animation={animation} duration={8} stages={stages} label="作図の時間" />
      <Text size="xs" c="dimmed" mt="sm">線を描く順序をゆっくり見せる8秒の説明アニメーションです。描画の速さは光の速さや到着時刻を表しません。各段階へ直接移れます。</Text>
    </div>
    <div className="journey-visual">{children(progress)}</div>
    <Paper withBorder p="md" className="journey-explanation">
      <Text className="eyebrow">図のここを見る</Text>
      <Observation current={rayObservation(kind, progress, extensions)} alternatives={[0, .1, .35, .7, 1].flatMap(value => [rayObservation(kind, value, true), rayObservation(kind, value, false)])} />
      <div className="image-reason">{explanation}</div>
    </Paper>
  </div>
}
