import { createRootRoute } from '@tanstack/react-router'
import NotFound from '../components/not-found'
import RootLayout from '../app/root-layout'

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
})
