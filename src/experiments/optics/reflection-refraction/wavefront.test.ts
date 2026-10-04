import { describe, expect, it } from 'vitest'
import { constructRefractionWavefront, observeOptics } from './model'

describe('ホイヘンスの屈折作図', () => {
  it('同じ経過時間の距離と、波面・光線の直交を満たす', () => {
    for (const angle of [0, 30, 45, 60]) {
      for (const [incidentIndex, transmittedIndex] of [[1, 1.33], [1, 1.5], [1.33, 1.33], [1.33, 1]]) {
        const parameters = { incidentAngle: angle * Math.PI / 180, incidentIndex, transmittedIndex }
        const result = observeOptics(parameters)
        const construction = constructRefractionWavefront(parameters, 2)
        if (result.kind === 'total-reflection') { expect(construction).toBeNull(); continue }
        const { elapsedTime, radius, incidentStart: b, tangentPoint: c, boundaryArrival: end, direction } = construction!
        // AB is the incident wavefront; BB′ is the distance traveled in medium 1.
        expect(b.x * result.incidentDirection.x + b.y * result.incidentDirection.y).toBeCloseTo(0)
        expect(Math.hypot(end.x - b.x, end.y - b.y)).toBeCloseTo(result.incidentSpeed * elapsedTime)
        expect(Math.hypot(c.x, c.y)).toBeCloseTo(result.transmittedSpeed * elapsedTime)
        expect(radius).toBeCloseTo(Math.hypot(c.x, c.y))
        // The new wavefront CB′ is tangent to A's wavelet, perpendicular to its radius.
        expect((end.x - c.x) * direction.x + (end.y - c.y) * direction.y).toBeCloseTo(0)
      }
    }
  })
  it('空気→水45°では波面が法線側へ傾く', () => {
    const construction = constructRefractionWavefront({ incidentAngle: Math.PI / 4, incidentIndex: 1, transmittedIndex: 1.33 })!
    expect(construction.radius).toBeCloseTo(Math.SQRT1_2 / 1.33)
    expect(Math.atan2(construction.direction.x, -construction.direction.y) * 180 / Math.PI).toBeCloseTo(32.1, 1)
  })
  it('縮尺の変更は時間と距離だけを変え、方向を変えない', () => {
    const p = { incidentAngle: Math.PI / 4, incidentIndex: 1, transmittedIndex: 1.5 }
    const first = constructRefractionWavefront(p, 1)!
    const second = constructRefractionWavefront(p, 3)!
    expect(second.radius).toBeCloseTo(first.radius * 3)
    expect(second.elapsedTime).toBeCloseTo(first.elapsedTime * 3)
    expect(second.direction).toEqual(first.direction)
  })
})
