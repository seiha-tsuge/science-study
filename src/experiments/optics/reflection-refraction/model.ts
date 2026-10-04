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
