import { describe, expect, it } from 'vitest'
import { media, observeStrawScenePoint, observeStrawShape, strawScene } from './model'

describe('平らな水面と同じ目へ届くストローの光', () => {
  it('水なしの延長は、ストロー上の各点へ戻る', () => {
    for (const fraction of [.01, .25, .5, 1]) {
      const object = { x: strawScene.tip.x * fraction, y: strawScene.tip.y * fraction }
      const result = observeStrawScenePoint(false, object)
      expect(result.apparent.x).toBeCloseTo(object.x, 10)
      expect(result.apparent.y).toBeCloseTo(object.y, 10)
      for (const ray of result.rays) expect(ray.incidentAngle).toBeCloseTo(ray.exitAngle, 12)
    }
  })
  it('水ありの二本はスネルの法則を満たし、同じ目の入口へ届く', () => {
    const result = observeStrawScenePoint(true)
    for (const ray of result.rays) {
      expect(media.water.index * Math.sin(ray.incidentAngle)).toBeCloseTo(Math.sin(ray.exitAngle), 12)
      expect(ray.surface.x + ray.slope * strawScene.eye.y).toBeCloseTo(ray.eye.x, 12)
      expect(ray.eye.y).toBe(strawScene.eye.y)
      expect(Math.abs(ray.eye.x - strawScene.eye.x)).toBeCloseTo(strawScene.pupilHalfWidth, 12)
    }
    expect(result.apparent.y).toBeGreaterThan(result.object.y)
    expect(result.apparent.y).toBeLessThan(0)
  })
  it('観察の見える下端と説明図の交点が同じ位置になる', () => {
    for (const water of [false, true]) {
      const points = observeStrawShape(water)
      expect(points.at(-1)).toEqual(observeStrawScenePoint(water).apparent)
      expect(points.every(point => Number.isFinite(point.x) && Number.isFinite(point.y))).toBe(true)
    }
  })
  it('水面直下の点からも連続して近づき、水の切替で物と目を動かさない', () => {
    const result = observeStrawScenePoint(true, { x: -4e-7, y: -1e-6 })
    expect(Math.abs(result.apparent.x)).toBeLessThan(2e-6)
    expect(Math.abs(result.apparent.y)).toBeLessThan(1e-6)
    expect(observeStrawScenePoint(true).object).toEqual(observeStrawScenePoint(false).object)
    expect(observeStrawScenePoint(true).rays.map(ray => ray.eye)).toEqual(observeStrawScenePoint(false).rays.map(ray => ray.eye))
  })
  it('水面より上の点や非有限値を水中の点として計算しない', () => {
    for (const point of [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: NaN, y: -1 }]) {
      expect(() => observeStrawScenePoint(true, point)).toThrow(RangeError)
    }
  })
})
