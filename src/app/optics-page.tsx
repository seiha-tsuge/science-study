import {
  Anchor,
  Badge,
  Breadcrumbs,
  Card,
  Paper,
  Text,
  Title,
} from '@mantine/core'
import { Link } from '@tanstack/react-router'
import { opticsLesson } from '../experiments/optics/reflection-refraction/meta'
import { imagesLesson } from '../experiments/optics/lenses-mirrors/meta'

export default function OpticsPage() {
  return (
    <div className="mechanics-page">
      <Breadcrumbs className="breadcrumb">
        <Anchor component={Link} to="/">
          学習マップ
        </Anchor>
        <Text size="sm">光学</Text>
      </Breadcrumbs>
      <header className="page-heading">
        <Text className="eyebrow">光の道筋を見る</Text>
        <Title order={1}>光学</Title>
        <Text>
          鏡に映るものや、水の中でずれて見えるものから、物から目へ届く光がどこで向きを変えるかをたどります。
        </Text>
      </header>
      <Paper
        component="section"
        withBorder
        p={{ base: 'lg', sm: 'xl' }}
        bg="blue.0"
        mb="xl"
      >
        <Title order={2}>水の中のものが、ずれて見えるのはなぜ？</Title>
        <Text>
          水中のストローから目へ届く光は、水面で進む向きを変えます。目へ入る向きをまっすぐにたどると、ストローの実際の場所とはずれます。
        </Text>
        <Text mt="sm">光が曲がる理由は、砂地に入る人の列を手がかりに見ます。片側が遅れると列が傾く関係を光の図へ引き継ぎ、最後にストローの光の道筋へ戻ります。</Text>
        <div className="concept-tags">
          <Badge variant="light">先に届く側</Badge>
          <Badge variant="light">列の傾きと光の向き</Badge>
          <Badge variant="light">水面で変わる向き</Badge>
        </div>
      </Paper>
      <section className="lesson-list">
        <Title order={2}>理解したい関係を選ぶ</Title>
        <Card
          component={Link}
          to="/optics/reflection-refraction"
          withBorder
          padding="lg"
          className="lesson-card"
        >
          <span className="lesson-number">03</span>
          <div>
            <span className="eyebrow">反射・屈折・全反射</span>
            <Title order={3}>光の反射と屈折</Title>
            <Text fw={600} size="sm" mt="sm">今回理解すること</Text>
            <Text>{opticsLesson.learningGoal.understand}</Text>
            <span className="prerequisite">
              ストロー、人の列、光の図をたどる四場面。電場や干渉は任意で開けます。
            </span>
          </div>
          <span aria-hidden="true">↗</span>
        </Card>
        <Card component={Link} to="/optics/lenses-mirrors" withBorder padding="lg" className="lesson-card">
          <span className="lesson-number">04</span>
          <div>
            <span className="eyebrow">凸レンズ・実像・虚像・平面鏡</span>
            <Title order={3}>凸レンズの像と平面鏡の像</Title>
            <Text fw={600} size="sm" mt="sm">今回理解すること</Text>
            <Text>{imagesLesson.learningGoal.understand}</Text>
            <span className="prerequisite">同じ葉を虫めがねや鏡で見る場面から、道具の面と目へ届く光をたどります。</span>
          </div>
          <span aria-hidden="true">↗</span>
        </Card>
      </section>
      <Paper withBorder p="lg" mt="xl">
        <Title order={2}>光の向きから、像の場所へ</Title>
        <Text mt="sm">水面やレンズで光が曲がる理由を見たら、その光が目へどう届くかをたどれます。レンズでは実際に集まる場所、鏡では反射した光の延長が交わる場所が、物の各点の像になります。像の教材から直接始めても、図の中で必要な目印と名前を見られます。</Text>
      </Paper>
    </div>
  )
}
