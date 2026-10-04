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
          ? '垂直入射：向きは変わりません。速さも確認しましょう。'
          : incident === transmitted
            ? '同じ物質：向きも速さも変わりません。'
            : media[transmitted].index > media[incident].index
              ? '屈折光は法線に近づきます。'
              : '屈折光は法線から離れます。'
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
          上が光の出発側、下が進む先です。矢印は向きだけを示します。線の長さ・太さ・色は速さや光の強さを表しません。全反射時も、表の速さは各物質の性質として表示しています。
        </p>
      </div>
      <aside className="controls" aria-label="光の実験条件">
        <h3>条件を変えてみる</h3>
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
              この組み合わせの臨界角は{degrees(result.criticalAngle).toFixed(1)}
              °。これより大きな入射角では全反射します。
            </p>
            <Button
              type="button"
              variant="default"
              onClick={() => setAngle(degrees(result.criticalAngle!))}
            >
              臨界角を確かめる
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
          まず45° → 0°を比べよう。次に水 →
          空気の60°を試すと、全反射を確認できます。
        </p>
      </aside>
    </Paper>
  )
}
