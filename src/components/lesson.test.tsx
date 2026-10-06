import { MantineProvider } from '@mantine/core'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import MotionLessonPage from '../experiments/mechanics/motion/lesson-page'
import AccelerationLessonPage from '../experiments/mechanics/acceleration/lesson-page'
import { motionLesson } from '../experiments/mechanics/motion/meta'
import { accelerationLesson } from '../experiments/mechanics/acceleration/meta'
import { opticsLessons } from '../app/optics-lessons'
import { allLessons } from '../app/lesson-catalog'
import HomePage from '../app/home-page'
import MechanicsPage from '../app/mechanics-page'
import OpticsPage from '../app/optics-page'

import WalkingRowPage from '../experiments/optics/walking-row/lesson-page'
import RefractionPage from '../experiments/optics/refraction/lesson-page'
import ApparentDepthPage from '../experiments/optics/apparent-depth/lesson-page'
import ReflectionPage from '../experiments/optics/reflection/lesson-page'
import MirrorImagePage from '../experiments/optics/mirror-image/lesson-page'
import MagnifierPage from '../experiments/optics/magnifier/lesson-page'
import PaperImagePage from '../experiments/optics/paper-image/lesson-page'

const opticsPages = [WalkingRowPage, RefractionPage, ApparentDepthPage, ReflectionPage, MirrorImagePage, MagnifierPage, PaperImagePage] as const

const lessonPages = [MotionLessonPage, AccelerationLessonPage, ...opticsPages] as const

// Navigation belongs to Router; the contract under test is initial lesson access.
vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, ...props }: { to: string; children: ReactNode }) => <a href={to} {...props}>{children}</a>,
}))

describe('全教材を回答入力なしで探索できる', () => {
  it.each([
    ['歩く人', MotionLessonPage, '歩く場面', '歩くペース'],
    ['発進する車', AccelerationLessonPage, '発進する車', '毎秒1.0 m/s'],
  ] as const)('%s：日常の対象から始め、同じ条件で説明へ進む', (_, Page, scene, control) => {
    const html = renderToStaticMarkup(<MantineProvider><Page /></MantineProvider>)
    expect(html).toContain(scene)
    expect(html).toContain(control)
    expect(html).not.toContain('class="motion-canvas"')
    expect(html).not.toContain('道の場所 [m]')
    expect(html).not.toContain('車の速度 [m/s]')
    expect(html).not.toMatch(/出発点も変える|出発時の速度と位置も変える|負の加速度は|二つを重ねる/)
  })
  it.each([
    [MotionLessonPage, motionLesson], [AccelerationLessonPage, accelerationLesson],
    ...opticsPages.map((Page, index) => [Page, opticsLessons[index].lesson] as const),
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
    [HomePage, [motionLesson, accelerationLesson, ...opticsLessons.map(item => item.lesson)]],
    [MechanicsPage, [motionLesson, accelerationLesson]],
    [OpticsPage, opticsLessons.map(item => item.lesson)],
  ] as const)('ホームと分野の案内でも、教材と同じゴールを表示する', (Page, lessons) => {
    const html = renderToStaticMarkup(<MantineProvider><Page /></MantineProvider>)
    for (const lesson of lessons) expect(html).toContain(lesson.learningGoal.understand)
  })
  it.each(lessonPages.map((Page, index) => [Page, allLessons[index].lesson] as const))('全教材は一つのゴールを同じ題材でたどり、次のリンクを一つ表示する', (Page, lesson) => {
    const html = renderToStaticMarkup(<MantineProvider><Page /></MantineProvider>)
    expect(html.match(/>今回理解すること</g)).toHaveLength(1)
    expect(html).toContain(lesson.learningGoal.understand)
    expect(html.indexOf('id="mechanism"')).toBeGreaterThan(html.indexOf('id="overview"'))
    expect(html.indexOf('id="details"')).toBeGreaterThan(html.indexOf('id="mechanism"'))
    expect(html).not.toContain('id="explore"')
    const footer = html.slice(html.indexOf('<footer'), html.indexOf('</footer>'))
    expect(footer.match(/href=/g)).toHaveLength(1)
    expect(html).not.toMatch(/prediction-|challenge-|locked-panel|位相|干渉|全反射|焦点F/)
    expect(html).toContain('参考資料：')
    expect(html).toContain('aria-expanded="false"')
  })
})
