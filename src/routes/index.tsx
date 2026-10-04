import { createFileRoute } from '@tanstack/react-router'
import HomePage from '../app/HomePage'

export const Route = createFileRoute('/')({
  component: HomePage,
})
