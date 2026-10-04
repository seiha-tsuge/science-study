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

export default function MechanicsPage() {
  return (
    <div className="mechanics-page">
      <Breadcrumbs className="breadcrumb">
        <Anchor component={Link} to="/">
          学習マップ
        </Anchor>
        <Text size="sm">力学</Text>
      </Breadcrumbs>
      <header className="page-heading">
        <Text className="eyebrow">EXPLORE · MECHANICS</Text>
        <Title order={1}>力学</Title>
        <Text>
          位置が変わる。速度が変わる。
          <br />
          身近な「動き」を、図・グラフ・言葉でとらえよう。
        </Text>
      </header>
      <Paper
        component="section"
        withBorder
        p={{ base: 'lg', sm: 'xl' }}
        bg="blue.0"
        mb="xl"
      >
        <Title order={2}>まずは、動きを説明するところから。</Title>
        <Text>
          力学は物体の運動や、力との関係を扱う分野です。最初の2題では、なぜ力がはたらくかを考える前に、位置・速度・加速度を使って「どのように動くか」を記述します。
        </Text>
        <div className="concept-tags">
          <Badge variant="light">位置 [m]</Badge>
          <Badge variant="light">速度 [m/s]</Badge>
          <Badge variant="light">加速度 [m/s²]</Badge>
        </div>
      </Paper>
      <section className="lesson-list">
        <Title order={2}>問いを選ぶ</Title>
        <Card
          component={Link}
          to="/mechanics/motion"
          withBorder
          padding="lg"
          className="lesson-card"
        >
          <span className="lesson-number">01</span>
          <div>
            <span className="eyebrow">等速運動</span>
            <Title order={3}>位置と速度</Title>
            <Text>同じ速度で進み続けると、位置のグラフはどうなる？</Text>
            <span className="prerequisite">
              必要な知識：座標、秒とメートル、グラフの読み方
            </span>
          </div>
          <span aria-hidden="true">↗</span>
        </Card>
        <Card
          component={Link}
          to="/mechanics/acceleration"
          withBorder
          padding="lg"
          className="lesson-card"
        >
          <span className="lesson-number">02</span>
          <div>
            <span className="eyebrow">等加速度運動</span>
            <Title order={3}>加速度</Title>
            <Text>速度が一定の割合で変わると、進む距離はどう変わる？</Text>
            <span className="prerequisite">
              前のテーマ：位置と速度 ／ 数学：変化率、二次関数
            </span>
          </div>
          <span aria-hidden="true">↗</span>
        </Card>
      </section>
      <section className="future-topics">
        <Title order={2}>この先で扱いたい問い</Title>
        <Text>放物運動 → ばねの振動 → 波と重ね合わせ → ランダムウォーク</Text>
        <Text className="small-note">
          まず2題を学んで、必要になった実験から追加します。学ぶ範囲と数学は
          docs/learning-map.md でもたどれます。
        </Text>
      </section>
    </div>
  )
}
