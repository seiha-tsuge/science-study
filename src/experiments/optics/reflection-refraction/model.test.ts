import { describe, expect, it } from 'vitest'
import { observeOptics, VACUUM_LIGHT_SPEED } from './model'

const radians = (degrees: number) => degrees * Math.PI / 180
const observe = (angle: number, n1 = 1, n2 = 1.33) => observeOptics({
  incidentAngle: radians(angle), incidentIndex: n1, transmittedIndex: n2,
})

describe('反射・屈折の科学的な性質', () => {
  it('垂直入射では速さが変わっても向きは変わらない', () => {
    const result = observe(0)
    expect(result.reflectedAngle).toBe(0)
    expect(result.refractedAngle).toBe(0)
    expect(result.refractedDirection).toEqual({ x: 0, y: -1 })
    expect(result.incidentSpeed).toBe(VACUUM_LIGHT_SPEED)
    expect(result.transmittedSpeed).toBeCloseTo(VACUUM_LIGHT_SPEED / 1.33)
  })
  it('空気→水の45°は約32.12°（既知の解）', () => {
    const result = observe(45)
    expect(result.reflectedAngle).toBeCloseTo(radians(45))
    expect(result.refractedAngle! * 180 / Math.PI).toBeCloseTo(32.1176, 3)
  })
  it('同じ屈折率では斜めに入っても曲がらない', () => {
    expect(observe(37, 1.5, 1.5).refractedAngle).toBeCloseTo(radians(37))
    expect(observe(37, 1.5, 1.5).hasReflectedRay).toBe(false)
  })
  it('法線に対する左右の対称性と反射の法則を満たす', () => {
    const left = observe(-45), right = observe(45)
    expect(left.refractedAngle).toBeCloseTo(-right.refractedAngle!)
    expect(right.reflectedDirection.x).toBe(right.incidentDirection.x)
    expect(right.reflectedDirection.y).toBe(-right.incidentDirection.y)
    for (const direction of [right.incidentDirection, right.reflectedDirection, right.refractedDirection!]) {
      expect(Math.hypot(direction.x, direction.y)).toBeCloseTo(1)
    }
  })
  it('透過する範囲ではスネルの法則と光路の可逆性を満たす', () => {
    for (const angle of [0, 10, 30, 45, 80]) {
      const forward = observe(angle)
      const phi = forward.refractedAngle!
      expect(1.33 * Math.sin(phi)).toBeCloseTo(Math.sin(radians(angle)))
      const reverse = observeOptics({ incidentAngle: phi, incidentIndex: 1.33, transmittedIndex: 1 })
      expect(reverse.refractedAngle).toBeCloseTo(radians(angle))
    }
  })
  it('水→空気の臨界角の前・一致・後を区別する', () => {
    const critical = Math.asin(1 / 1.33)
    const parameters = { incidentIndex: 1.33, transmittedIndex: 1 }
    expect(observeOptics({ ...parameters, incidentAngle: critical - 1e-6 }).kind).toBe('transmitted')
    const boundary = observeOptics({ ...parameters, incidentAngle: critical })
    expect(boundary.kind).toBe('critical')
    expect(boundary.refractedAngle).toBeCloseTo(Math.PI / 2)
    expect(boundary.refractedDirection!.y).toBe(0)
    const total = observeOptics({ ...parameters, incidentAngle: critical + 1e-6 })
    expect(total.kind).toBe('total-reflection')
    expect(total.refractedAngle).toBeNull()
    expect(total.refractedDirection).toBeNull()
    expect(observe(60, 1.33, 1).kind).toBe('total-reflection')
    expect(observe(80).criticalAngle).toBeNull()
  })
  it('モデルの適用範囲外の入力を拒否する', () => {
    for (const angle of [90, -90, NaN, Infinity]) expect(() => observe(angle)).toThrow(RangeError)
    for (const index of [0, -1, NaN, Infinity]) {
      expect(() => observe(30, index, 1)).toThrow(RangeError)
      expect(() => observe(30, 1, index)).toThrow(RangeError)
    }
  })
})
