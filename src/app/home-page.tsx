import {
  Alert,
  Badge,
  Button,
  Card,
  Paper,
  SimpleGrid,
  Text,
  Title,
} from '@mantine/core'
import { Link } from '@tanstack/react-router'
import { allLessons } from './lesson-catalog'
import { RoadScene } from '../experiments/mechanics/shared/daily-motion'
import { observeMotion } from '../experiments/mechanics/motion/model'

export default function HomePage() {
  return (
    <div className="home-page">
      <header className="home-hero">
        <div>
          <Text className="eyebrow">図と操作でたどる科学</Text>
          <Title order={1}>
            「なぜ？」が見えてくる、
            <br />
            科学の実験室。
          </Title>
          <Text>
            歩く、本の文字を読む、水の中をのぞく。
            その行為の中で何が起きているか、図と操作でたどります。
          </Text>
          <Button component={Link} to="/mechanics/motion" size="lg" mt="lg">
            歩く場所を見てみる <span>↗</span>
          </Button>
          <span className="hero-caption">
            道の上の動きと、グラフを一緒に見る
          </span>
        </div>
        <Paper withBorder p="lg" className="hero-diagram">
          <span className="diagram-label">道を同じペースで歩く</span>
          <RoadScene subject="walker" time={4} marks={false} observe={time => observeMotion({ initialPosition: 0, velocity: 1 }, time)} />
          <span className="diagram-note">同じ人の場所を、時刻ごとの印へ渡します。</span>
        </Paper>
      </header>
      <section className="map-section">
        <Title order={2}>どの行為の、何を理解する？</Title>
        <Text mt="sm" mb="lg">一つの題材で、一つの関係をたどります。カードの前提を手がかりに、どのページからも自由に見られます。</Text>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          {allLessons.map(({ lesson, to, prerequisite }) => (
            <Card key={to} component={Link} to={to} withBorder padding="lg">
              <Title order={3}>{lesson.title}</Title>
              <Text fw={600} size="sm" mt="sm">今回理解すること</Text>
              <Text size="sm" mt="xs">{lesson.learningGoal.understand}</Text>
              <Text size="xs" mt="sm">前提：{prerequisite}</Text>
            </Card>
          ))}
        </SimpleGrid>
      </section>
      <section className="map-section">
        <div className="map-title">
          <div>
            <Text className="eyebrow">分野から選ぶ</Text>
            <Title order={2}>学びの地図</Title>
          </div>
          <span>「力学」と「光学」から探索できます。</span>
        </div>
        <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing="md">
          <Card
            component={Link}
            to="/mechanics"
            withBorder
            padding="lg"
            className="field-card available"
          >
            <span className="field-symbol" aria-hidden="true">
              ↗
            </span>
            <Badge variant="light" size="sm">
              2つの問い
            </Badge>
            <Title order={3}>力学</Title>
            <Text>
              同じ時間に、どれだけ進む？
              道の目印とグラフで、位置と速度をつなぎます。
            </Text>
            <span className="field-link">力学を探索する →</span>
          </Card>
          <Card
            component={Link}
            to="/optics"
            withBorder
            padding="lg"
            className="field-card available"
          >
            <span className="field-symbol" aria-hidden="true">
              ◇
            </span>
            <Badge variant="light" size="sm">
              7つの問い
            </Badge>
            <Title order={3}>光学</Title>
            <Text>
              水中のストロー、虫めがね、鏡の奥の像。
              光が曲がる理由から、像が見える場所へつなぎます。
            </Text>
            <span className="field-link">光学を探索する →</span>
          </Card>
          {[
            ['≈', '波', 'なぜ、波の重なり方で強さが変わる？'],
            ['±', '電気', 'なぜ、触れずに力がはたらく？'],
            ['⌬', '化学', '物質の性質は、何で決まる？'],
            ['❋', '生物', '細胞の働きは、体全体の働きにどうつながる？'],
            ['◎', '地学', 'なぜ、大地や気候は変わり続ける？'],
          ].map(([symbol, title, question]) => (
            <Card
              withBorder
              padding="lg"
              className="field-card planned"
              key={title}
            >
              <span className="field-symbol" aria-hidden="true">
                {symbol}
              </span>
              <Badge variant="light" size="sm">
                今後のテーマ
              </Badge>
              <Title order={3}>{title}</Title>
              <Text>{question}</Text>
            </Card>
          ))}
        </SimpleGrid>
      </section>
      <section className="concept-route">
        <Text className="eyebrow">概念のつながり</Text>
        <Title order={2}>場所の変化から、進み方の変化へ</Title>
        <SimpleGrid
          cols={{ base: 1, sm: 3 }}
          spacing="md"
          className="concept-nodes"
        >
          <Card component={Link} to="/mechanics/motion" withBorder padding="lg">
            <span>01</span>歩く場所とグラフ<small>道の上の動きとグラフをつなぐ</small>
          </Card>
          <Card
            component={Link}
            to="/mechanics/acceleration"
            withBorder
            padding="lg"
          >
            <span>02</span>発進した車が進む距離<small>止まった車の距離に、時間の二乗が現れる理由</small>
          </Card>
          <Paper withBorder p="lg" className="future-node">
            <span>この先</span>力と運動<small>押す力と速度の変化をつなぐ</small>
          </Paper>
        </SimpleGrid>
      </section>
      <Alert
        color="teal"
        mt="xl"
        mb="lg"
        title="場面と条件を、自分のペースで変えられます"
      >
        <div>
          <Text>
            各教材には、現象の入口、仕組みの図、条件を変える操作があります。動く図は途中で止められます。式やモデルの前提は「式と前提を開く」から参照できます。
          </Text>
        </div>
      </Alert>
    </div>
  )
}
