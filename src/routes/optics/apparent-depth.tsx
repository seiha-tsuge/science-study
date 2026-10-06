import { createFileRoute } from '@tanstack/react-router'
import LessonPage from '../../experiments/optics/apparent-depth/lesson-page'

export const Route = createFileRoute('/optics/apparent-depth')({ component: LessonPage })
