import {
  Badge,
  Button,
  SegmentedControl,
  Slider,
  Switch,
  Table,
  Text,
} from '@mantine/core'
import { useState } from 'react'
import Graph from './Graph'
import MotionCanvas from './MotionCanvas'
import { useExperimentClock } from './useExperimentClock'
import type { Trajectory } from './types'
import { DURATION } from './types'

export default function Simulation({
  current,
  reference,
}: {
  current: Trajectory
  reference: Trajectory
}) {
  const clock = useExperimentClock()
  const [compare, setCompare] = useState(true)
  const [quantity, setQuantity] = useState<'position' | 'velocity'>('position')
  const observation = current.observe(clock.time)
  const referenceObservation = reference.observe(clock.time)
  return (
    <div className="simulation">
      <div className="simulation-title">
        <span className="live-dot" /> 一次元の運動{' '}
        <Badge variant="light">解析式の可視化</Badge>
      </div>
      <MotionCanvas frame={{ current, reference, time: clock.time, compare }} />
      <div className="playback">
        <Button type="button" onClick={clock.toggle}>
          {clock.running
            ? 'Ⅱ 一時停止'
            : clock.time >= DURATION
              ? '▶ もう一度再生'
              : '▶ 再生'}
        </Button>
        <Button type="button" variant="default" onClick={clock.reset}>
          ↺ 初期化
        </Button>
        <output className="time-output">
          {clock.time.toFixed(1)} <small>/ {DURATION} s</small>
        </output>
      </div>
      <div className="time-slider">
        <Text size="sm" mb="sm">
          時間を動かす
        </Text>
        <Slider
          min={0}
          max={DURATION}
          step={0.1}
          value={clock.time}
          thumbLabel="時間"
          thumbProps={{ 'aria-valuetext': `${clock.time.toFixed(1)} 秒` }}
          label={(time) => `${time.toFixed(1)} s`}
          onChange={clock.seek}
        />
      </div>
      <div className="graph-toolbar">
        <SegmentedControl
          aria-label="グラフの種類"
          value={quantity}
          onChange={(value) => setQuantity(value as 'position' | 'velocity')}
          data={[
            { value: 'position', label: '位置と時間' },
            { value: 'velocity', label: '速度と時間' },
          ]}
        />
        <Switch
          label="比較を表示"
          checked={compare}
          onChange={(event) => setCompare(event.currentTarget.checked)}
        />
      </div>
      <Graph
        current={current}
        reference={reference}
        time={clock.time}
        compare={compare}
        quantity={quantity}
      />
      <div className="legend">
        <span>
          <i className="blue-line" />
          {current.label}
        </span>
        {compare && (
          <span>
            <i className="gray-line" />
            {reference.label}
          </span>
        )}
      </div>
      <Table className="measurement-table" striped>
        <Table.Caption>時刻 {clock.time.toFixed(1)} s の計算値</Table.Caption>
        <Table.Thead>
          <Table.Tr>
            <Table.Th scope="col">条件</Table.Th>
            <Table.Th scope="col">位置 [m]</Table.Th>
            <Table.Th scope="col">速度 [m/s]</Table.Th>
            <Table.Th scope="col">加速度 [m/s²]</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Th scope="row">現在</Table.Th>
            <Table.Td>{observation.position.toFixed(2)}</Table.Td>
            <Table.Td>{observation.velocity.toFixed(2)}</Table.Td>
            <Table.Td>{observation.acceleration.toFixed(2)}</Table.Td>
          </Table.Tr>
          {compare && (
            <Table.Tr>
              <Table.Th scope="row">比較</Table.Th>
              <Table.Td>{referenceObservation.position.toFixed(2)}</Table.Td>
              <Table.Td>{referenceObservation.velocity.toFixed(2)}</Table.Td>
              <Table.Td>
                {referenceObservation.acceleration.toFixed(2)}
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
      <p className="visual-note">
        青い点が物体、矢印は速度の向き（長さは速さを表しません）。位置は画面に合わせて縮尺を調整しています。グラフは0〜10秒の式の値で、実測データではありません。
      </p>
    </div>
  )
}
