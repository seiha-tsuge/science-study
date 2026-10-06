import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/optics/lenses-mirrors')({
  beforeLoad: () => { throw redirect({ to: '/optics/magnifier', replace: true }) },
})
