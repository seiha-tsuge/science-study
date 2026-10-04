import {
  Anchor,
  Badge,
  Box,
  Button,
  Container,
  Group,
  Text,
  ThemeIcon,
} from '@mantine/core'
import { Link, Outlet, useLocation } from '@tanstack/react-router'
import { useEffect } from 'react'

export default function RootLayout() {
  const pathname = useLocation({ select: (location) => location.pathname })
  useEffect(() => {
    const title = pathname.endsWith('/reflection-refraction')
      ? '光の反射と屈折'
      : pathname.startsWith('/optics')
        ? '光学'
        : pathname.endsWith('/motion')
          ? '位置と速度'
          : pathname.endsWith('/acceleration')
            ? '加速度'
            : pathname.startsWith('/mechanics')
              ? '力学'
              : '学習マップ'
    document.title = `${title} | 科学の実験室`
  }, [pathname])
  return (
    <>
      <Anchor className="skip-link" href="#main">
        本文へ移動
      </Anchor>
      <Box component="header" className="site-header">
        <Container size="lg" py="md">
          <Group justify="space-between" gap="md">
            <Anchor component={Link} to="/" c="dark" underline="never">
              <Group gap="sm" wrap="nowrap">
                <ThemeIcon
                  size={42}
                  radius="md"
                  variant="gradient"
                  aria-hidden="true"
                >
                  s.
                </ThemeIcon>
                <Box>
                  <Text fw={700}>科学の実験室</Text>
                  <Text size="xs" c="gray.7">
                    SCIENCE STUDY
                  </Text>
                </Box>
              </Group>
            </Anchor>
            <Group component="nav" aria-label="メインナビゲーション" gap="xs">
              {(
                [
                  ['/', '学習マップ'],
                  ['/mechanics', '力学'],
                  ['/optics', '光学'],
                ] as const
              ).map(([to, label]) => {
                const active =
                  to === '/' ? pathname === '/' : pathname.startsWith(to)
                return (
                  <Button
                    key={to}
                    component={Link}
                    to={to}
                    variant={active ? 'light' : 'subtle'}
                    aria-current={active ? 'page' : undefined}
                    size="sm"
                  >
                    {label}
                  </Button>
                )
              })}
            </Group>
            <Badge variant="outline" color="gray" visibleFrom="md">
              PERSONAL LAB
            </Badge>
          </Group>
        </Container>
      </Box>
      <Container component="main" id="main" size="lg" py="xl">
        <Outlet />
      </Container>
      <Container component="footer" size="lg" className="site-footer" py="xl">
        <Group justify="space-between" gap="md">
          <Box>
            <Text fw={600} size="sm">
              科学の実験室
            </Text>
            <Text c="gray.7" size="sm">
              問いを立てる。条件を変える。理由を説明する。
            </Text>
          </Box>
          <Anchor component={Link} to="/" size="sm">
            学びの地図に戻る ↑
          </Anchor>
        </Group>
      </Container>
    </>
  )
}
