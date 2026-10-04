import { createFileRoute } from '@tanstack/react-router'
import OpticsLessonPage from '../experiments/optics/reflection-refraction/LessonPage'

export const Route = createFileRoute('/optics/reflection-refraction')({ component: OpticsLessonPage })
