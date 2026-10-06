import { Anchor, Text } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import Lesson from '../../../components/lesson'
import { PaperImage } from '../concept-experiences'
import { lesson } from './meta'
import '../concept-lessons.css'

export default function LessonPage() {
  return <Lesson lesson={lesson} number="07" subject={{ title: '光学', to: '/optics', label: 'OPTICS' }}
    mechanism={<PaperImage />}
    explanation={<Text>理想的な薄いレンズの中心から、文字までの距離a = 0.2 m、焦点距離f = 0.1 mに固定します。1/f = 1/a + 1/bから、光が集まる距離b = 0.2 mです。紙は0.16、0.2、0.3 mに置いて比べます。上端Aの高さ0.002 m、レンズを通る高さ±0.0025 mの二本を使い、各点から出た光が紙へ当たる位置を計算しています。</Text>}
    sources={[{ title: 'OpenStax · Thin Lenses', url: 'https://openstax.org/books/university-physics-volume-3/pages/2-4-thin-lenses' }]}
    next={<Anchor component={Link} to="/optics">次へ：光学の目次 →</Anchor>} />
}
