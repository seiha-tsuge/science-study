/** Homogeneous, isotropic, transparent media and a flat interface. Angles in radians. */
export const VACUUM_LIGHT_SPEED = 299_792_458 // m/s

export const media = {
  air: { name: '空気', index: 1.0 },
  water: { name: '水', index: 1.33 },
  glass: { name: 'ガラス', index: 1.5 },
} as const

export interface OpticalParameters {
  incidentAngle: number // rad, signed relative to the normal; |angle| < π/2
  incidentIndex: number // dimensionless
  transmittedIndex: number // dimensionless
}

export interface Direction { x: number; y: number } // dimensionless, y points upward

export function observeOptics({ incidentAngle, incidentIndex, transmittedIndex }: OpticalParameters) {
  if (!Number.isFinite(incidentAngle) || Math.abs(incidentAngle) >= Math.PI / 2) {
    throw new RangeError('入射角は −π/2 より大きく π/2 より小さい有限の値にしてください。')
  }
  if (![incidentIndex, transmittedIndex].every((n) => Number.isFinite(n) && n > 0)) {
    throw new RangeError('屈折率は正の有限の値にしてください。')
  }
  const sine = incidentIndex / transmittedIndex * Math.sin(incidentAngle)
  const magnitude = Math.abs(sine)
  const tolerance = 8 * Number.EPSILON
  const kind = magnitude > 1 + tolerance ? 'total-reflection'
    : Math.abs(magnitude - 1) <= tolerance ? 'critical' : 'transmitted'
  const refractedAngle = kind === 'total-reflection' ? null
    : Math.asin(Math.max(-1, Math.min(1, sine)))
  return {
    kind,
    hasReflectedRay: incidentIndex !== transmittedIndex,
    reflectedAngle: incidentAngle,
    refractedAngle,
    criticalAngle: incidentIndex > transmittedIndex ? Math.asin(transmittedIndex / incidentIndex) : null,
    incidentSpeed: VACUUM_LIGHT_SPEED / incidentIndex,
    transmittedSpeed: VACUUM_LIGHT_SPEED / transmittedIndex,
    incidentDirection: { x: Math.sin(incidentAngle), y: -Math.cos(incidentAngle) },
    reflectedDirection: { x: Math.sin(incidentAngle), y: Math.cos(incidentAngle) },
    refractedDirection: refractedAngle === null ? null : {
      x: Math.sin(refractedAngle), y: kind === 'critical' ? 0 : -Math.cos(refractedAngle),
    },
  }
}

/** Huygens construction at the moment B reaches the interface. Coordinates in m. */
export function constructRefractionWavefront(parameters: OpticalParameters, separation = 1) {
  if (!Number.isFinite(separation) || separation <= 0 || parameters.incidentAngle < 0) {
    throw new RangeError('この作図では正の境界上の距離と0以上の入射角を指定してください。')
  }
  const result = observeOptics(parameters)
  if (!result.refractedDirection) return null
  const sine = Math.sin(parameters.incidentAngle)
  const cosine = Math.cos(parameters.incidentAngle)
  const elapsedTime = separation * sine / result.incidentSpeed
  const radius = result.transmittedSpeed * elapsedTime
  return {
    elapsedTime, // s, not animation duration
    radius, // m
    incidentStart: { x: separation * cosine ** 2, y: separation * sine * cosine },
    boundaryArrival: { x: separation, y: 0 },
    tangentPoint: {
      x: radius * result.refractedDirection.x,
      y: radius * result.refractedDirection.y,
    },
    direction: result.refractedDirection,
  }
}

export interface PeriodicWaveParameters {
  wavelength: number // m
  period: number // s
}

// A single linearly polarized plane wave in vacuum; E₀ is a teaching example.
export const teachingLight = {
  wavelength: 600e-9, // m
  period: 600e-9 / VACUUM_LIGHT_SPEED, // s
  electricAmplitude: 1, // V/m
} as const
export const teachingRope = { wavelength: 1, period: 2, amplitude: 0.2 } as const
export const WAVE_PRESENTATION_DURATION = 8 // explanation seconds, four cycles

export function wavePhysicalTime(presentationTime: number, parameters: PeriodicWaveParameters) {
  return presentationTime / 2 * parameters.period
}

export function observePeriodicWave(parameters: PeriodicWaveParameters, position: number, time: number) {
  if (![parameters.wavelength, parameters.period].every(value => Number.isFinite(value) && value > 0)
    || ![position, time].every(Number.isFinite)) {
    throw new RangeError('波長・周期は正の有限値、位置と時刻は有限値で指定してください。')
  }
  const phase = 2 * Math.PI * (position / parameters.wavelength - time / parameters.period)
  return {
    phase,
    cycle: ((phase / (2 * Math.PI)) % 1 + 1) % 1,
    value: Math.sin(phase), // normalized displacement or field, dimensionless
    rate: -2 * Math.PI / parameters.period * Math.cos(phase), // normalized value / s
    trend: Math.abs(Math.cos(phase)) < 1e-10 ? 'turning' : Math.cos(phase) > 0 ? 'decreasing' : 'increasing',
  }
}

export function observeTeachingLight(position: number, time: number) {
  const wave = observePeriodicWave(teachingLight, position, time)
  return {
    ...wave,
    electricField: teachingLight.electricAmplitude * wave.value, // V/m, y direction
    magneticField: teachingLight.electricAmplitude / VACUUM_LIGHT_SPEED * wave.value, // T, z direction
  }
}

export function waveCrestPositions(parameters: PeriodicWaveParameters, time: number, min: number, max: number) {
  const offset = time / parameters.period + 0.25
  const first = Math.ceil(min / parameters.wavelength - offset)
  const last = Math.floor(max / parameters.wavelength - offset)
  return Array.from({ length: Math.max(0, last - first + 1) }, (_, index) =>
    (first + index + offset) * parameters.wavelength)
}

/** Phase in an isotropic plane wave. Positions in m; angle from the x-axis in rad. */
export function planeWavePhase(position: { x: number; y: number }, time: number, angle: number) {
  const distance = position.x * Math.cos(angle) + position.y * Math.sin(angle)
  return observePeriodicWave(teachingLight, distance, time).phase
}

/** Equal-amplitude, coherent, same-polarization fields at one observation point. */
export function observeInterference(time: number, phaseDifference: number) {
  const phase = observePeriodicWave(teachingLight, 0, time).phase
  const first = Math.sin(phase)
  const second = Math.sin(phase + phaseDifference)
  return {
    first, second, total: first + second,
    relativeMeanIntensity: 2 + 2 * Math.cos(phaseDifference), // relative to ONE wave, averaged over cycles
  }
}

/** One constant-phase front crossing air→water. No amplitude or reflected wave. */
export function boundaryFrontPoint(horizontalPosition: number, presentationTime: number, incidentAngle: number) {
  const result = observeOptics({ incidentAngle, incidentIndex: 1, transmittedIndex: media.water.index })
  const time = presentationTime / WAVE_PRESENTATION_DURATION * 1.2 / result.incidentSpeed // s
  const incidentDistance = -0.5 + result.incidentSpeed * time // m, entire chosen front initially above water
  const incidentHeight = (Math.sin(incidentAngle) * horizontalPosition - incidentDistance) / Math.cos(incidentAngle)
  const refractedAngle = result.refractedAngle!
  const inWater = incidentHeight < 0
  return {
    time,
    x: horizontalPosition,
    inWater,
    direction: inWater ? result.refractedDirection! : result.incidentDirection,
    y: !inWater ? incidentHeight
      : (Math.sin(refractedAngle) * horizontalPosition - incidentDistance * result.transmittedSpeed / result.incidentSpeed) / Math.cos(refractedAngle),
  }
}

export function advanceWavePresentation(current: number, elapsedMilliseconds: number) {
  return Math.min(WAVE_PRESENTATION_DURATION, current + Math.max(0, elapsedMilliseconds) / 1000)
}

/** Illustrative walkers keep their heading; only their speed changes at y=0. SI units.
 * This is an analogy for a changing row, not a model of optical refraction.
 */
export function observeWalkingRow(time: number, slanted: boolean, slower: boolean) {
  const angle = slanted ? Math.PI / 4 : 0
  const direction = { x: Math.sin(angle), y: -Math.cos(angle) }
  const roadSpeed = 1.5 // m/s, an illustrative choice
  const sandSpeed = slower ? 0.75 : roadSpeed
  return Array.from({ length: 5 }, (_, i) => {
    const alongRow = (i - 2) * 0.25 // m
    const start = {
      x: alongRow * Math.cos(angle) - 0.8 * Math.sin(angle),
      y: alongRow * Math.sin(angle) + 0.8 * Math.cos(angle),
    }
    const arrivalTime = start.y / (-direction.y * roadSpeed)
    const distance = roadSpeed * Math.min(time, arrivalTime) + sandSpeed * Math.max(0, time - arrivalTime)
    return {
      start, arrivalTime, direction,
      x: start.x + distance * direction.x,
      y: start.y + distance * direction.y,
      inSand: time >= arrivalTime,
    }
  })
}

/** A narrow ray bundle from a marked point on a straw through a flat water surface.
 * Backward extensions approximate its apparent position locally, not the whole image.
 * Coordinates in m, y upward; wall refraction and the eye's lens are omitted.
 */
export function observeStrawPoint() {
  const object = { x: -0.35, y: -0.65 }
  const rays = [0.05, 0.08].map(x => {
    const incidentAngle = Math.atan2(x - object.x, -object.y)
    const result = observeOptics({ incidentAngle, incidentIndex: media.water.index, transmittedIndex: media.air.index })
    const slope = Math.tan(result.refractedAngle!) // dx/dy for upward-going light
    return { surface: { x, y: 0 }, slope, end: { x: x + slope * 0.5, y: 0.5 }, incidentAngle, exitAngle: result.refractedAngle! }
  })
  const apparentY = (rays[1].surface.x - rays[0].surface.x) / (rays[0].slope - rays[1].slope)
  return { object, rays, apparent: { x: rays[0].surface.x + rays[0].slope * apparentY, y: apparentY } }
}


/** Fixed everyday scene, metres; horizontal water surface at y=0, y upward.
 * The pupil is represented by two nearby points. No glass wall or eye lens.
 */
export const strawScene = {
  tip: { x: -0.18, y: -0.45 },
  top: { x: 0.14, y: 0.35 },
  eye: { x: 0.55, y: 0.65 },
  pupilHalfWidth: 0.003,
} as const

/** Solve Snell's law for a submerged point→flat surface→pupil path.
 * A local two-ray backward intersection approximates apparent position.
 * This is not a photographic rendering or a global image plane.
 */
export function observeStrawScenePoint(hasWater: boolean, point: Direction = strawScene.tip) {
  if (![point.x, point.y].every(Number.isFinite) || point.y >= 0) {
    throw new RangeError('水面より下の有限な点を指定してください。')
  }
  const index = hasWater ? media.water.index : media.air.index
  const rays = [-1, 1].map(side => {
    const eye = { x: strawScene.eye.x + side * strawScene.pupilHalfWidth, y: strawScene.eye.y }
    let low = Math.min(point.x, eye.x)
    let high = Math.max(point.x, eye.x)
    for (let iteration = 0; iteration < 64; iteration++) {
      const x = (low + high) / 2
      const before = Math.atan2(x - point.x, -point.y)
      const after = Math.atan2(eye.x - x, eye.y)
      if (index * Math.sin(before) > media.air.index * Math.sin(after)) high = x
      else low = x
    }
    const surface = { x: (low + high) / 2, y: 0 }
    const slope = (eye.x - surface.x) / eye.y
    return { surface, eye, slope, incidentAngle: Math.atan2(surface.x - point.x, -point.y), exitAngle: Math.atan(slope) }
  })
  const y = (rays[1].surface.x - rays[0].surface.x) / (rays[0].slope - rays[1].slope)
  return { object: point, rays, apparent: { x: rays[0].surface.x + rays[0].slope * y, y } }
}

/** Sample the same straight straw; each submerged point has its own local image. */
export function observeStrawShape(hasWater: boolean) {
  return Array.from({ length: 25 }, (_, i) => {
    const fraction = (i + 1) / 25
    const point = { x: strawScene.tip.x * fraction, y: strawScene.tip.y * fraction }
    return observeStrawScenePoint(hasWater, point).apparent
  })
}
