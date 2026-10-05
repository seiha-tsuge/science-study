import { createFileRoute } from '@tanstack/react-router'
import MotionLessonPage from '../../experiments/mechanics/motion/lesson-page'

export const Route = createFileRoute('/mechanics/motion')({ component: MotionLessonPage })
