import { createFileRoute } from '@tanstack/react-router'
import OpticsLessonPage from '../../experiments/optics/reflection-refraction/lesson-page'

export const Route = createFileRoute('/optics/reflection-refraction')({ component: OpticsLessonPage })
