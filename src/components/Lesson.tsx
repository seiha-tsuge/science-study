import {
  Alert,
  Anchor,
  Badge,
  Breadcrumbs,
  Button,
  Checkbox,
  Group,
  Paper,
  Radio,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'

interface LessonContent {
  title: string
  subtitle: string
  question: string
  predictionQuestion: string
  predictions: readonly string[]
  observation: string
  reflection: string
  challenge: string
  challengeOptions: readonly string[]
  challengeAnswer: string
  challengeExplanation: string
  journalPath: string
}

export default function Lesson({
  lesson,
  number,
  simulation,
  explanation,
  next,
  subject = { title: '力学', to: '/mechanics', label: 'MECHANICS' },
  sources = [
    {
      title: 'OpenStax · Motion with Constant Acceleration',
      url: 'https://openstax.org/books/university-physics-volume-1/pages/3-4-motion-with-constant-acceleration',
    },
  ],
}: {
  lesson: LessonContent
  number: string
  simulation: ReactNode
  explanation: ReactNode
  next: ReactNode
  subject?: { title: string; to: '/mechanics' | '/optics'; label: string }
  sources?: readonly { title: string; url: string }[]
}) {
  const [prediction, setPrediction] = useState('')
  const [committedPrediction, setCommittedPrediction] = useState('')
  const [showExplanation, setShowExplanation] = useState(false)
  const [answer, setAnswer] = useState('')
  const [checkedAnswer, setCheckedAnswer] = useState('')
  const [explained, setExplained] = useState(false)
  return (
    <article className="lesson-page">
      <Breadcrumbs className="breadcrumb">
        <Anchor component={Link} to="/">
          学習マップ
        </Anchor>
        <Anchor component={Link} to={subject.to}>
          {subject.title}
        </Anchor>
        <Text size="sm">{lesson.title}</Text>
      </Breadcrumbs>
      <header className="page-heading">
        <Text className="eyebrow">
          {subject.label} · LESSON {number}
        </Text>
        <Title order={1}>{lesson.title}</Title>
        <Text>{lesson.subtitle}</Text>
      </header>
      <nav className="lesson-steps" aria-label="学習の流れ">
        {['問い', '予想', '実験', '数式', '説明', '再挑戦'].map((name, i) => (
          <a key={name} href={`#step-${i + 1}`}>
            <span>{String(i + 1).padStart(2, '0')}</span>
            {name}
          </a>
        ))}
      </nav>
      <Paper component="section" withBorder p="xl" bg="blue.0" id="step-1">
        <Text className="eyebrow">01 — 今日の問い</Text>
        <Title order={2}>{lesson.question}</Title>
        <Text>操作する前に予想して、図や数値を照らし合わせよう。</Text>
      </Paper>
      <section className="lesson-section" id="step-2">
        <Group className="section-heading" gap="sm">
          <Badge variant="light">02</Badge>
          <Title order={2}>まず、予想する</Title>
        </Group>
        <Text>
          正解でなくても大丈夫です。理由も、声に出すか Markdown
          の学習メモに残してください。
        </Text>
        <Radio.Group
          label={lesson.predictionQuestion}
          value={prediction}
          onChange={setPrediction}
          name={`prediction-${number}`}
          my="lg"
        >
          <Stack gap="sm" mt="sm">
            {lesson.predictions.map((option) => (
              <Radio
                key={option}
                value={option}
                label={option}
                disabled={Boolean(committedPrediction)}
              />
            ))}
          </Stack>
        </Radio.Group>
        {!committedPrediction ? (
          <Button
            type="button"
            disabled={!prediction}
            onClick={() => setCommittedPrediction(prediction)}
          >
            この予想で実験する →
          </Button>
        ) : (
          <Text className="prediction-receipt" role="status">
            あなたの予想：{committedPrediction}{' '}
            <small>実験後に比べてみましょう。</small>
          </Text>
        )}
        <Text className="small-note">
          選択はこのページを開いている間だけ保持します。記録を残すときは{' '}
          {lesson.journalPath} を使います。
        </Text>
      </section>
      <section className="lesson-section" id="step-3">
        <Group className="section-heading" gap="sm">
          <Badge variant="light">03</Badge>
          <Title order={2}>動かして、観察する</Title>
        </Group>
        <Text>{lesson.observation}</Text>
        {committedPrediction ? (
          simulation
        ) : (
          <div className="locked-panel">
            <span aria-hidden="true">◇</span>
            <Text>まず予想を選ぶと、実験を始められます。</Text>
            <a href="#step-2">予想へ戻る ↑</a>
          </div>
        )}
      </section>
      <section className="lesson-section" id="step-4">
        <Group className="section-heading" gap="sm">
          <Badge variant="light">04</Badge>
          <Title order={2}>数式と照らし合わせる</Title>
        </Group>
        <Text>
          観察した結果と、式の意味・モデルの前提を照らし合わせましょう。
        </Text>
        <Button
          type="button"
          variant="default"
          disabled={!committedPrediction}
          aria-expanded={showExplanation}
          aria-controls={`explanation-${number}`}
          onClick={() => setShowExplanation(!showExplanation)}
        >
          {showExplanation ? '解説を閉じる −' : '式と解説を開く ＋'}
        </Button>
        {showExplanation && (
          <Paper
            withBorder
            p={{ base: 'md', sm: 'xl' }}
            mt="lg"
            id={`explanation-${number}`}
            className="explanation"
          >
            {explanation}
            <Text className="source">
              参考資料：
              {sources.map((source, index) => (
                <span key={source.url}>
                  {index > 0 && ' ／ '}
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.title} ↗
                  </a>
                </span>
              ))}
            </Text>
          </Paper>
        )}
      </section>
      <section className="lesson-section" id="step-5">
        <Group className="section-heading" gap="sm">
          <Badge variant="light">05</Badge>
          <Title order={2}>自分の言葉で、説明する</Title>
        </Group>
        <Text>{lesson.reflection}</Text>
        <Paper withBorder p="lg" bg="teal.0">
          <Title order={3}>解説を閉じて、思い出してみる</Title>
          <Text>
            「予想は……。観察したのは……。理由は……。」の順に話してみましょう。分からない点も、そのまま残します。
          </Text>
          <Checkbox
            mt="lg"
            label="解説を閉じて、自分の言葉で説明した"
            checked={explained}
            disabled={!committedPrediction}
            onChange={(event) => {
              setExplained(event.currentTarget.checked)
              if (event.currentTarget.checked) setShowExplanation(false)
            }}
          />
          <Text className="small-note">
            記録先：notes/journal/。予想・条件・観察・理解の変化・残った問いを
            Markdown で残せます。
          </Text>
        </Paper>
      </section>
      <section className="lesson-section" id="step-6">
        <Group className="section-heading" gap="sm">
          <Badge variant="light">06</Badge>
          <Title order={2}>別の条件で、再挑戦</Title>
        </Group>
        <Text>
          解説を見ずに予想してから、実験の条件を変えて確かめましょう。
        </Text>
        <Radio.Group
          label={lesson.challenge}
          name={`challenge-${number}`}
          value={answer}
          onChange={(value) => {
            setAnswer(value)
            setCheckedAnswer('')
          }}
          my="lg"
        >
          <Stack gap="sm" mt="sm">
            {lesson.challengeOptions.map((option) => (
              <Radio
                key={option}
                value={option}
                label={option}
                disabled={!explained}
              />
            ))}
          </Stack>
        </Radio.Group>
        {!explained && (
          <Text className="small-note">
            自分の言葉で説明できたら、上のチェックを入れて再挑戦へ。
          </Text>
        )}
        <Button
          type="button"
          variant="default"
          disabled={!answer || !explained}
          onClick={() => setCheckedAnswer(answer)}
        >
          答えを確かめる
        </Button>
        {checkedAnswer && explained && (
          <Alert
            mt="lg"
            color={checkedAnswer === lesson.challengeAnswer ? 'teal' : 'orange'}
            role="status"
          >
            <strong>
              {checkedAnswer === lesson.challengeAnswer
                ? '予想と式がつながりました。'
                : '条件と単位を、もう一度確かめよう。'}
            </strong>
            <Text>{lesson.challengeExplanation}</Text>
            <Text>実験で同じ条件を設定して、数値も確認してみましょう。</Text>
          </Alert>
        )}
      </section>
      <footer className="next-lesson">
        <div>
          <span className="eyebrow">学びをつなぐ</span>
          <Text>今回の問いから、次の問いへ。</Text>
        </div>
        {next}
      </footer>
    </article>
  )
}
