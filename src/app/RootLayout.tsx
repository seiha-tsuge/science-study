import { Link, Outlet, useLocation } from '@tanstack/react-router'
import { useEffect } from 'react'

export default function RootLayout() {
  const pathname = useLocation({ select: (location) => location.pathname })
  useEffect(() => {
    const title = pathname.endsWith('/motion')
      ? '位置と速度'
      : pathname.endsWith('/acceleration')
        ? '加速度'
        : pathname.startsWith('/mechanics')
          ? '力学'
          : '学習マップ'
    document.title = `${title} | 科学の実験室`
  }, [pathname])
  return (
    <>
      <a className="skip-link" href="#main">
        本文へ移動
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="brand">
            <span className="brand-mark" aria-hidden="true">
              s.
            </span>
            <span>
              科学の実験室<small>SCIENCE STUDY</small>
            </span>
          </Link>
          <nav aria-label="メインナビゲーション">
            <Link to="/" activeOptions={{ exact: true }} activeProps={{ 'aria-current': 'page' }}>
              学習マップ
            </Link>
            <Link to="/mechanics" activeProps={{ 'aria-current': 'page' }}>
              力学
            </Link>
          </nav>
          <span className="personal-label">PERSONAL LAB</span>
        </div>
      </header>
      <main id="main" className="site-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <span>科学の実験室</span>
        <p>問いを立てる。条件を変える。理由を説明する。</p>
        <Link to="/">学びの地図に戻る ↑</Link>
      </footer>
    </>
  )
}
