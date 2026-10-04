import { describe, expect, it } from 'vitest'
import { explanationPhysicalTime } from './explanation-timeline'
import { observeMotion } from './model'

describe('説明の時間と物理時刻の対応', () => {
  const parameters = { initialPosition: 0, velocity: 5 }

  it('座標の紹介中は初期条件、解説中は4秒の位置を保つ', () => {
    for (const seconds of [0, 1, 2]) {
      expect(observeMotion(parameters, explanationPhysicalTime(seconds)).position).toBe(0)
    }
    for (const seconds of [6, 10, 14, 18, 22]) {
      expect(observeMotion(parameters, explanationPhysicalTime(seconds)).position).toBe(20)
    }
  })

  it('運動の場面は時間に比例し、演出の緩急で速度を変えない', () => {
    for (const elapsed of [1 / 60, 1 / 30, 0.1, 0.5, 1]) {
      const start = observeMotion(parameters, explanationPhysicalTime(3)).position
      const end = observeMotion(parameters, explanationPhysicalTime(3 + elapsed)).position
      expect((end - start) / elapsed).toBeCloseTo(5)
    }
  })

  it('巻き戻しても同じ時刻の位置を再現できる', () => {
    expect([6, 3, 5, 2, 4].map((seconds) =>
      observeMotion(parameters, explanationPhysicalTime(seconds)).position,
    )).toEqual([20, 5, 15, 0, 10])
  })
})
