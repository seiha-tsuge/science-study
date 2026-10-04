import { Link } from '@tanstack/react-router'

export default function HomePage() {
  return (
    <div className="home-page">
      <header className="home-hero">
        <div>
          <p className="eyebrow">YOUR PERSONAL SCIENCE LAB</p>
          <h1>
            問いからはじめる、
            <br />
            科学の実験室。
          </h1>
          <p>
            予想して、動かして、自分の言葉で説明する。
            <br />
            ひとつずつ、現象と数式をつないでいこう。
          </p>
          <Link to="/mechanics/motion" className="primary-button">
            最初の実験をはじめる <span>↗</span>
          </Link>
          <span className="hero-caption">位置と速度 · 必要な数学：座標とグラフ</span>
        </div>
        <div className="hero-diagram" aria-hidden="true">
          <span className="diagram-label">POSITION / TIME</span>
          <svg viewBox="0 0 320 260">
            <defs>
              <pattern id="hero-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#dbe6f4" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="320" height="260" fill="url(#hero-grid)" />
            <path d="M32 218 H300 M32 218 V20" stroke="#93a8c4" fill="none" />
            <path d="M32 218 L275 42" stroke="#2563eb" strokeWidth="3" fill="none" />
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
        </div>
      </header>
      <section className="map-section">
        <div className="map-title">
          <div>
            <p className="eyebrow">LEARNING MAP</p>
            <h2>学びの地図</h2>
          </div>
          <span>今は「力学」から探索できます。</span>
        </div>
        <div className="field-grid">
          <Link to="/mechanics" className="field-card available">
            <span className="field-symbol" aria-hidden="true">
              ↗
            </span>
            <span className="tag">2つの実験</span>
            <h3>力学</h3>
            <p>
              物体は、どう動く？
              <br />
              位置・速度・加速度をつなぐ。
            </p>
            <span className="field-link">力学を探索する →</span>
          </Link>
          {[
            ['≈', '波', '重なり合うと、何が変わる？'],
            ['±', '電気', '離れたものに、力がはたらく？'],
            ['⌬', '化学', '物質の性質は、何で決まる？'],
            ['❋', '生物', '生命の変化を、どうとらえる？'],
            ['◎', '地学', '地球の変化を、どう読み解く？'],
          ].map(([symbol, title, question]) => (
            <div className="field-card planned" key={title}>
              <span className="field-symbol" aria-hidden="true">
                {symbol}
              </span>
              <span className="tag">今後のテーマ</span>
              <h3>{title}</h3>
              <p>{question}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="concept-route">
        <p className="eyebrow">最初の学習ルート</p>
        <h2>「どこにいる？」から、「どう変わる？」へ。</h2>
        <div className="concept-nodes">
          <Link to="/mechanics/motion">
            <span>01</span>位置と速度<small>座標・単位・グラフの傾き</small>
          </Link>
          <span aria-hidden="true">→</span>
          <Link to="/mechanics/acceleration">
            <span>02</span>加速度<small>変化率・二次関数</small>
          </Link>
          <span aria-hidden="true">→</span>
          <div className="future-node">
            <span>この先</span>力と運動<small>次に育てる問い</small>
          </div>
        </div>
      </section>
      <aside className="learning-note">
        <span aria-hidden="true">✎</span>
        <div>
          <h2>「正しかった」だけで終わらせない。</h2>
          <p>
            最初の予想、予想と違ったこと、まだ説明できないこと。学習メモは notes/journal/
            に残して、理解が変わった道筋も育てていきます。
          </p>
        </div>
      </aside>
    </div>
  )
}
