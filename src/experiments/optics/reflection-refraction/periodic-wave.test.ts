import { describe, expect, it } from 'vitest'
import {
  advanceWavePresentation, boundaryFrontPoint, observeInterference, observePeriodicWave,
  observeTeachingLight, planeWavePhase, teachingLight, teachingRope, VACUUM_LIGHT_SPEED,
  waveCrestPositions, wavePhysicalTime,
} from './model'

const wavelength = teachingLight.wavelength
const period = teachingLight.period

describe('波の概念の説明に使う科学的な関係', () => {
  it('1周期後と1波長先では同じ進み具合になる', () => {
    for (const t of [0, period / 8, period / 2]) {
      const first = observePeriodicWave(teachingLight, wavelength / 8, t)
      expect(observePeriodicWave(teachingLight, wavelength / 8, t + period).value).toBeCloseTo(first.value)
      expect(observePeriodicWave(teachingLight, wavelength / 8 + wavelength, t).cycle).toBeCloseTo(first.cycle)
    }
  })
  it('波の形は速さλ/Tで進み、固定位置は往復する', () => {
    const x = wavelength / 7
    const t = period / 5
    expect(observePeriodicWave(teachingLight, x + VACUUM_LIGHT_SPEED * t, t).value)
      .toBeCloseTo(observePeriodicWave(teachingLight, x, 0).value)
    expect(observePeriodicWave(teachingRope, 0, 0).value).toBeCloseTo(0)
    expect(observePeriodicWave(teachingRope, 0, teachingRope.period / 4).value).toBeCloseTo(-1)
  })
  it('同じ値でも変化する向きが違えば位相は違う', () => {
    const first = observePeriodicWave(teachingLight, wavelength / 12, 0)
    const second = observePeriodicWave(teachingLight, 5 * wavelength / 12, 0)
    expect(first.value).toBeCloseTo(second.value)
    expect(first.cycle).not.toBeCloseTo(second.cycle)
    expect(first.rate).toBeLessThan(0)
    expect(second.rate).toBeGreaterThan(0)
  })
  it('真空の平面波は E = cB、二つの場は同じ位相', () => {
    for (const t of [0, period / 4, period / 2]) {
      const result = observeTeachingLight(wavelength / 9, t)
      expect(result.electricField).toBeCloseTo(VACUUM_LIGHT_SPEED * result.magneticField)
    }
  })
  it('周期平均の強さは同位相で4倍、逆位相で0になる', () => {
    expect(observeInterference(0, 0).relativeMeanIntensity).toBe(4)
    expect(observeInterference(0, Math.PI).relativeMeanIntensity).toBe(0)
    for (const t of [0, period / 8, period / 4]) {
      expect(observeInterference(t, Math.PI).total).toBeCloseTo(0)
    }
  })
  it('波面に沿って位相が変わらず、進む方向へ動かすと変わる', () => {
    for (const angle of [0, Math.PI / 6]) {
      const origin = { x: wavelength / 4 * Math.cos(angle), y: wavelength / 4 * Math.sin(angle) }
      const transverse = { x: origin.x - wavelength * Math.sin(angle), y: origin.y + wavelength * Math.cos(angle) }
      expect(planeWavePhase(origin, 0, angle)).toBeCloseTo(planeWavePhase(transverse, 0, angle))
      expect(planeWavePhase(origin, 0, angle)).not.toBeCloseTo(planeWavePhase({ x: origin.x + wavelength / 8 * Math.cos(angle), y: origin.y + wavelength / 8 * Math.sin(angle) }, 0, angle))
    }
  })
  it('山として描く場所は最大値1になる', () => {
    for (const t of [0, period / 3, period * 3]) {
      for (const crest of waveCrestPositions(teachingLight, t, 0, 3 * wavelength)) {
        expect(observeTeachingLight(crest, t).value).toBeCloseTo(1)
      }
    }
  })
  it('垂直入射では両端が同時に届き、斜めでは先に届く側がある', () => {
    expect(boundaryFrontPoint(-0.5, 2, 0).y).toBeCloseTo(boundaryFrontPoint(0.5, 2, 0).y)
    expect(boundaryFrontPoint(-0.5, 2, Math.PI / 4).y).toBeLessThan(0)
    expect(boundaryFrontPoint(0.5, 2, Math.PI / 4).y).toBeGreaterThan(0)
    const left = boundaryFrontPoint(-0.5, 8, Math.PI / 4)
    const right = boundaryFrontPoint(0.5, 8, Math.PI / 4)
    expect((right.y - left.y) / (right.x - left.x)).toBeCloseTo(Math.tan(Math.asin(Math.sin(Math.PI / 4) / 1.33)))
    expect(left.inWater).toBe(true)
    expect((right.x - left.x) * left.direction.x + (right.y - left.y) * left.direction.y).toBeCloseTo(0)
    const earlyLeft = boundaryFrontPoint(-0.5, 0, Math.PI / 4)
    const earlyRight = boundaryFrontPoint(0.5, 0, Math.PI / 4)
    expect(earlyLeft.inWater).toBe(false)
    expect((earlyRight.x - earlyLeft.x) * earlyLeft.direction.x + (earlyRight.y - earlyLeft.y) * earlyLeft.direction.y).toBeCloseTo(0)
  })
  it('説明の2秒は光の1周期に対応し、時刻はフレーム数に依存しない', () => {
    expect(wavePhysicalTime(2, teachingLight)).toBe(period)
    expect(advanceWavePresentation(0, 1000)).toBe(1)
    expect(advanceWavePresentation(7.8, 1000)).toBe(8)
    expect(advanceWavePresentation(3, -1)).toBe(3)
  })
})
