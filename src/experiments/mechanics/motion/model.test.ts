import { describe, expect, it } from 'vitest'
import { observeMotion } from './model'

describe('等速運動の科学的な性質', () => {
  it('t=0で指定した初期位置・速度になる', () => {
    expect(observeMotion({ initialPosition: 10, velocity: -3 }, 0)).toEqual({
      position: 10,
      velocity: -3,
      acceleration: 0,
    })
  })
  it('負の速度で左へ進む（再挑戦の既知の解）', () => {
    expect(observeMotion({ initialPosition: 10, velocity: -3 }, 4).position).toBe(-2)
  })
  it('速度を2倍にすると変位が2倍になる。初期位置を2倍にはしない', () => {
    const single = observeMotion({ initialPosition: 12, velocity: 5 }, 3)
    const double = observeMotion({ initialPosition: 12, velocity: 10 }, 3)
    expect(double.position - 12).toBe(2 * (single.position - 12))
  })
  it('等しい時間間隔で変位が等しく、グラフの傾きが速度になる', () => {
    const position = (time: number) =>
      observeMotion({ initialPosition: -10, velocity: 4 }, time).position
    expect(position(3) - position(2)).toBe(position(2) - position(1))
    expect((position(7) - position(2)) / 5).toBe(4)
  })
  it('速度0なら任意の時刻に同じ位置に留まる', () => {
    expect(observeMotion({ initialPosition: 7, velocity: 0 }, 10).position).toBe(7)
  })
})
