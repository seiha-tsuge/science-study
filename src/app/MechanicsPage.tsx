import { Link } from '@tanstack/react-router'

export default function MechanicsPage() {
  return (
    <div className="mechanics-page">
      <nav className="breadcrumb" aria-label="パンくず">
        <Link to="/">学習マップ</Link>
        <span>/</span>
        <span>力学</span>
      </nav>
      <header className="page-heading">
        <p className="eyebrow">EXPLORE · MECHANICS</p>
        <h1>力学</h1>
        <p>
          位置が変わる。速度が変わる。
          <br />
          身近な「動き」を、図・グラフ・言葉でとらえよう。
        </p>
      </header>
      <section className="intro-card">
        <h2>まずは、動きを説明するところから。</h2>
        <p>
          力学は物体の運動や、力との関係を扱う分野です。最初の2題では、なぜ力がはたらくかを考える前に、位置・速度・加速度を使って「どのように動くか」を記述します。
        </p>
        <div className="concept-tags">
          <span>位置 [m]</span>
          <span>速度 [m/s]</span>
          <span>加速度 [m/s²]</span>
        </div>
      </section>
      <section className="lesson-list">
        <h2>問いを選ぶ</h2>
        <Link to="/mechanics/motion" className="lesson-card">
          <span className="lesson-number">01</span>
          <div>
            <span className="eyebrow">等速運動</span>
            <h3>位置と速度</h3>
            <p>同じ速度で進み続けると、位置のグラフはどうなる？</p>
            <span className="prerequisite">必要な知識：座標、秒とメートル、グラフの読み方</span>
          </div>
          <span aria-hidden="true">↗</span>
        </Link>
        <Link to="/mechanics/acceleration" className="lesson-card">
          <span className="lesson-number">02</span>
          <div>
            <span className="eyebrow">等加速度運動</span>
            <h3>加速度</h3>
            <p>速度が一定の割合で変わると、進む距離はどう変わる？</p>
            <span className="prerequisite">前のテーマ：位置と速度 ／ 数学：変化率、二次関数</span>
          </div>
          <span aria-hidden="true">↗</span>
        </Link>
      </section>
      <section className="future-topics">
        <h2>この先で扱いたい問い</h2>
        <p>放物運動 → ばねの振動 → 波と重ね合わせ → ランダムウォーク</p>
        <p className="small-note">
          まず2題を学んで、必要になった実験から追加します。学ぶ範囲と数学は docs/learning-map.md
          でもたどれます。
        </p>
      </section>
    </div>
  )
}
