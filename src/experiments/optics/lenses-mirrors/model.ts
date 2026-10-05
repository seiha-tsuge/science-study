/** Thin lens in air. Coordinates and distances are metres; lens at x=0, light travels +x. */
export interface Point { x: number; y: number }
export interface LensInput { focalLength: number; objectDistance: number; objectHeight: number }
export type LensImage =
  | { kind: 'at-infinity'; imageDistance: null; imageHeight: null; magnification: null }
  | { kind: 'real' | 'virtual'; imageDistance: number; imageHeight: number; magnification: number }

/** Walking analogy in SI units, not a simulation of light inside a lens. */
export function observeSandRow(time: number, slower: boolean) {
  finite(time)
  if (time < 0) throw new RangeError('時刻は0秒以上にしてください')
  const speed = 1
  const sandSpeed = slower ? .5 : speed
  const entrance = .4
  const radius = .32
  const halfWidth = .25
  const widthAt = (y: number) => .24 - (radius - Math.sqrt(radius ** 2 - y ** 2))
  const position = (y: number) => {
    const length = widthAt(y)
    const entryTime = entrance / speed
    const exitTime = entryTime + length / sandSpeed
    const x = time <= entryTime ? time * speed
      : time <= exitTime ? entrance + (time - entryTime) * sandSpeed
        : entrance + length + (time - exitTime) * speed
    return { x, y, length, inSand: time >= entryTime && time < exitTime }
  }
  const walkers = Array.from({ length: 7 }, (_, index) => position(halfWidth * (index - 3) / 3))
  const center = position(0)
  // Only the final curved shape is transferred to an ideal converging wavefront.
  const afterSand = walkers.every(walker => !walker.inSand && walker.x >= entrance + walker.length)
  const focus = slower && afterSand ? { x: center.x + radius, y: 0 } : null
  return { walkers, entrance, halfWidth, widthAt, center, focus, speed, sandSpeed, afterSand }
}

function finite(value: number) {
  if (!Number.isFinite(value)) throw new RangeError('量は有限値にしてください')
}
function positive(value: number) {
  finite(value)
  if (value <= 0) throw new RangeError('距離は正の値にしてください')
}
function validateLens(input: LensInput) {
  positive(input.focalLength)
  positive(input.objectDistance)
  finite(input.objectHeight)
}

export function observeLens(input: LensInput): LensImage {
  validateLens(input)
  const { focalLength: f, objectDistance: d, objectHeight: h } = input
  // Only machine-roundoff equality is treated as the exact focal condition.
  if (Math.abs(d - f) <= Number.EPSILON * 8 * Math.max(d, f)) {
    return { kind: 'at-infinity', imageDistance: null, imageHeight: null, magnification: null }
  }
  const imageDistance = f * d / (d - f)
  const magnification = -imageDistance / d
  return { kind: imageDistance > 0 ? 'real' : 'virtual', imageDistance, imageHeight: h * magnification, magnification }
}

/** Nearest available screen position, in metres. Only roundoff may cross the range boundary. */
export function nearestScreenPosition(image: LensImage, min: number, max: number, step: number): number | null {
  positive(min); positive(max); positive(step)
  if (max < min) throw new RangeError('スクリーンの範囲を確認してください')
  if (image.kind !== 'real') return null
  const distance = image.imageDistance
  const tolerance = Number.EPSILON * 8 * Math.max(distance, max)
  if (distance < min - tolerance || distance > max + tolerance) return null
  const nearest = min + Math.round((distance - min) / step) * step
  return Math.min(max, Math.max(min, nearest))
}

/** A ray through height y at the ideal thin lens: slope after = slope before - y/f. */
export function traceLensRay(input: LensInput, lensHeight: number, x: number): Point {
  validateLens(input)
  finite(lensHeight)
  finite(x)
  const incomingSlope = (lensHeight - input.objectHeight) / input.objectDistance
  const outgoingSlope = incomingSlope - lensHeight / input.focalLength
  return { x, y: lensHeight + x * (x < 0 ? incomingSlope : outgoingSlope) }
}

/** Backward geometric extension of an outgoing ray, not a ray on the object side. */
export function extendLensRay(input: LensInput, lensHeight: number, x: number): Point {
  validateLens(input)
  finite(lensHeight)
  finite(x)
  return { x, y: lensHeight + x * ((lensHeight - input.objectHeight) / input.objectDistance - lensHeight / input.focalLength) }
}

/** Lens height for a ray from the object point to a specified point on the observer's pupil. */
export function lensHeightToEye(input: LensInput, eye: Point): number {
  validateLens(input)
  positive(eye.x)
  finite(eye.y)
  const denominator = 1 + eye.x * (1 / input.objectDistance - 1 / input.focalLength)
  if (Math.abs(denominator) < 1e-12) throw new RangeError('目が像の面と重なっています')
  return (eye.y + input.objectHeight * eye.x / input.objectDistance) / denominator
}

/** Plane mirror at x=0, object and observer on x<0. The mirror is ideal and unbounded. */
export function observeMirror(object: Point, eye: Point) {
  finite(object.x); finite(object.y); finite(eye.x); finite(eye.y)
  if (object.x >= 0 || eye.x >= 0) throw new RangeError('物と目は鏡の手前に置いてください')
  const image = { x: -object.x, y: object.y }
  const fraction = image.x / (image.x - eye.x)
  const reflection = { x: 0, y: image.y + fraction * (eye.y - image.y) }
  const incidenceAngle = Math.atan2(Math.abs(reflection.y - object.y), -object.x)
  const reflectionAngle = Math.atan2(Math.abs(eye.y - reflection.y), -eye.x)
  return { image, reflection, incidenceAngle, reflectionAngle }
}
