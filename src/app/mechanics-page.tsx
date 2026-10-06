import { Anchor, Breadcrumbs, Card, Paper, Text, Title } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import { mechanicsLessons } from './lesson-catalog'

export default function MechanicsPage() {
  return <div className="mechanics-page">
    <Breadcrumbs className="breadcrumb"><Anchor component={Link} to="/">学習マップ</Anchor><Text size="sm">力学</Text></Breadcrumbs>
    <header className="page-heading"><Text className="eyebrow">日常の動きから一つの関係へ</Text><Title order={1}>力学</Title><Text>歩く人の同じ時間ごとの場所を見てから、発進する車の進む距離へ進みます。各ページでは一つの対象を、観察、操作、説明まで追います。</Text></header>
    <Paper withBorder p="lg" mb="xl"><Title order={2}>場所の変化から、距離の増え方へ</Title><Text mt="sm">歩く場所とグラフ → 発進した車が進む距離。最初のページで時刻と場所をグラフへ対応させ、その手がかりで車の速度と時間の面積をたどります。</Text><Text size="sm" mt="sm">前提は理解の手がかりです。どのページからも自由に見られます。</Text></Paper>
    <section className="lesson-list"><Title order={2}>理解したい問いを選ぶ</Title>
      {mechanicsLessons.map(({ lesson, to, prerequisite }, index) => <Card key={to} component={Link} to={to} withBorder padding="lg" className="lesson-card"><span className="lesson-number">{String(index + 1).padStart(2, '0')}</span><div><Title order={3}>{lesson.title}</Title><Text fw={600} size="sm" mt="sm">今回理解すること</Text><Text>{lesson.learningGoal.understand}</Text><span className="prerequisite">前提：{prerequisite}</span></div><span aria-hidden="true">→</span></Card>)}
    </section>
  </div>
}
