import { Anchor, Badge, Breadcrumbs, Button, Group, Paper, SimpleGrid, Text, Title } from '@mantine/core'
import { useId, useState } from 'react'
import type { ReactElement, ReactNode } from 'react'
import { Link } from '@tanstack/react-router'

/** Every lesson starts with a whole and relationships, before details or equations. */
export interface LessonContent {
  title: string
  subtitle: string
  question: string
  startingPoint: { scene: string; focus: string }
  learningGoal: { understand: string; scope: string }
  overview: string
  relationships: readonly { title: string; detail: string }[]
  observation: string
  connection: string
}

export default function Lesson({
  lesson,
  number,
  mechanism,
  simulation,
  explanation,
  next,
  subject = { title: '力学', to: '/mechanics', label: 'MECHANICS' },
  sources = [{
    title: 'OpenStax · Motion with Constant Acceleration',
    url: 'https://openstax.org/books/university-physics-volume-1/pages/3-4-motion-with-constant-acceleration',
  }],
  overviewVisual,
  opening,
  className = '',
}: {
  lesson: LessonContent
  number: string
  mechanism: ReactElement
  simulation: ReactNode
  explanation: ReactNode
  next: ReactNode
  subject?: { title: string; to: '/mechanics' | '/optics'; label: string }
  sources?: readonly { title: string; url: string }[]
  overviewVisual?: ReactNode
  opening?: ReactNode
  className?: string
}) {
  const [showExplanation, setShowExplanation] = useState(false)
  const id = useId()
  const sections = [
    ['overview', opening ? '見る・比べる' : '全体像'], ['mechanism', '仕組み'], ['explore', '条件を変える'], ['details', '式と前提'],
  ] as const
  return (
    <article className={`lesson-page ${className}`}>
      <Breadcrumbs className="breadcrumb">
        <Anchor component={Link} to="/">学習マップ</Anchor>
        <Anchor component={Link} to={subject.to}>{subject.title}</Anchor>
        <Text size="sm">{lesson.title}</Text>
      </Breadcrumbs>
      <header className="page-heading">
        <Text className="eyebrow">{subject.label} · EXPLORATION {number}</Text>
        <Title order={1}>{lesson.title}</Title>
        <Text>{lesson.subtitle}</Text>
      </header>
      <nav className="lesson-steps" aria-label="探索の入口">
        {sections.map(([anchor, name], i) => (
          <a key={anchor} href={`#${anchor}`}><span>{String(i + 1).padStart(2, '0')}</span>{name}</a>
        ))}
      </nav>
      <Paper component="section" withBorder p={{ base: 'md', sm: 'lg' }} bg={opening || overviewVisual ? undefined : 'blue.0'} id="overview">
        {opening ?? <>
        <Text className="eyebrow">01 全体から見る</Text>
        <Title order={2}>今回理解すること</Title>
        <Text fw={500} mt="sm">{lesson.learningGoal.understand}</Text>
        <div className={overviewVisual ? 'lesson-overview-visual' : undefined}>
          <div>
            <Paper p={overviewVisual ? 0 : 'md'} mt="md" className="starting-point">
              <Text><strong>身近な行為から考える。</strong>{lesson.startingPoint.scene}</Text>
            </Paper>
            <Text mt="md"><strong>そのとき起きていること。</strong>{lesson.overview}</Text>
            <Text size="sm" mt="sm">扱う範囲：{lesson.learningGoal.scope}</Text>
          </div>
          {overviewVisual}
        </div>
        <Title order={3} mt="lg">{lesson.question}</Title>
        <Text size="sm" mt="xs">{lesson.startingPoint.focus}</Text>
        <SimpleGrid cols={{ base: 1, sm: 3 }} mt="lg" spacing="sm" className="relationship-map">
          {lesson.relationships.map((relation, index) => (
            <Paper withBorder p="md" key={relation.title}>
              <Text size="xs" c="blue.7">{String(index + 1).padStart(2, '0')}</Text>
              <Title order={3}>{relation.title}</Title>
              <Text size="sm" mt="xs">{relation.detail}</Text>
            </Paper>
          ))}
        </SimpleGrid>
        </>}
      </Paper>
      <section className="lesson-section" id="mechanism">
        <Group className="section-heading" gap="sm"><Badge variant="light">02</Badge><Title order={2}>現象を生む仕組みを、図でたどる</Title></Group>
        {mechanism}
      </section>
      <section className="lesson-section" id="explore">
        <Group className="section-heading" gap="sm"><Badge variant="light">03</Badge><Title order={2}>条件を変えて、関係を見る</Title></Group>
        <Text>{lesson.observation}</Text>
        {simulation}
      </section>
      <section className="lesson-section" id="details">
        <Group className="section-heading" gap="sm"><Badge variant="light">04</Badge><Title order={2}>図の関係を式で表す</Title></Group>
        <Text>式の記号が図のどの量を指すかと、式が成り立つ条件を参照できます。</Text>
        <Button type="button" variant="default" aria-expanded={showExplanation} aria-controls={`${id}-explanation`} onClick={() => setShowExplanation(!showExplanation)}>
          {showExplanation ? '式と前提を閉じる −' : '式と前提を開く ＋'}
        </Button>
        {showExplanation && <Paper withBorder p={{ base: 'md', sm: 'lg' }} mt="lg" id={`${id}-explanation`} className="explanation">{explanation}</Paper>}
        <Text className="source">参考資料：{sources.map((source, index) => <span key={source.url}>{index > 0 && ' ／ '}<a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a></span>)}</Text>
      </section>
      <footer className="next-lesson">
        <div><span className="eyebrow">ほかの見方へつなぐ</span><Text>{lesson.connection}</Text></div>
        {next}
      </footer>
    </article>
  )
}
