import { createFileRoute } from '@tanstack/react-router'
import MotionLessonPage from '../experiments/mechanics/motion/LessonPage'

export const Route = createFileRoute('/mechanics/motion')({ component: MotionLessonPage })
