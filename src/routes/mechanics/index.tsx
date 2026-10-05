import { createFileRoute } from '@tanstack/react-router'
import MechanicsPage from '../../app/mechanics-page'

export const Route = createFileRoute('/mechanics/')({ component: MechanicsPage })
