export interface Observation {
  position: number
  velocity: number
  acceleration: number
}

export interface Trajectory {
  label: string
  observe: (time: number) => Observation
}

export const DURATION = 10 // s
