import { createFileRoute } from '@tanstack/react-router'
import LessonPage from '../../experiments/optics/refraction/lesson-page'

export const Route = createFileRoute('/optics/refraction')({ component: LessonPage })
