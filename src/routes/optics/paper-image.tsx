import { createFileRoute } from '@tanstack/react-router'
import LessonPage from '../../experiments/optics/paper-image/lesson-page'

export const Route = createFileRoute('/optics/paper-image')({ component: LessonPage })
