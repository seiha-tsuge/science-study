import {
  Accordion,
  Badge,
  Group,
  Button,
  NativeSelect,
  NumberInput,
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
const scenarios = [
  { label: 'まっすぐ入る', angle: 0, from: 'air', to: 'water' },
  { label: '斜めに入る', angle: 45, from: 'air', to: 'water' },
  { label: '水側へ戻る', angle: 60, from: 'water', to: 'air' },
] as const

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
          ? '境界へ90°で届く光は、進む向きを変えません。速さは物質ごとの値になります。'
          : incident === transmitted
            ? '同じ物質：向きも速さも変わりません。'
            : media[transmitted].index > media[incident].index
              ? '進む先では光が遅くなり、屈折光と法線の間の角度が小さくなります。'
              : '進む先では光が速くなり、屈折光と法線の間の角度が大きくなります。'
  return (
    <Paper withBorder className="experiment-grid optics-experiment">
      <Group gap="xs" p="md" className="optics-scenarios" aria-label="比べる光の場面">
        <Text size="sm" fw={600}>場面を比べる</Text>
        {scenarios.map((scenario) => <Button key={scenario.label} variant={angle === scenario.angle && incident === scenario.from && transmitted === scenario.to ? 'light' : 'default'} aria-pressed={angle === scenario.angle && incident === scenario.from && transmitted === scenario.to} onClick={() => { setAngle(scenario.angle); setIncident(scenario.from); setTransmitted(scenario.to) }}>{scenario.label}</Button>)}
      </Group>
      <div className="simulation">
        <h3 className="simulation-title">
          光の進む向き <Badge variant="light">解析式の可視化</Badge>
        </h3>
        <Text size="sm" fw={600} mb="sm">{media[incident].name} → {media[transmitted].name} · 入射角 {angle.toFixed(1)}°</Text>
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
        <Text my="md" role="status" className="optics-direction">
          {directionText}
        </Text>
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
      </div>
      <aside className="controls" aria-label="光の実験条件">
        <h3>角度と物質を変える</h3>
        <div className="optics-media">
          <NativeSelect label="光の出発側" value={incident} onChange={event => setIncident(event.currentTarget.value as Medium)} data={Object.entries(media).map(([value, medium]) => ({ value, label: medium.name }))} />
          <NativeSelect label="光の進む先" value={transmitted} onChange={event => setTransmitted(event.currentTarget.value as Medium)} data={Object.entries(media).map(([value, medium]) => ({ value, label: medium.name }))} />
        </div>
        <Button type="button" variant="subtle" mt="sm" onClick={() => { setIncident(transmitted); setTransmitted(incident) }}>出発側と進む先を入れ替える</Button>
        <div className="parameter">
          <Group justify="space-between" mb="md" wrap="nowrap">
            <Text id={`${id}-angle`} size="sm">入射角 θ₁</Text>
            <NumberInput
              aria-label="入射角を数値で指定"
              value={angle}
              min={0}
              max={80}
              step={0.1}
              decimalScale={1}
              allowNegative={false}
              clampBehavior="strict"
              hideControls
              suffix="°"
              w={100}
              onChange={value => {
                const next = value === '' ? Number.NaN : Number(value)
                if (Number.isFinite(next) && next >= 0 && next <= 80) setAngle(next)
              }}
            />
          </Group>
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
        <Text size="xs" c="dimmed" mb="sm">点線の法線から測ります。0°は境界へまっすぐ届く向きです。</Text>
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
      </aside>
      <Accordion variant="separated" className="optics-values">
        <Accordion.Item value="values">
          <Accordion.Control>光の速さ・屈折率・図の読み方</Accordion.Control>
          <Accordion.Panel>
            <Text size="sm" mt="sm">屈折率nは、真空中の速さを物質中の速さで割った比です。nが大きいほど、物質中の光は遅く進みます。表の速さは「真空中の速さ÷n」で計算します。</Text>
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
              図の上が出発側、下が進む先です。入射光は境界へ届く光、破線の反射光は元の側へ戻る光、屈折光は向こう側へ進む光です。線の長さや太さは速さ・強さを表しません。全反射でも、表には進む先の物質の速さを示します。この値は、光がそこへ透過したことを意味しません。
            </p>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Paper>
  )
}
