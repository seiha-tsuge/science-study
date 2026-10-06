import { createFileRoute } from '@tanstack/react-router'
import AccelerationLessonPage from '../../experiments/mechanics/acceleration/lesson-page'

export const Route = createFileRoute('/mechanics/acceleration')({
  component: AccelerationLessonPage,
})
