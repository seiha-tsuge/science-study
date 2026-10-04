import { createFileRoute } from '@tanstack/react-router'
import AccelerationLessonPage from '../experiments/mechanics/acceleration/LessonPage'

export const Route = createFileRoute('/mechanics/acceleration')({
  component: AccelerationLessonPage,
})
