import { useId } from 'react'
import { observeLens } from './model'
import Leaf from './leaf'

export type ImageExperience = 'magnifier' | 'mirror'

export function LeafView({ distance, lensVisible }: { distance: number; lensVisible: boolean }) {
  const id = useId()
  const objectDistance = distance / 100
  const image = observeLens({ focalLength: .1, objectDistance, objectHeight: .002 })
  // Compare h'/L' with h/L at the SAME object/eye positions, in the small-angle limit.
  // This is not a magnifier rating relative to a 25 cm near point.
  const eyeDistance = .4
  const plainSize = 35 * (.475 / (eyeDistance + objectDistance))
  const size = lensVisible ? plainSize * image.magnification! * (eyeDistance + objectDistance) / (eyeDistance - image.imageDistance!) : plainSize
  return <figure className="image-experience-figure">
    <svg viewBox="0 0 620 300" role="img" aria-label={lensVisible ? '同じ葉を虫めがねでのぞく模式表示。葉脈の間隔が広く見える。' : '虫めがねを外して、同じ位置から葉を見る模式表示。'}>
      <defs><clipPath id={`${id}-lens`}><circle cx="310" cy="149" r="95" /></clipPath></defs>
      <rect x="14" y="14" width="592" height="272" rx="14" fill="#f6f4ee" />
      <path d="M30 256H592" stroke="#d8d4ca" strokeWidth="2" />
      <Leaf x={310} y={149 + plainSize / 2} height={plainSize} />
      {lensVisible && <>
        <path d="M375 218L420 263" stroke="#687164" strokeWidth="22" strokeLinecap="round" />
        <g clipPath={`url(#${id}-lens)`}><circle cx="310" cy="149" r="95" fill="#fffdf7" /><Leaf x={310} y={149 + size / 2} height={size} /></g>
        <circle cx="310" cy="149" r="97" fill="none" stroke="#687164" strokeWidth="8" />
      </>}
      <text x="310" y="40" textAnchor="middle">{lensVisible ? '虫めがねでのぞく' : 'そのまま見る'}</text>
    </svg>
    <figcaption>目までの距離も含めて、見える大きさを比べる近似です。小さな葉先を理想レンズで見る図で、写真やぼけの再現ではありません。</figcaption>
  </figure>
}

export function MirrorLeafView({ distance }: { distance: number }) {
  const shift = distance * 4
  return <figure className="image-experience-figure">
    <svg viewBox="0 0 620 300" role="img" aria-label={`机の鏡と同じ葉を上から見る配置図。葉は手前${distance}cm、見える葉は奥${distance}cm。`}>
      <rect x="12" y="14" width="596" height="272" rx="14" fill="#f6f4ee" />
      <rect x="310" y="40" width="290" height="224" fill="#edf2e8" />
      <line x1="310" x2="310" y1="46" y2="248" stroke="#687164" strokeWidth="8" />
      <Leaf x={310 - shift} y={172} height={60} /><Leaf x={310 + shift} y={172} height={60} reflected />
      <text x="310" y="32" textAnchor="middle">鏡</text>
      <text x="150" y="220" textAnchor="middle">鏡の前の葉</text><text x="470" y="220" textAnchor="middle">鏡の向こうに見える葉</text>
    </svg>
    <figcaption>机の上を上から描いた位置の模式図です。鏡の向こうにもう一枚の葉があるわけではありません。正面から見た景色とは区別します。</figcaption>
  </figure>
}
