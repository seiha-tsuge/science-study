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
        <Text className="eyebrow">動きを見る</Text>
        <Title order={1}>力学</Title>
        <Text>
          歩く人は、1秒ごとにどれだけ進む？
          <br />
          道の上の場所と、時間ごとの変化をつなぎます。
        </Text>
      </header>
      <Paper
        component="section"
        withBorder
        p={{ base: 'lg', sm: 'xl' }}
        bg="blue.0"
        mb="xl"
      >
        <Title order={2}>どこにいる？ どれだけ進む？ 進み方はどう変わる？</Title>
        <Text>
          道の目印を0 mと決めると、人がその右にいるか左にいるかを数で表せます。これが「位置」です。1秒ごとの位置の変化を見ると、進む向きと速さを表す「速度」につながります。
        </Text>
        <Text mt="sm">速度が毎秒同じ量ずつ変わる場合もあります。この速度の変わる割合が「加速度」です。二つの教材で、位置・速度・加速度のつながりを図にします。</Text>
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
            <Text>なぜ一定の速度では、位置と時間のグラフが直線になる？</Text>
            <span className="prerequisite">
              道の目印と1秒ごとの動きを、グラフと対応させます。
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
            <Text>速度が毎秒同じ量ずつ増えると、進む量に二乗が現れるのはなぜ？</Text>
            <span className="prerequisite">
              速度が変わる様子から、時間の二乗の意味を見ます。
            </span>
          </div>
          <span aria-hidden="true">↗</span>
        </Card>
      </section>
      <section className="future-topics">
        <Title order={2}>この先で扱いたい問い</Title>
        <Text>投げた物の上下と左右の動き、ばねの往復、波が重なる現象、多数の不規則な動き。</Text>
        <Text className="small-note">
          現在は位置・速度・加速度の関係を扱っています。押す力が速度を変える仕組みや、上下と左右を合わせた動きは、今後のテーマです。
        </Text>
      </section>
    </div>
  )
}
