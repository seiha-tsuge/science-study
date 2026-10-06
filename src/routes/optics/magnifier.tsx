import { createFileRoute } from '@tanstack/react-router'
import LessonPage from '../../experiments/optics/magnifier/lesson-page'

export const Route = createFileRoute('/optics/magnifier')({ component: LessonPage })
