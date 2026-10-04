import { describe, expect, it } from 'vitest'
import { advanceTime } from './clock'

describe('描画と物理時刻の分離', () => {
  it.each([30, 60, 120, 144])('%i Hzでも実時間1秒を1秒として進める', (rate) => {
    let time = 0
    for (let i = 0; i < rate; i++) time = advanceTime(time, 1000 / rate)
    expect(time).toBeCloseTo(1, 10)
  })
  it('終了時刻で止まり、負の経過時間では逆行しない', () => {
    expect(advanceTime(9.9, 200)).toBe(10)
    expect(advanceTime(2, -100)).toBe(2)
  })
})
