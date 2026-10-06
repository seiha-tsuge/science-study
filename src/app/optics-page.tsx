import { Anchor, Breadcrumbs, Card, Paper, Text, Title } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import { opticsLessons } from './optics-lessons'

export default function OpticsPage() {
  return <div className="mechanics-page">
    <Breadcrumbs className="breadcrumb"><Anchor component={Link} to="/">学習マップ</Anchor><Text size="sm">光学</Text></Breadcrumbs>
    <header className="page-heading"><Text className="eyebrow">身近な一つの問いから</Text><Title order={1}>光学</Title><Text>一つの日常の題材を、観察、操作、説明まで追います。最初は砂地へ歩く人の列で、片側が先に遅くなる関係を見ます。</Text></header>
    <Paper withBorder p="lg" mb="xl"><Title order={2}>小さな概念のつながり</Title><Text mt="sm">人の列の傾き → 水へ入る光の向き → ストローの見える場所。</Text><Text mt="sm">鏡で戻る光の向き → 鏡の向こうに見える葉の場所。</Text><Text mt="sm">水へ入る光の向き → 虫めがねで葉が大きく見える → 白い紙に文字を映す場所。</Text><Text size="sm" mt="sm">矢印は理解の手がかりとなる前提です。どのページからも自由に見られます。人の列は到着順と距離の差の比喩で、光の進む向きと同一ではありません。</Text></Paper>
    <section className="lesson-list"><Title order={2}>理解したい問いを選ぶ</Title>
      {opticsLessons.map(({ lesson, to, prerequisite }, index) => <Card key={to} component={Link} to={to} withBorder padding="lg" className="lesson-card">
        <span className="lesson-number">{String(index + 1).padStart(2, '0')}</span>
        <div><Title order={3}>{lesson.title}</Title><Text fw={600} size="sm" mt="sm">今回理解すること</Text><Text>{lesson.learningGoal.understand}</Text><span className="prerequisite">前提：{prerequisite}</span></div><span aria-hidden="true">→</span>
      </Card>)}
    </section>
  </div>
}
