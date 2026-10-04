import {
  Badge,
  Button,
  NativeSelect,
  Paper,
  Slider,
  Table,
  Text,
} from '@mantine/core'
import { useId, useState } from 'react'
import { media, observeOptics } from './model'
import RayDiagram from './RayDiagram'
import './optics.css'

type Medium = keyof typeof media
const degrees = (radians: number) => (radians * 180) / Math.PI
const angleLabel = (radians: number | null) =>
  radians === null ? 'なし（全反射）' : `${degrees(radians).toFixed(1)}°`

export default function OpticsSimulation() {
  const [angle, setAngle] = useState(45)
  const [incident, setIncident] = useState<Medium>('air')
  const [transmitted, setTransmitted] = useState<Medium>('water')
  const id = useId()
  const result = observeOptics({
    incidentAngle: (angle * Math.PI) / 180,
    incidentIndex: media[incident].index,
    transmittedIndex: media[transmitted].index,
  })
  const directionText =
    result.kind === 'total-reflection'
      ? '全反射：進む先へ伝わる光線はありません。'
      : result.kind === 'critical'
        ? '臨界角：屈折角90°で境界に沿う限界です。'
        : angle === 0
          ? '境界へ90°で届く光は、進む向きを変えません。速さは下の表の物質ごとの値になります。'
          : incident === transmitted
            ? '同じ物質：向きも速さも変わりません。'
            : media[transmitted].index > media[incident].index
              ? '進む先では光が遅くなり、屈折光と法線の間の角度が小さくなります。'
              : '進む先では光が速くなり、屈折光と法線の間の角度が大きくなります。'
  return (
    <Paper withBorder className="experiment-grid optics-experiment">
      <div className="simulation">
        <h3 className="simulation-title">
          光の進む向き <Badge variant="light">解析式の可視化</Badge>
        </h3>
        <div className="optics-legend" aria-label="光線の凡例">
          <span>
            <i className="optics-incident" />
            入射光
          </span>
          <span>
            <i className="optics-reflected" />
            反射光（破線）
          </span>
          <span>
            <i className="optics-refracted" />
            屈折光
          </span>
        </div>
        <RayDiagram
          result={result}
          incidentName={media[incident].name}
          transmittedName={media[transmitted].name}
        />
        <p className="optics-status" role="status">
          {directionText}
        </p>
        <dl className="optics-readings">
          <div>
            <dt>入射角 θ₁</dt>
            <dd>{angle.toFixed(1)}°</dd>
          </div>
          <div>
            <dt>反射角 θᵣ</dt>
            <dd>
              {result.hasReflectedRay
                ? angleLabel(result.reflectedAngle)
                : 'なし（同じ物質）'}
            </dd>
          </div>
          <div>
            <dt>屈折角 θ₂</dt>
            <dd>{angleLabel(result.refractedAngle)}</dd>
          </div>
        </dl>
        <Text size="sm" mt="sm">真空中の光速を基準にした比が「屈折率 n」です。物質中の光速は「真空中の光速÷n」で計算します。全反射でも表には物質の性質としてこの値を表示し、光が透過した量は示しません。</Text>
        <Table className="measurement-table" striped>
          <Table.Caption>物質中の光の速さ（屈折率からの計算値）</Table.Caption>
          <Table.Thead>
            <Table.Tr>
              <Table.Th scope="col">物質</Table.Th>
              <Table.Th scope="col">屈折率 n</Table.Th>
              <Table.Th scope="col">速さ [m/s]</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Th scope="row">出発側：{media[incident].name}</Table.Th>
              <Table.Td>{media[incident].index.toFixed(2)}</Table.Td>
              <Table.Td>{result.incidentSpeed.toExponential(2)}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th scope="row">進む先：{media[transmitted].name}</Table.Th>
              <Table.Td>{media[transmitted].index.toFixed(2)}</Table.Td>
              <Table.Td>{result.transmittedSpeed.toExponential(2)}</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
        <p className="small-note">
          上が光の出発側、下が進む先です。入射光は境界へ届く光、反射光は元の側へ戻る光、屈折光は向こう側へ進む光を表します。矢印は向きだけを示し、速さと光の強さは線の長さや太さに対応しません。
        </p>
      </div>
      <aside className="controls" aria-label="光の実験条件">
        <h3>角度と物質を変える</h3>
        <p>点線の法線は境界に90°で立つ基準線です。入射角は、境界へ届く光と法線の間の角度を表します。0°では境界へまっすぐ届きます。</p>
        <div className="parameter">
          <Text id={`${id}-angle`} size="sm" mb="sm">
            入射角 θ₁{' '}
            <output>
              {angle.toFixed(1)} <small>°</small>
            </output>
          </Text>
          <Slider
            min={0}
            max={80}
            step={0.1}
            value={angle}
            thumbLabel="入射角"
            thumbProps={{
              'aria-labelledby': `${id}-angle`,
              'aria-valuetext': `${angle.toFixed(1)}度、法線からの角度`,
            }}
            label={(value) => `${value.toFixed(1)}°`}
            onChange={setAngle}
          />
          <div className="range-labels">
            <span>0°（垂直）</span>
            <span>80°</span>
          </div>
        </div>
        <div className="optics-presets" aria-label="入射角の例">
          {[0, 30, 45, 60].map((value) => (
            <Button
              key={value}
              type="button"
              variant={angle === value ? 'light' : 'default'}
              aria-pressed={angle === value}
              onClick={() => setAngle(value)}
            >
              {value}°
            </Button>
          ))}
        </div>
        <NativeSelect
          label="光の出発側"
          my="lg"
          value={incident}
          onChange={(event) => setIncident(event.currentTarget.value as Medium)}
          data={Object.entries(media).map(([value, medium]) => ({
            value,
            label: `${medium.name}（n = ${medium.index.toFixed(2)}）`,
          }))}
        />
        <NativeSelect
          label="光の進む先"
          my="lg"
          value={transmitted}
          onChange={(event) =>
            setTransmitted(event.currentTarget.value as Medium)
          }
          data={Object.entries(media).map(([value, medium]) => ({
            value,
            label: `${medium.name}（n = ${medium.index.toFixed(2)}）`,
          }))}
        />
        <Button
          type="button"
          variant="default"
          onClick={() => {
            setIncident(transmitted)
            setTransmitted(incident)
          }}
        >
          出発側と進む先を入れ替える
        </Button>
        {result.criticalAngle !== null && (
          <>
            <p className="control-hint">
              向こう側へ進む光が境界に沿うときの入射角を「臨界角」と呼びます。この組み合わせでは{degrees(result.criticalAngle).toFixed(1)}
              °。これより大きな入射角では全反射します。
            </p>
            <Button
              type="button"
              variant="default"
              onClick={() => setAngle(degrees(result.criticalAngle!))}
            >
              臨界角に合わせる
            </Button>
          </>
        )}
        <Button
          type="button"
          variant="subtle"
          mt="sm"
          onClick={() => {
            setAngle(45)
            setIncident('air')
            setTransmitted('water')
          }}
        >
          条件を初期値に戻す
        </Button>
        <p className="control-hint">
          表の屈折率 n は、真空中と物質中の光速の比です。大きいほど物質中の光は遅くなります。水から空気へ向かう60°では、屈折光がなくなる全反射を見られます。
        </p>
      </aside>
    </Paper>
  )
}
