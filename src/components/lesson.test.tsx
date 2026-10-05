import { MantineProvider } from '@mantine/core'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import MotionLessonPage from '../experiments/mechanics/motion/lesson-page'
import AccelerationLessonPage from '../experiments/mechanics/acceleration/lesson-page'
import OpticsLessonPage from '../experiments/optics/reflection-refraction/lesson-page'
import ImagesLessonPage from '../experiments/optics/lenses-mirrors/lesson-page'
import { motionLesson } from '../experiments/mechanics/motion/meta'
import { accelerationLesson } from '../experiments/mechanics/acceleration/meta'
import { opticsLesson } from '../experiments/optics/reflection-refraction/meta'
import { imagesLesson } from '../experiments/optics/lenses-mirrors/meta'
import HomePage from '../app/home-page'
import MechanicsPage from '../app/mechanics-page'
import OpticsPage from '../app/optics-page'

// Navigation belongs to Router; the contract under test is initial lesson access.
vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, ...props }: { to: string; children: ReactNode }) => <a href={to} {...props}>{children}</a>,
}))

describe('全教材を回答入力なしで探索できる', () => {
  it.each([
    ['位置と速度', MotionLessonPage, '同じ時間に、同じ変位', '速度'],
    ['加速度', AccelerationLessonPage, '二つを重ねる', '加速度'],
    ['光の反射と屈折', OpticsLessonPage, '見え方から、同じ下端の道筋へ', '入射角'],
    ['凸レンズの像と平面鏡の像', ImagesLessonPage, '文字を見るとき、目には何が届く？', '物からレンズの中心まで'],
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
    expect(html).toContain('身近な行為から考える')
    expect(html).toContain(mechanism)
    expect(html).toContain(control)
    expect(html).toContain('参考資料：')
    expect(html).toContain('aria-expanded="false"')
    expect(html).not.toMatch(/prediction-|challenge-|答えを確かめる|まず予想|自分の言葉で|再挑戦|locked-panel/)
  })
  it.each([
    [MotionLessonPage, motionLesson], [AccelerationLessonPage, accelerationLesson],
    [OpticsLessonPage, opticsLesson], [ImagesLessonPage, imagesLesson],
  ] as const)('最初に理解する関係を示し、行為・現象・範囲を仕組みより先に表示する', (Page, lesson) => {
    const html = renderToStaticMarkup(<MantineProvider><Page /></MantineProvider>)
    const goalHeading = html.indexOf('今回理解すること')
    const action = html.indexOf(lesson.startingPoint.scene)
    const happening = html.indexOf(lesson.overview)
    const understand = html.indexOf(lesson.learningGoal.understand)
    const scope = html.indexOf(lesson.learningGoal.scope)
    expect(goalHeading).toBeGreaterThan(-1)
    expect(understand).toBeGreaterThan(goalHeading)
    expect(action).toBeGreaterThan(understand)
    expect(happening).toBeGreaterThan(action)
    expect(scope).toBeGreaterThan(happening)
    expect(html.indexOf('id="mechanism"')).toBeGreaterThan(scope)
  })
  it.each([
    [HomePage, [motionLesson, accelerationLesson, opticsLesson, imagesLesson]],
    [MechanicsPage, [motionLesson, accelerationLesson]],
    [OpticsPage, [opticsLesson, imagesLesson]],
  ] as const)('ホームと分野の案内でも、教材と同じゴールを表示する', (Page, lessons) => {
    const html = renderToStaticMarkup(<MantineProvider><Page /></MantineProvider>)
    for (const lesson of lessons) expect(html).toContain(lesson.learningGoal.understand)
  })
  it('光学の入口は線や未説明語なしの水の比較で、類推は任意で開ける', () => {
    const html = renderToStaticMarkup(<MantineProvider><OpticsLessonPage /></MantineProvider>)
    const opening = html.slice(html.indexOf('id="overview"'), html.indexOf('id="mechanism"'))
    expect(opening).toContain('水を抜く')
    expect(opening).toContain('水を入れる')
    expect(opening).toContain('見え方の計算モデル')
    expect(opening).not.toMatch(/marker-end|stroke-dasharray="6 5"|波面|位相|法線|入射角|下端A/)
    expect(html).toContain('さらに知りたい：なぜ曲がる？ 人の列から波へ')
    expect(html).not.toContain('人の列が道から砂地へ進む模式図')
    expect(html).toContain('さらに知りたい：光では何が変わる？')
    expect(html).not.toContain('小さな＋の電気を帯びた粒を置いたとき')
  })
})
