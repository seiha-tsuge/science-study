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
          <Text className="eyebrow">YOUR PERSONAL SCIENCE LAB</Text>
          <Title order={1}>
            問いからはじめる、
            <br />
            科学の実験室。
          </Title>
          <Text>
            予想して、動かして、自分の言葉で説明する。
            <br />
            ひとつずつ、現象と数式をつないでいこう。
          </Text>
          <Button component={Link} to="/mechanics/motion" size="lg" mt="lg">
            最初の実験をはじめる <span>↗</span>
          </Button>
          <span className="hero-caption">
            位置と速度 · 必要な数学：座標とグラフ
          </span>
        </div>
        <Paper
          withBorder
          p="lg"
          bg="blue.0"
          className="hero-diagram"
          aria-hidden="true"
        >
          <span className="diagram-label">POSITION / TIME</span>
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
          <span className="diagram-note">同じ時間、違う変化。</span>
        </Paper>
      </header>
      <section className="map-section">
        <div className="map-title">
          <div>
            <Text className="eyebrow">LEARNING MAP</Text>
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
              物体は、どう動く？
              <br />
              位置・速度・加速度をつなぐ。
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
              光は、どこへ進む？
              <br />
              反射・屈折・全反射を比べる。
            </Text>
            <span className="field-link">光学を探索する →</span>
          </Card>
          {[
            ['≈', '波', '重なり合うと、何が変わる？'],
            ['±', '電気', '離れたものに、力がはたらく？'],
            ['⌬', '化学', '物質の性質は、何で決まる？'],
            ['❋', '生物', '生命の変化を、どうとらえる？'],
            ['◎', '地学', '地球の変化を、どう読み解く？'],
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
        <Text className="eyebrow">最初の学習ルート</Text>
        <Title order={2}>「どこにいる？」から、「どう変わる？」へ。</Title>
        <SimpleGrid
          cols={{ base: 1, sm: 3 }}
          spacing="md"
          className="concept-nodes"
        >
          <Card component={Link} to="/mechanics/motion" withBorder padding="lg">
            <span>01</span>位置と速度<small>座標・単位・グラフの傾き</small>
          </Card>
          <Card
            component={Link}
            to="/mechanics/acceleration"
            withBorder
            padding="lg"
          >
            <span>02</span>加速度<small>変化率・二次関数</small>
          </Card>
          <Paper withBorder p="lg" className="future-node">
            <span>この先</span>力と運動<small>次に育てる問い</small>
          </Paper>
        </SimpleGrid>
      </section>
      <Alert
        color="teal"
        mt="xl"
        mb="lg"
        title="「正しかった」だけで終わらせない。"
      >
        <div>
          <Text>
            最初の予想、予想と違ったこと、まだ説明できないこと。学習メモは
            notes/journal/ に残して、理解が変わった道筋も育てていきます。
          </Text>
        </div>
      </Alert>
    </div>
  )
}
