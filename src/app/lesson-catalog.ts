import { motionLesson } from '../experiments/mechanics/motion/meta'
import { accelerationLesson } from '../experiments/mechanics/acceleration/meta'
import { opticsLessons } from './optics-lessons'

export const mechanicsLessons = [
  { lesson: motionLesson, to: '/mechanics/motion', prerequisite: 'なし' },
  { lesson: accelerationLesson, to: '/mechanics/acceleration', prerequisite: '歩く場所とグラフ' },
] as const

export const allLessons = [...mechanicsLessons, ...opticsLessons] as const
