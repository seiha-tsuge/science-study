import { createFileRoute } from '@tanstack/react-router'
import MechanicsPage from '../app/MechanicsPage'

export const Route = createFileRoute('/mechanics/')({ component: MechanicsPage })
