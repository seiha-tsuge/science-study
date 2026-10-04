import { MantineProvider } from '@mantine/core'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import MotionLessonPage from '../experiments/mechanics/motion/LessonPage'
import AccelerationLessonPage from '../experiments/mechanics/acceleration/LessonPage'
import OpticsLessonPage from '../experiments/optics/reflection-refraction/LessonPage'

// Navigation belongs to Router; the contract under test is initial lesson access.
vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, ...props }: { to: string; children: ReactNode }) => <a href={to} {...props}>{children}</a>,
}))

describe('全教材を回答入力なしで探索できる', () => {
  it.each([
    ['位置と速度', MotionLessonPage, '同じ時間に、同じ変位', '速度'],
    ['加速度', AccelerationLessonPage, '二つを重ねる', '加速度'],
    ['光の反射と屈折', OpticsLessonPage, 'ストローはまっすぐでも、見える位置はずれる', '入射角'],
  ] as const)('%s：全体像、仕組み、操作、資料を最初から表示する', (_, Page, mechanism, control) => {
    const html = renderToStaticMarkup(<MantineProvider><Page /></MantineProvider>)
    const overview = html.indexOf('id="overview"')
    const why = html.indexOf('id="mechanism"')
    const exploration = html.indexOf('id="explore"')
    const details = html.indexOf('id="details"')
    expect(overview).toBeGreaterThan(-1)
    expect(why).toBeGreaterThan(overview)
    expect(exploration).toBeGreaterThan(why)
    expect(details).toBeGreaterThan(exploration)
    expect(html).toContain('身近な入口')
    expect(html).toContain(mechanism)
    expect(html).toContain(control)
    expect(html).toContain('参考資料：')
    expect(html).toContain('aria-expanded="false"')
    expect(html).not.toMatch(/prediction-|challenge-|答えを確かめる|まず予想|自分の言葉で|再挑戦|locked-panel/)
  })
  it('光学の本筋はストローから始まり、電場や位相の図は任意で開ける', () => {
    const html = renderToStaticMarkup(<MantineProvider><OpticsLessonPage /></MantineProvider>)
    expect(html).toContain('人の列で見る')
    expect(html).toContain('光の図へ移る')
    expect(html).toContain('ストローへ戻る')
    expect(html).toContain('さらに知りたい：光では何が変わる？')
    expect(html).not.toContain('小さな＋の電気を帯びた粒を置いたとき')
  })
})
