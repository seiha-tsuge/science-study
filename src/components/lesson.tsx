import { Anchor, Badge, Breadcrumbs, Button, Group, Paper, Text, Title } from '@mantine/core'
import { useId, useState } from 'react'
import type { ReactElement, ReactNode } from 'react'
import { Link } from '@tanstack/react-router'

/** Shared lesson metadata keeps the goal and subject consistent across entrances. */
export interface LessonContent {
  title: string
  subtitle: string
  question: string
  startingPoint: { scene: string; focus: string }
  learningGoal: { understand: string; scope: string }
  overview: string
  connection: string
}

export default function Lesson({
  lesson,
  number,
  mechanism,
  explanation,
  next,
  subject = { title: '力学', to: '/mechanics', label: 'MECHANICS' },
  sources = [{
    title: 'OpenStax · Motion with Constant Acceleration',
    url: 'https://openstax.org/books/university-physics-volume-1/pages/3-4-motion-with-constant-acceleration',
  }],
  className = '',
}: {
  lesson: LessonContent
  number: string
  mechanism: ReactElement
  explanation: ReactNode
  next: ReactNode
  subject?: { title: string; to: '/mechanics' | '/optics'; label: string }
  sources?: readonly { title: string; url: string }[]
  className?: string
}) {
  const [showExplanation, setShowExplanation] = useState(false)
  const id = useId()
  const sections = [['overview', '今回の問い'], ['mechanism', '観察と操作、説明'], ['details', 'モデルと前提']] as const
  return (
    <article className={`lesson-page concept-lesson ${className}`}>
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
      <Paper component="section" withBorder p={{ base: 'md', sm: 'lg' }} id="overview">
        <Title order={2}>今回理解すること</Title>
        <Text fw={500} mt="sm">{lesson.learningGoal.understand}</Text>
        <Text mt="sm"><strong>身近な行為から考える。</strong>{lesson.startingPoint.scene} {lesson.overview}</Text>
        <Text size="sm" mt="sm">扱う範囲：{lesson.learningGoal.scope}</Text>
      </Paper>
      <section className="lesson-section" id="mechanism">
        <Group className="section-heading" gap="sm"><Badge variant="light">02</Badge><Title order={2}>{lesson.question}</Title></Group>
        <Text size="sm" mb="md">{lesson.startingPoint.focus}</Text>
        {mechanism}
      </section>
      <section className="lesson-section" id="details">
        <Group className="section-heading" gap="sm"><Badge variant="light">03</Badge><Title order={2}>モデルと前提</Title></Group>
        <Text>式の記号が図のどの量を指すかと、式が成り立つ条件を参照できます。</Text>
        <Button type="button" variant="default" aria-expanded={showExplanation} aria-controls={`${id}-explanation`} onClick={() => setShowExplanation(!showExplanation)}>
          {showExplanation ? '式と前提を閉じる −' : '式と前提を開く ＋'}
        </Button>
        {showExplanation && <Paper withBorder p={{ base: 'md', sm: 'lg' }} mt="lg" id={`${id}-explanation`} className="explanation">{explanation}</Paper>}
        <Text className="source">参考資料：{sources.map((source, index) => <span key={source.url}>{index > 0 && ' ／ '}<a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a></span>)}</Text>
      </section>
      <footer className="next-lesson">
        <div><span className="eyebrow">次へ進む</span><Text>{lesson.connection}</Text></div>
        {next}
      </footer>
    </article>
  )
}
