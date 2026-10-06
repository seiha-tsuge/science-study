import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/optics/reflection-refraction')({
  beforeLoad: () => { throw redirect({ to: '/optics/refraction', replace: true }) },
})
