import { describe, expect, it } from 'vitest'
import { accelerationDisplacementParts, observeAcceleration } from './model'
import { observeMotion } from '../motion/model'

describe('等加速度運動の科学的な性質', () => {
  it('初期条件を保つ', () => {
    expect(
      observeAcceleration({ initialPosition: -4, initialVelocity: 3, acceleration: 2 }, 0),
    ).toEqual({ position: -4, velocity: 3, acceleration: 2 })
  })
  it('静止からa=2 m/s²で3秒後に位置9 m・速度6 m/sになる', () => {
    expect(
      observeAcceleration({ initialPosition: 0, initialVelocity: 0, acceleration: 2 }, 3),
    ).toEqual({ position: 9, velocity: 6, acceleration: 2 })
  })
  it('a=0なら等速運動と一致する', () => {
    for (const time of [0, 0.25, 1, 4, 10]) {
      expect(
        observeAcceleration({ initialPosition: 10, initialVelocity: -3, acceleration: 0 }, time),
      ).toEqual(observeMotion({ initialPosition: 10, velocity: -3 }, time))
    }
  })
  it('平均速度に経過時間をかけると変位に一致する', () => {
    const parameters = { initialPosition: 5, initialVelocity: 4, acceleration: -1.5 }
    const result = observeAcceleration(parameters, 6)
    expect(result.position - parameters.initialPosition).toBeCloseTo(
      ((parameters.initialVelocity + result.velocity) / 2) * 6,
    )
  })
  it('負の加速度で停止し、加速度を保つと向きを変える', () => {
    const parameters = { initialPosition: 0, initialVelocity: 4, acceleration: -2 }
    expect(observeAcceleration(parameters, 2)).toEqual({
      position: 4,
      velocity: 0,
      acceleration: -2,
    })
    expect(observeAcceleration(parameters, 3)).toEqual({
      position: 3,
      velocity: -2,
      acceleration: -2,
    })
  })
  it('時刻を消去した関係 v² − v₀² = 2a(x − x₀) を満たす', () => {
    const parameters = { initialPosition: 7, initialVelocity: 5, acceleration: -1.5 }
    for (const time of [0, 0.5, 2, 7, 10]) {
      const result = observeAcceleration(parameters, time)
      expect(result.velocity ** 2 - parameters.initialVelocity ** 2).toBeCloseTo(
        2 * parameters.acceleration * (result.position - parameters.initialPosition),
      )
    }
  })
})

describe('変位の面積による分解', () => {
  it('時間を2倍にすると初速度の寄与は2倍、加速度の寄与は4倍になる', () => {
    const parameters = { initialPosition: 10, initialVelocity: 2, acceleration: 1 }
    const first = accelerationDisplacementParts(parameters, 2)
    const second = accelerationDisplacementParts(parameters, 4)
    expect(first).toEqual({ initialVelocityPart: 4, accelerationPart: 2 })
    expect(second.initialVelocityPart).toBe(first.initialVelocityPart * 2)
    expect(second.accelerationPart).toBe(first.accelerationPart * 4)
  })
  it('負の速度・加速度も符号付き面積として変位と一致する', () => {
    for (const initialVelocity of [-3, 0, 2]) {
      for (const acceleration of [-2, 0, 1]) {
        const parameters = { initialPosition: 8, initialVelocity, acceleration }
        for (const time of [0, 2, 5]) {
          const parts = accelerationDisplacementParts(parameters, time)
          expect(parts.initialVelocityPart + parts.accelerationPart).toBeCloseTo(observeAcceleration(parameters, time).position - 8)
        }
      }
    }
  })
})
