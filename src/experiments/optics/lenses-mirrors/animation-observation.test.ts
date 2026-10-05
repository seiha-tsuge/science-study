import { describe, expect, it } from 'vitest'
import { rayObservation } from './animation-observation'

describe('作図の説明と表示の同期', () => {
  it('0秒では光をまだ描いておらず、レンズ到達時もFに集まったとは説明しない', () => {
    expect(rayObservation('focus', 0)).toContain('まだ光の道筋は描いていません')
    expect(rayObservation('focus', .35)).toContain('Fへ向かって描く段階')
    expect(rayObservation('focus', .7)).toContain('Fまで届いた完成図')
  })
  it('延長を隠したまま最終段階へ移っても、破線を描いているとは説明しない', () => {
    for (const progress of [.7, .85, 1]) {
      const text = rayObservation('direct', progress, false)
      expect(text).toContain('逆向きの延長は非表示')
      expect(text).not.toContain('破線を逆向きに伸ばす')
    }
  })
  it('虚像の延長の途中と交点到達後を区別する', () => {
    expect(rayObservation('virtual', .85)).toContain('伸ばす段階')
    expect(rayObservation('virtual', .85)).not.toContain('交わった完成図')
    expect(rayObservation('virtual', 1)).toContain('交わった完成図')
  })
})
