import { Link } from '@tanstack/react-router'

export default function NotFound() {
  return (
    <div className="not-found">
      <h1>ページが見つかりません</h1>
      <p>指定されたURLのページは存在しません。</p>
      <Link to="/">ホームに戻る</Link>
    </div>
  )
}
