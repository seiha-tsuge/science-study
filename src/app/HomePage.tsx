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
            歩く人の動き、水の中のストローの見え方。
            <br />
            図を動かして、現象を生む関係をたどります。
          </Text>
          <Button component={Link} to="/mechanics/motion" size="lg" mt="lg">
            位置と速度を見てみる <span>↗</span>
          </Button>
          <span className="hero-caption">
            道の上の動きと、グラフを一緒に見る
          </span>
        </div>
        <Paper
          withBorder
          p="lg"
          bg="blue.0"
          className="hero-diagram"
          role="img"
          aria-label="横軸が時間、縦軸が位置の模式図。実線は一定の増え方、破線は増え方が変わる例。実測値ではありません。"
        >
          <span className="diagram-label">時間と位置のグラフ</span>
          <svg viewBox="0 0 320 260">
            <defs>
              <pattern
                id="hero-grid"
                width="32"
                height="32"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 32 0 L 0 0 0 32"
                  fill="none"
                  stroke="#dbe6f4"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="320" height="260" fill="url(#hero-grid)" />
            <path d="M32 218 H300 M32 218 V20" stroke="#93a8c4" fill="none" />
            <path
              d="M32 218 L275 42"
              stroke="#2563eb"
              strokeWidth="3"
              fill="none"
            />
            <path
              d="M32 218 Q186 216 275 42"
              stroke="#7d98bc"
              strokeWidth="2"
              strokeDasharray="5 5"
              fill="none"
            />
            <circle cx="180" cy="111" r="8" fill="#2563eb" />
            <text x="288" y="238">
              t
            </text>
            <text x="13" y="22">
              x
            </text>
          </svg>
          <span className="diagram-note">横は時間、縦は位置。直線と曲線で増え方を比べます。</span>
        </Paper>
      </header>
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
              2つの実験
            </Badge>
            <Title order={3}>力学</Title>
            <Text>
              同じ時間に、どれだけ進む？
              <br />
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
              1つの実験
            </Badge>
            <Title order={3}>光学</Title>
            <Text>
              水の中のものは、なぜずれて見える？
              <br />
              砂地に入る人の列から、光が曲がる理由をたどります。
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
            <span>01</span>位置と速度<small>道の上の動きとグラフをつなぐ</small>
          </Card>
          <Card
            component={Link}
            to="/mechanics/acceleration"
            withBorder
            padding="lg"
          >
            <span>02</span>加速度<small>速度が変わると、進む量はどう変わる？</small>
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
