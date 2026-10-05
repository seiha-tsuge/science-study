import { useId } from 'react'
import { extendLensRay, lensHeightToEye, observeLens, observeMirror, traceLensRay } from './model'
import type { LensInput, Point } from './model'
import { cm } from './format'

const blue = '#1971c2'
const orange = '#d9480f'
const purple = '#7048a5'

function phase(progress: number, start: number, end: number) {
  return Math.max(0, Math.min(1, (progress - start) / (end - start)))
}
function reveal(progress: number) {
  return { pathLength: 1, strokeDasharray: '1 1', strokeDashoffset: 1 - progress, opacity: progress > 0 ? 1 : 0 }
}


export function LensDiagram({ input, screen, secondPoint = false, thirdRay = false, focus = false, fixedEntry = false, progress = 1 }: {
  input: LensInput; screen?: number; secondPoint?: boolean; thirdRay?: boolean; focus?: boolean; fixedEntry?: boolean; progress?: number
}) {
  const id = useId().replaceAll(':', '')
  const image = observeLens(input)
  const incoming = phase(progress, 0, .35)
  const outgoing = phase(progress, .35, .7)
  const backward = phase(progress, .7, 1)
  const imageVisible = image.kind === 'virtual' ? progress >= 1 : outgoing >= 1
  const px = (x: number) => 310 + x * 430
  const py = (y: number) => 170 - y * 16000
  const eye = { x: .4, y: -.0035 }
  const path = (points: Point[]) => points.map((p, i) => `${i ? 'L' : 'M'}${px(p.x)} ${py(p.y)}`).join(' ')
  const inFrame = image.imageDistance !== null && Math.abs(image.imageDistance) <= .65 && Math.abs(image.imageHeight!) < .0085
  const imageLabelX = image.imageDistance === null ? 0 : px(image.imageDistance) - (image.kind === 'virtual' ? 60 : 0)
  const imageLabelY = image.imageHeight === null ? 0 : image.imageHeight < 0
    ? Math.max(242, py(image.imageHeight) + 28)
    : Math.max(28, Math.min(64, py(image.imageHeight) - 15))
  const lensHeights = fixedEntry ? [-.0025, .0025] : image.kind === 'virtual'
    ? [lensHeightToEye(input, { ...eye, y: eye.y - .0004 }), lensHeightToEye(input, { ...eye, y: eye.y + .0004 })]
    : [input.objectHeight, 0]
  const thirdHeight = -input.objectHeight * input.focalLength / (input.objectDistance - input.focalLength)
  const canShowThird = Number.isFinite(thirdHeight) && Math.abs(thirdHeight) <= .0065 && image.kind !== 'virtual'
  const heights = thirdRay && canShowThird ? [...lensHeights, thirdHeight] : lensHeights
  const baseInput = { ...input, objectHeight: 0 }
  const baseHeights = image.kind === 'virtual' && !fixedEntry
    ? [-.0004, .0004].map(offset => lensHeightToEye(baseInput, { ...eye, y: eye.y + offset }))
    : [-.0025, .0025]
  const drawRays = (source: LensInput, rayHeights: number[], color: string, label: string) => rayHeights.map((height, index) => {
    const endpoint = image.kind === 'virtual' && !fixedEntry && screen === undefined ? eye.x : screen ?? .68
    return <g key={`${label}-${index}`}>
      <path d={path([{ x: -source.objectDistance, y: source.objectHeight }, { x: 0, y: height }])} fill="none" {...reveal(incoming)} stroke={color} strokeWidth="2.4" markerEnd={incoming >= 1 ? `url(#${id}-ray)` : undefined} />
      <path d={path([{ x: 0, y: height }, traceLensRay(source, height, endpoint)])} fill="none" {...reveal(outgoing)} stroke={color} strokeWidth="2.4" markerEnd={outgoing >= 1 ? `url(#${id}-ray)` : undefined} />
      {observeLens(source).kind === 'virtual' && <path d={path([{ x: 0, y: height }, extendLensRay(source, height, (observeLens(source).imageDistance ?? -.68) * backward)])} fill="none" stroke={label === 'B' ? orange : purple} strokeWidth="2" strokeDasharray="7 6" opacity={backward > 0 ? 1 : 0} />}
      {screen !== undefined && outgoing >= 1 && <circle cx={px(screen)} cy={py(traceLensRay(source, height, screen).y)} r="4" fill={color} />}
    </g>
  })
  return <figure className="image-diagram">
    <svg viewBox="0 0 620 350" role="img" aria-label={focus ? '横から見た凸レンズ。軸に平行な光が右側の焦点Fに集まる作図。' : `横から見た凸レンズ。物の先端Aから出た光と${image.kind === 'virtual' ? '逆向きの延長が交わる像' : image.kind === 'real' ? '光が交わる像' : '平行に進む光'}。`}>
      <defs>
        <marker id={`${id}-ray`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0 L7 3.5 L0 7" fill="none" stroke="#495057" /></marker>
        <clipPath id={`${id}-clip`}><rect x="10" y="32" width="600" height="273" /></clipPath>
      </defs>
      <line x1="10" x2="610" y1="170" y2="170" stroke="#adb5bd" strokeWidth="1.5" />
      <text x="15" y="344">レンズの中心を通る横線＝軸</text>
      <path d="M310 65 Q333 170 310 275 Q287 170 310 65Z" fill="#e7f5ff" stroke={blue} strokeWidth="2" />
      <text x="310" y="28" textAnchor="middle">凸レンズ</text>
      {[-2, -1, 1, 2].map(m => <g key={m}><circle cx={px(m * input.focalLength)} cy="170" r="3" fill="#495057" /><text x={px(m * input.focalLength)} y="197" textAnchor="middle">{Math.abs(m) === 1 ? 'F' : '2F'}</text></g>)}
      <g clipPath={`url(#${id}-clip)`}>
        {focus ? [-.004, 0, .004].map(y => <g key={y}>
          <path d={path([{ x: -.55, y }, { x: 0, y }])} fill="none" {...reveal(incoming)} stroke={blue} strokeWidth="2.5" markerEnd={incoming >= 1 ? `url(#${id}-ray)` : undefined} />
          <path d={path([{ x: 0, y }, { x: input.focalLength, y: 0 }])} fill="none" {...reveal(outgoing)} stroke={blue} strokeWidth="2.5" markerEnd={outgoing >= 1 ? `url(#${id}-ray)` : undefined} />
        </g>) : <>
          {screen !== undefined && <line x1={px(screen)} x2={px(screen)} y1="42" y2="298" stroke="#868e96" strokeWidth="4" />}
          {secondPoint && drawRays(baseInput, baseHeights, orange, 'B')}
          {drawRays(input, heights, blue, 'A')}
          <line x1={px(-input.objectDistance)} x2={px(-input.objectDistance)} y1="170" y2={py(input.objectHeight)} stroke={orange} strokeWidth="6" />
          <circle cx={px(-input.objectDistance)} cy={py(input.objectHeight)} r="5" fill={orange} />
          <circle cx={px(-input.objectDistance)} cy="170" r="4" fill={orange} />
          {inFrame && imageVisible && <><line x1={px(image.imageDistance!)} x2={px(image.imageDistance!)} y1="170" y2={py(image.imageHeight!)} stroke={purple} strokeWidth="5" strokeDasharray={image.kind === 'virtual' ? '6 4' : undefined} /><circle cx={px(image.imageDistance!)} cy={py(image.imageHeight!)} r="5" fill={purple} /><circle cx={px(image.imageDistance!)} cy="170" r="4" fill={purple} /></>}

        </>}
      </g>
      {!focus && <>
        <text x={Math.max(105, px(-input.objectDistance))} y="108" textAnchor="middle">物の先端 A</text>
        <text x={px(-input.objectDistance)} y="245" textAnchor="middle">根元 B</text>
        {inFrame && imageVisible && <>
          {image.kind === 'virtual' && <line x1={px(image.imageDistance!) - 4} y1={py(image.imageHeight!)} x2={imageLabelX} y2={imageLabelY + 8} stroke="#868e96" strokeWidth="1" />}
          <text x={imageLabelX} y={imageLabelY} textAnchor="middle">Aの像</text>
        </>}
        {inFrame && imageVisible && <text x={px(image.imageDistance!)} y="150" textAnchor="middle">Bの像</text>}
        {!inFrame && image.kind !== 'at-infinity' && <text x="310" y="313" textAnchor="middle">描画範囲外の像：{image.kind === 'real' ? '右' : '左'} {cm(Math.abs(image.imageDistance!))} cm</text>}
        {screen !== undefined && <text x={Math.min(535, px(screen))} y="64" textAnchor="middle" stroke="white" strokeWidth="4" paintOrder="stroke">スクリーン</text>}
        {image.kind === 'virtual' && screen === undefined && <g><ellipse cx={px(eye.x) + 12} cy={py(eye.y)} rx="14" ry="10" fill="white" stroke="#495057" strokeWidth="2" /><line x1={px(eye.x)} x2={px(eye.x)} y1={py(eye.y) - 9} y2={py(eye.y) + 9} stroke="#495057" strokeWidth="3" /><text x={px(eye.x) + 12} y={py(eye.y) + 34} textAnchor="middle">目</text></g>}
      </>}
      {focus && <text x={px(input.focalLength) + 14} y="145">平行な光の集まる点</text>}
    </svg>
    <figcaption>実線：実際に進む光。矢印：進む向き。破線：逆向きの延長。{!focus && (secondPoint ? '先端Aからの光は青、根元Bからの光は橙です。出発する点の名前をたどって区別できます。' : '先端Aからの光を描いています。')}横から見た薄いレンズの作図で、縦の長さを拡大しています。図から角度は測れません。</figcaption>
    {thirdRay && !canShowThird && <p className="small-note">第三の作図線は、この条件ではレンズの描画範囲を通りません。中心を通る線と、軸に平行に入る線で像を求めます。</p>}
  </figure>
}

export function MirrorDiagram({ distance = .25, eyeY = -.12, extensions = true, normals = false, progress = 1 }: {
  distance?: number; eyeY?: number; extensions?: boolean; normals?: boolean; progress?: number
}) {
  const id = useId().replaceAll(':', '')
  const px = (x: number) => 310 + x * 620
  const py = (y: number) => 150 - y * 620
  const object = { x: -distance, y: .08 }
  const eye = { x: -.34, y: eyeY }
  const rays = [-.012, .012].map(offset => observeMirror(object, { ...eye, y: eye.y + offset }))
  const points = (ps: Point[]) => ps.map(p => `${px(p.x)},${py(p.y)}`).join(' ')
  return <figure className="image-diagram">
    <svg viewBox="0 0 620 350" role="img" aria-label="上から見た平面鏡。物の一点Aから鏡で反射して目へ届く二本の光。延長の交点は鏡の奥の対称な位置にある。">
      <defs><marker id={`${id}-arrow`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0 L7 3.5 L0 7" fill="none" stroke={blue} /></marker></defs>
      <rect x="311" y="40" width="292" height="255" fill="#f3f0ff" />
      <line x1="310" x2="310" y1="40" y2="295" stroke="#868e96" strokeWidth="5" />
      <text x="310" y="28" textAnchor="middle">平面鏡</text>
      <text x="90" y="305">鏡の手前</text><text x="470" y="305">鏡の奥</text>
      {rays.map((ray, i) => <g key={i}>
        <polyline points={points([object, ray.reflection])} fill="none" stroke={blue} strokeWidth="2.5" {...reveal(phase(progress, 0, .35))} markerEnd={progress >= .35 ? `url(#${id}-arrow)` : undefined} />
        <polyline points={points([ray.reflection, { ...eye, y: eye.y + (i ? .012 : -.012) }])} fill="none" stroke={blue} strokeWidth="2.5" {...reveal(phase(progress, .35, .7))} markerEnd={progress >= .7 ? `url(#${id}-arrow)` : undefined} />
        {extensions && progress > .7 && <line x1="310" y1={py(ray.reflection.y)} x2={px(ray.image.x * phase(progress, .7, 1))} y2={py(ray.reflection.y + (ray.image.y - ray.reflection.y) * phase(progress, .7, 1))} stroke={purple} strokeWidth="2" strokeDasharray="7 6" />}
        {normals && <line x1="220" x2="385" y1={py(ray.reflection.y)} y2={py(ray.reflection.y)} stroke="#868e96" strokeDasharray="2 5" />}
      </g>)}
      <circle cx={px(object.x)} cy={py(object.y)} r="7" fill={orange} /><text x={px(object.x)} y={py(object.y) - 18} textAnchor="middle">物の点 A</text>
      {extensions && progress >= 1 && <><circle cx={px(distance)} cy={py(object.y)} r="7" fill="white" stroke={purple} strokeWidth="3" /><text x={px(distance)} y={py(object.y) - 18} textAnchor="middle">Aの像</text>
        <text x="310" y="340" textAnchor="middle">Aと像は鏡から各 {cm(distance)} cm</text></>}
      <ellipse cx={px(eye.x) - 10} cy={py(eye.y)} rx="15" ry="12" fill="white" stroke="#495057" strokeWidth="2" />
      <line x1={px(eye.x)} x2={px(eye.x)} y1={py(eye.y) - 12} y2={py(eye.y) + 12} stroke="#495057" strokeWidth="3" /><text x={px(eye.x) - 10} y={py(eye.y) + (eyeY >= 0 ? 35 : -25)} textAnchor="middle">目</text>
    </svg>
    <figcaption>上から見た図。実線：物から鏡、鏡から目へ進む光。破線：目へ届く光の逆向きの延長。鏡の奥を光が通るわけではありません。点線を重ねると、鏡の面に90°で立つ基準線が見えます。</figcaption>
  </figure>
}

export function DirectDiagram({ extensions, progress = 1 }: { extensions: boolean; progress?: number }) {
  return <figure className="image-diagram"><svg viewBox="0 0 620 300" role="img" aria-label="物の先端Aから目へまっすぐ届く二本の光。逆に延ばすと元のAに戻る。">
    <line x1="120" y1="205" x2="120" y2="80" stroke={orange} strokeWidth="7" /><circle cx="120" cy="80" r="7" fill={orange} /><text x="120" y="52" textAnchor="middle">物の先端 A</text><text x="120" y="235" textAnchor="middle">根元 B</text>
    {[165, 185].map(y => <g key={y}><line x1="120" y1="80" x2="500" y2={y} stroke={blue} strokeWidth="3" {...reveal(phase(progress, 0, .35))} /><path d={`M330 ${80 + (y - 80) * 210 / 380 - 5} l10 8 l-12 2`} fill="none" stroke={blue} strokeWidth="2" opacity={progress >= .35 ? 1 : 0} />{extensions && progress > .7 && <line x1="500" y1={y} x2={500 - 380 * phase(progress, .7, 1)} y2={y + (80 - y) * phase(progress, .7, 1)} stroke={purple} strokeWidth="2" strokeDasharray="7 6" />}</g>)}
    <ellipse cx="520" cy="175" rx="23" ry="19" fill="white" stroke="#495057" strokeWidth="2" /><line x1="500" x2="500" y1="155" y2="195" stroke="#495057" strokeWidth="3" /><text x="520" y="225" textAnchor="middle">目</text>
  </svg><figcaption>説明用の模式図。目に入る細い束を二本の線で表しています。線は光の道筋で、物が移動する軌道ではありません。</figcaption></figure>
}
