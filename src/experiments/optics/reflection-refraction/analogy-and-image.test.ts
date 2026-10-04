import { describe, expect, it } from 'vitest'
import { boundaryFrontPoint, media, observeStrawPoint, observeWalkingRow } from './model'

describe('人の列の模式図と、ストローの点の光学モデル', () => {
  it('初めは全員が道の上に並び、AがBより先に砂地へ着く', () => {
    const row = observeWalkingRow(0, true, true)
    expect(row.every(p => p.y > 0 && !p.inSand)).toBe(true)
    expect(row[0].arrivalTime).toBeLessThan(row[4].arrivalTime)
    const midway = observeWalkingRow(0.75, true, true)
    expect(midway[0].inSand).toBe(true)
    expect(midway[4].inSand).toBe(false)
  })
  it('同じ速さなら向きは変わらず、垂直入射なら同時に遅くなる', () => {
    const first = observeWalkingRow(0, true, false)
    const later = observeWalkingRow(2, true, false)
    expect(later[4].x - later[0].x).toBeCloseTo(first[4].x - first[0].x)
    expect(later[4].y - later[0].y).toBeCloseTo(first[4].y - first[0].y)
    const simultaneous = observeWalkingRow(2, false, true)
    expect(simultaneous.every(p => p.y === simultaneous[0].y)).toBe(true)
    expect(simultaneous.every(p => p.arrivalTime === simultaneous[0].arrivalTime)).toBe(true)
  })
  it('砂地で遅くなると列の角度は変わるが、人の歩く向きは変わらない', () => {
    const first = observeWalkingRow(0, true, true)
    const later = observeWalkingRow(2, true, true)
    const slope = (row: typeof first) => (row[4].y - row[0].y) / (row[4].x - row[0].x)
    expect(slope(later)).not.toBeCloseTo(slope(first))
    for (const [i, p] of later.entries()) {
      expect(p.direction).toEqual(first[i].direction)
      const dx = p.x - p.start.x
      const dy = p.y - p.start.y
      expect(dx * p.direction.y - dy * p.direction.x).toBeCloseTo(0)
    }
  })
  it('光の列も初めは全体が水へ入る前にある', () => {
    for (const angle of [0, Math.PI / 4]) {
      for (const x of [-0.6, 0.6]) expect(boundaryFrontPoint(x, 0, angle).inWater).toBe(false)
    }
  })
  it('ストローからの二本の光はスネルの法則を満たし、延長は浅い点で交わる', () => {
    const { object, apparent, rays } = observeStrawPoint()
    expect(apparent.y).toBeGreaterThan(object.y)
    expect(apparent.y).toBeLessThan(0)
    for (const ray of rays) {
      expect(media.water.index * Math.sin(ray.incidentAngle)).toBeCloseTo(media.air.index * Math.sin(ray.exitAngle))
      expect(Math.tan(ray.incidentAngle)).toBeCloseTo((ray.surface.x - object.x) / -object.y)
      expect(ray.surface.x + ray.slope * apparent.y).toBeCloseTo(apparent.x)
      expect(ray.end.x - ray.surface.x).toBeCloseTo(ray.slope * ray.end.y)
    }
  })
})
