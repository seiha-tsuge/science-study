import { describe, expect, it } from 'vitest'
import { extendLensRay, lensHeightToEye, nearestScreenPosition, observeLens, observeMirror, observeSandRow, traceLensRay } from './model'

const base = { focalLength: .1, objectDistance: .2, objectHeight: .02 }

describe('砂地から光の並びへ渡す模式図', () => {
  it('砂地へ入る前は全員が同じ横の位置にいる', () => {
    const row = observeSandRow(.25, true)
    for (const person of row.walkers) expect(person.x).toBe(.25)
    expect(row.afterSand).toBe(false)
    expect(row.focus).toBeNull()
  })
  it('中央は砂地にいる間、両端は出て先へ進む', () => {
    const row = observeSandRow(.7, true)
    expect(row.center.inSand).toBe(true)
    expect(row.walkers[0].inSand).toBe(false)
    expect(row.center.x).toBeLessThan(row.walkers[0].x)
  })
  it('同じ速さなら砂地の長さによらず平らな列を保つ', () => {
    const row = observeSandRow(1.1, false)
    for (const person of row.walkers) expect(person.x).toBeCloseTo(1.1)
    expect(row.focus).toBeNull()
  })
  it('通過後の遅れは中央で大きく、上下の位置は対称', () => {
    const row = observeSandRow(1.1, true)
    expect(row.afterSand).toBe(true)
    expect(row.center.x).toBeCloseTo(.86)
    expect(row.walkers[0].x).toBeCloseTo(row.walkers[6].x)
    expect(row.center.x).toBeLessThan(row.walkers[0].x)
    // The chosen final arc has normals through one point, not walking trajectories through it.
    for (const point of row.walkers) expect(Math.hypot(point.x - row.focus!.x, point.y)).toBeCloseTo(.32)
  })
})

describe('薄い凸レンズの既知の解と境界', () => {
  it.each([
    [.3, 'real', .15, -.5], [.2, 'real', .2, -1], [.15, 'real', .3, -2], [.075, 'virtual', -.3, 4], [.05, 'virtual', -.1, 2],
  ] as const)('物の距離 %s m の像', (objectDistance, kind, distance, magnification) => {
    const result = observeLens({ ...base, objectDistance })
    expect(result.kind).toBe(kind)
    expect(result.imageDistance).toBeCloseTo(distance)
    expect(result.magnification).toBeCloseTo(magnification)
    expect(result.imageHeight).toBeCloseTo(.02 * magnification)
  })
  it('焦点ちょうどを有限の像やInfinity座標として返さない', () => {
    expect(observeLens({ ...base, objectDistance: .1 })).toEqual({ kind: 'at-infinity', imageDistance: null, imageHeight: null, magnification: null })
    const ys = [-.03, 0, .03].map(h => traceLensRay({ ...base, objectDistance: .1 }, h, .3).y - h)
    expect(ys[0]).toBeCloseTo(ys[1]); expect(ys[1]).toBeCloseTo(ys[2])
  })
  it('焦点に近い条件を焦点と取り違えない', () => {
    expect(observeLens({ ...base, objectDistance: .100001 }).kind).toBe('real')
    expect(observeLens({ ...base, objectDistance: .099999 }).kind).toBe('virtual')
  })
  it.each([.3, .2, .15, .075, .05])('任意の光線が同じ像の一点に対応する: a=%s', objectDistance => {
    const input = { ...base, objectDistance }
    const image = observeLens(input)
    expect(image.imageDistance).not.toBeNull()
    for (const height of [-.03, 0, .02, .03]) {
      expect(extendLensRay(input, height, image.imageDistance!).y).toBeCloseTo(image.imageHeight!)
      expect(traceLensRay(input, height, -objectDistance).y).toBeCloseTo(input.objectHeight)
    }
  })
  it('物の高さの符号を反転すると像も反転し、軸上の点は軸上に結像する', () => {
    expect(observeLens({ ...base, objectHeight: -.02 }).imageHeight).toBeCloseTo(.02)
    expect(observeLens({ ...base, objectHeight: 0 }).imageHeight).toBeCloseTo(0)
  })
  it('距離と高さを同じ比で拡大すると倍率は変わらない', () => {
    const scaled = observeLens({ focalLength: 1, objectDistance: 2, objectHeight: .2 })
    expect(scaled.magnification).toBeCloseTo(-1)
    expect(scaled.imageHeight).toBeCloseTo(-.2)
  })
  it('スクリーンが像の面にあると光の高さが一致し、離すと一致しない', () => {
    expect(traceLensRay(base, .02, .2).y).toBeCloseTo(traceLensRay(base, 0, .2).y)
    expect(traceLensRay(base, .02, .1).y).not.toBeCloseTo(traceLensRay(base, 0, .1).y)
  })
  it('同じ二か所への入射を保つと、物を近づけるほど出た束の収束が弱まる', () => {
    const differences = [.3, .2, .15, .1, .075].map(objectDistance => {
      const input = { ...base, objectDistance }
      const upperSlope = traceLensRay(input, .025, 1).y - .025
      const lowerSlope = traceLensRay(input, -.025, 1).y + .025
      return upperSlope - lowerSlope
    })
    for (let i = 1; i < differences.length; i++) expect(differences[i]).toBeGreaterThan(differences[i - 1])
    expect(differences[3]).toBeCloseTo(0)
    expect(differences[4]).toBeGreaterThan(0)
  })
  it('虚像を見る束の二本が目の入口へ届き、延長は像へ戻る', () => {
    const input = { ...base, objectDistance: .075 }
    const image = observeLens(input)
    for (const y of [-.039, -.031]) {
      const eye = { x: .4, y }
      const height = lensHeightToEye(input, eye)
      expect(traceLensRay(input, height, eye.x).y).toBeCloseTo(eye.y)
      expect(extendLensRay(input, height, image.imageDistance!).y).toBeCloseTo(image.imageHeight!)
    }
  })
  it.each([0, -.1, Infinity, NaN])('不正な距離 %s を拒む', d => {
    expect(() => observeLens({ ...base, objectDistance: d })).toThrow(RangeError)
    expect(() => observeLens({ ...base, focalLength: d })).toThrow(RangeError)
  })
})

describe('スクリーンの範囲と位置の刻み', () => {
  const place = (objectDistance: number) => nearestScreenPosition(observeLens({ ...base, objectDistance }), .05, .6, .0001)
  it('物12 cmの像を上限60 cmへ合わせられる', () => {
    expect(place(.12)).toBe(.6)
    const input = { ...base, objectDistance: .12 }
    expect(traceLensRay(input, .0025, .6).y).toBeCloseTo(traceLensRay(input, -.0025, .6).y, 12)
  })
  it('上限を実際に超える像と、虚像・無限遠の像には合わせない', () => {
    expect(place(.1199)).toBeNull()
    expect(place(.1)).toBeNull()
    expect(place(.075)).toBeNull()
  })
  it('物40 cmの像へは13.33 cmが最寄りで、理想的な交点との差を残す', () => {
    const input = { ...base, objectDistance: .4 }
    expect(place(.4)).toBeCloseTo(.1333, 12)
    expect(observeLens(input).imageDistance).toBeCloseTo(2 / 15, 12)
    const gap = Math.abs(traceLensRay(input, .0025, place(.4)!).y - traceLensRay(input, -.0025, place(.4)!).y)
    expect(gap).toBeCloseTo(.00000125, 12)
  })
  it('物15 cmの像は刻みに一致し、30 cmへ合わせられる', () => {
    expect(place(.15)).toBeCloseTo(.3, 12)
  })
})

describe('平面鏡の対称性と反射の法則', () => {
  it.each([-.16, -.12, 0, .08])('目を動かしても像は同じ: y=%s', eyeY => {
    const result = observeMirror({ x: -.25, y: .08 }, { x: -.34, y: eyeY })
    expect(result.image).toEqual({ x: .25, y: .08 })
    expect(result.incidenceAngle).toBeCloseTo(result.reflectionAngle)
    expect(result.reflection.x).toBe(0)
  })
  it('反射点から目への延長に像がある', () => {
    const object = { x: -.4, y: .08 }, eye = { x: -.34, y: -.16 }
    const { reflection, image } = observeMirror(object, eye)
    const slope = (eye.y - reflection.y) / eye.x
    expect(reflection.y + slope * image.x).toBeCloseTo(image.y)
  })
  it('鏡の法線に沿う入射では両角が0', () => {
    const result = observeMirror({ x: -.25, y: .08 }, { x: -.34, y: .08 })
    expect(result.incidenceAngle).toBe(0); expect(result.reflectionAngle).toBe(0)
  })
  it('点どうしの距離を保つ', () => {
    const eye = { x: -.34, y: -.12 }
    const p = { x: -.2, y: .1 }, q = { x: -.4, y: -.05 }
    const pi = observeMirror(p, eye).image, qi = observeMirror(q, eye).image
    expect(Math.hypot(pi.x - qi.x, pi.y - qi.y)).toBeCloseTo(Math.hypot(p.x - q.x, p.y - q.y))
  })
  it('鏡の奥や非有限の入力を拒む', () => {
    expect(() => observeMirror({ x: .1, y: 0 }, { x: -.2, y: 0 })).toThrow(RangeError)
    expect(() => observeMirror({ x: -.1, y: 0 }, { x: 0, y: 0 })).toThrow(RangeError)
    expect(() => observeMirror({ x: -.1, y: NaN }, { x: -.2, y: 0 })).toThrow(RangeError)
  })
})
