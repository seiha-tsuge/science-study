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
          鏡に映る。水の中がずれて見える。
          <br />
          物から目へ届く光が、どこで向きを変えるかをたどります。
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
        <Title order={2}>問いを選ぶ</Title>
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
            <Text>水面へ斜めに届く光は、速さが変わると、なぜ向きも変わる？</Text>
            <span className="prerequisite">
              ストロー、人の列、光の図をたどる四場面。電場や干渉は任意で開けます。
            </span>
          </div>
          <span aria-hidden="true">↗</span>
        </Card>
      </section>
    </div>
  )
}
