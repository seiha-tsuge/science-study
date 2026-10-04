export interface AccelerationParameters {
  initialPosition: number // m
  initialVelocity: number // m/s
  acceleration: number // m/s²; 時間によらず一定
}

export function observeAcceleration(parameters: AccelerationParameters, time: number) {
  return {
    position:
      parameters.initialPosition +
      parameters.initialVelocity * time +
      0.5 * parameters.acceleration * time ** 2,
    velocity: parameters.initialVelocity + parameters.acceleration * time,
    acceleration: parameters.acceleration,
  }
}

/** Signed areas under v(t): rectangle from v₀ and triangle from at. Units: m. */
export function accelerationDisplacementParts(parameters: AccelerationParameters, time: number) {
  return {
    initialVelocityPart: parameters.initialVelocity * time,
    accelerationPart: 0.5 * parameters.acceleration * time ** 2,
  }
}
