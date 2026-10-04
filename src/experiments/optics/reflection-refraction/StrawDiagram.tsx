import { useId } from 'react'
import { observeStrawPoint } from './model'

export default function StrawDiagram({ mode, compact = false }: { mode: number; compact?: boolean }) {
  const id = useId()
  const { object, rays, apparent } = observeStrawPoint()
  const x = (value: number) => 265 + value * 210
  const y = (value: number) => 180 - value * 210
  const showLight = mode >= 1
  const showApparent = mode >= 2
  return (
    <svg className="refraction-visual straw-diagram" viewBox="0 0 560 410" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
      <title id={`${id}-title`}>ストローの形と、目へ届く光の道筋</title>
      <desc id={`${id}-desc`}>まっすぐなストローの水中の一点から出る光は、水面で向きを変えて目へ届きます。{showApparent && '目へ届く向きを破線で水中へ延ばすと、実際の点より浅い位置で交わります。破線は実際の光の道筋ではありません。'}</desc>
      <defs>
        <marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="context-stroke" /></marker>
        <linearGradient id={`${id}-water`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#cce8e7" /><stop offset="1" stopColor="#e3f1f0" /></linearGradient>
        <linearGradient id={`${id}-straw`}><stop stopColor="#ad571d" /><stop offset="0.5" stopColor="#d58b41" /><stop offset="1" stopColor="#ad571d" /></linearGradient>
      </defs>
      <rect x="24" y="180" width="512" height="200" rx="8" fill={`url(#${id}-water)`} />
      <text x="38" y="42">空気</text><text x="38" y="360">水</text>
      <line x1="24" x2="536" y1="180" y2="180" stroke="#72989d" strokeWidth="2" />
      <text x="460" y="168">水面</text>
      <line x1={x(-0.48)} y1={y(-0.85)} x2={x(0.37)} y2={y(0.45)} stroke={`url(#${id}-straw)`} strokeWidth="12" strokeLinecap="round" />
      {!compact && <><text x="145" y="60">ストロー</text><path d={`M225 65 L${x(0.3)} ${y(0.34)}`} fill="none" stroke="#ad571d" /></>}
      <path d="M366 70 Q408 35 450 70 Q408 105 366 70 Z" fill="white" stroke="#304c5d" strokeWidth="2" />
      <circle cx="407" cy="70" r="12" fill="#304c5d" /><circle cx="410" cy="66" r="3" fill="white" /><text x="467" y="77">目</text>
      {showLight && rays.map((ray, i) => <g key={i}>
        <path d={`M${x(object.x)},${y(object.y)} L${x(ray.surface.x)},${y(0)} L${x(ray.end.x)},${y(ray.end.y)}`} fill="none" stroke="#2563eb" strokeWidth="3" />
        {i === 0 && <path d={`M${x(ray.surface.x)},${y(0)} L${x(ray.end.x)},${y(ray.end.y)}`} fill="none" stroke="#2563eb" strokeWidth="3" markerEnd={`url(#${id}-arrow)`} />}
        {showApparent && <line x1={x(ray.surface.x)} y1={y(0)} x2={x(apparent.x)} y2={y(apparent.y)} stroke="#7957af" strokeWidth="2.5" strokeDasharray="7 6" />}
      </g>)}
      {showLight && <><circle cx={x(rays[0].surface.x)} cy="180" r="12" fill="none" stroke="#2563eb" strokeWidth="1.5" opacity="0.6" /><path d="M305 183 L358 211" stroke="#2563eb" /><text x="362" y="223">光が曲がる</text></>}
      <circle cx={x(object.x)} cy={y(object.y)} r="8" fill="#ad571d" stroke="white" strokeWidth="2.5" />
      <text x="36" y="302">実際の点 ●</text>
      <path d={`M143 298 L${x(object.x) - 12} ${y(object.y)}`} fill="none" stroke="#ad571d" strokeWidth="1.5" />
      {showApparent && <>
        <circle cx={x(apparent.x)} cy={y(apparent.y)} r="9" fill="white" stroke="#7957af" strokeWidth="3" />
        <text x="328" y="285">見える点 ○</text>
        <path d={`M${x(apparent.x) + 12} ${y(apparent.y)} L318 279`} fill="none" stroke="#7957af" strokeWidth="1.5" />
      </>}
      {!compact && <text x="35" y="403">{showApparent ? '実線：光の道筋　破線：逆向きの延長' : showLight ? '実線：水中の点から目へ届く光' : '水中の一点に、目印を付ける'}</text>}
    </svg>
  )
}
