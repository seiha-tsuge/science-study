export interface MotionParameters {
  initialPosition: number // m
  velocity: number // m/s; 右向きが正
}

export function observeMotion(parameters: MotionParameters, time: number) {
  return {
    position: parameters.initialPosition + parameters.velocity * time,
    velocity: parameters.velocity,
    acceleration: 0,
  }
}
