import { createFileRoute } from '@tanstack/react-router'
import LessonPage from '../../experiments/optics/mirror-image/lesson-page'

export const Route = createFileRoute('/optics/mirror-image')({ component: LessonPage })
