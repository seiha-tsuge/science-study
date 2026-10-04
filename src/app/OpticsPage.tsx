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
        <Text className="eyebrow">EXPLORE · OPTICS</Text>
        <Title order={1}>光学</Title>
        <Text>
          鏡に映る。水の中がずれて見える。
          <br />
          身近な見え方を、光の道筋から考えよう。
        </Text>
      </header>
      <Paper
        component="section"
        withBorder
        p={{ base: 'lg', sm: 'xl' }}
        bg="blue.0"
        mb="xl"
      >
        <Title order={2}>光は、境界でどこへ進む？</Title>
        <Text>
          まずは光を線として描き、跳ね返る向きと、別の物質へ進む向きを比べます。波としての干渉や回折は、今後のテーマです。
        </Text>
        <div className="concept-tags">
          <Badge variant="light">法線からの角度 [°]</Badge>
          <Badge variant="light">屈折率 [単位なし]</Badge>
          <Badge variant="light">光の速さ [m/s]</Badge>
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
            <Text>境界に斜めに入った光は、どの向きへ進む？</Text>
            <span className="prerequisite">
              必要な知識：角度、垂直な線 ／ 数式の確認：比、sin、逆三角関数
            </span>
          </div>
          <span aria-hidden="true">↗</span>
        </Card>
      </section>
    </div>
  )
}
