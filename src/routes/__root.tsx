import { createRootRoute } from '@tanstack/react-router'
import NotFound from '../components/NotFound'
import RootLayout from '../app/RootLayout'

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
})
