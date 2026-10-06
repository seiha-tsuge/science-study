import { useEffect, useId, useRef, useState } from 'react'
import type { Direction } from './model'
import type { observeOptics } from './model'

export default function RayDiagram({ result, incidentName, transmittedName }: {
  result: ReturnType<typeof observeOptics>
  incidentName: string
  transmittedName: string
}) {
  const host = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(500)
  const id = useId()
  useEffect(() => {
    const element = host.current!
    const resize = () => setWidth(element.getBoundingClientRect().width)
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  const cx = width / 2, cy = 180
  const length = Math.min(138, Math.max(1, width / 2 - 24))
  const point = (direction: Direction, fraction = 1) =>
    `${cx + direction.x * length * fraction},${cy - direction.y * length * fraction}`
  const angleArc = (angle: number, lower = false) => {
    const radius = lower ? 52 : 38
    const endX = cx + radius * Math.sin(angle)
    const endY = cy + (lower ? 1 : -1) * radius * Math.cos(angle)
    return `M ${cx} ${cy + (lower ? radius : -radius)} A ${radius} ${radius} 0 0 ${lower || angle < 0 ? 0 : 1} ${endX} ${endY}`
  }
  const incomingStart = { x: -result.incidentDirection.x, y: -result.incidentDirection.y }
  return (
    <div ref={host} className="optics-diagram">
      <svg viewBox={`0 0 ${width} 350`} role="img" aria-labelledby={`${id}-title ${id}-desc`}>
        <title id={`${id}-title`}>境界での光の進み方</title>
        <desc id={`${id}-desc`}>
          上が光の出発側の{incidentName}、下が進む先の{transmittedName}。
          点線は境界に垂直な法線。
          {result.hasReflectedRay ? '境界へ届く入射光と元の側へ戻る反射光は法線に対して対称です。矢印のある実線は実際の光の道筋です。' : '同じ屈折率なので反射光は描きません。'}
          {result.kind === 'total-reflection' ? '全反射のため進む先への屈折光はありません。' : '向こう側へ進む光の角度は、物質の屈折率と入射角を結ぶ式で計算しています。'}
        </desc>
        <defs>
          {['incident', 'reflected', 'refracted'].map((name) => (
            <marker key={name} id={`${id}-${name}`} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 Z" className={`optics-fill-${name}`} />
            </marker>
          ))}
        </defs>
        <defs><linearGradient id={`${id}-medium`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#d7eceb" /><stop offset="1" stopColor="#eef7f5" /></linearGradient></defs>
        <rect x="0" y={cy} width={width} height={350 - cy} fill={`url(#${id}-medium)`} />
        <line x1="0" y1={cy} x2={width} y2={cy} className="optics-boundary" />
        <line x1={cx} y1="45" x2={cx} y2="320" className="optics-normal" />
        <text x="12" y="30">{incidentName}</text>
        <text x="12" y="330">{transmittedName}</text>
        <text x={cx + 8} y="30">法線</text>
        <text x="12" y="57" className="optics-ray-label optics-fill-incident">入射光</text>
        {result.hasReflectedRay && <text x={width - 12} y="57" textAnchor="end" className="optics-ray-label optics-fill-reflected">反射光</text>}
        {result.refractedDirection && <text x={width - 12} y="330" textAnchor="end" className="optics-ray-label optics-fill-refracted">屈折光</text>}
        <circle cx={cx} cy={cy} r="8" fill="white" stroke="#799497" strokeWidth="1.5" />
        <polyline points={`${point(incomingStart)} ${point(incomingStart, 0.5)} ${cx},${cy}`} className="optics-ray optics-incident" markerMid={`url(#${id}-incident)`} />
        {result.hasReflectedRay && <polyline points={`${cx},${cy} ${point(result.reflectedDirection, 0.7)} ${point(result.reflectedDirection)}`} className="optics-ray optics-reflected" markerMid={`url(#${id}-reflected)`} />}
        {result.refractedDirection && <polyline points={`${cx},${cy} ${point(result.refractedDirection, 0.7)} ${point(result.refractedDirection)}`} className="optics-ray optics-refracted" markerMid={`url(#${id}-refracted)`} />}
        {result.hasReflectedRay && result.reflectedAngle !== 0 && <>
          <path d={angleArc(-result.reflectedAngle)} className="optics-angle optics-incident" />
          <path d={angleArc(result.reflectedAngle)} className="optics-angle optics-reflected" />
        </>}
        {result.refractedAngle !== null && result.refractedAngle !== 0 && <path d={angleArc(result.refractedAngle, true)} className="optics-angle optics-refracted" />}
        {result.kind === 'total-reflection' && <text x={cx} y="260" textAnchor="middle">進む先への光線なし</text>}
      </svg>
    </div>
  )
}
