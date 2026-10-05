import { Button, Stack, Text, Title } from '@mantine/core'
import { Link } from '@tanstack/react-router'

export default function NotFound() {
  return (
    <Stack align="center" py={80} gap="lg">
      <Title order={1}>ページが見つかりません</Title>
      <Text c="gray.7">指定されたURLのページは存在しません。</Text>
      <Button component={Link} to="/">
        ホームに戻る
      </Button>
    </Stack>
  )
}
