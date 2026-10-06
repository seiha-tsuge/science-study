import { Anchor, Text } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import Lesson from '../../../components/lesson'
import { MirrorImage } from '../concept-experiences'
import { lesson } from './meta'
import '../concept-lessons.css'

export default function LessonPage() {
  return <Lesson lesson={lesson} number="05" singleConcept subject={{ title: '光学', to: '/optics', label: 'OPTICS' }}
    mechanism={<MirrorImage />}
    explanation={<Text>葉の距離10〜40 cm。平面鏡は物の座標の面に垂直な成分を反転する。目の位置を固定する。</Text>}
    sources={[{ title: 'OpenStax · Images Formed by Plane Mirrors', url: 'https://openstax.org/books/university-physics-volume-3/pages/2-1-images-formed-by-plane-mirrors' }]}
    next={<Anchor component={Link} to="/optics/magnifier">次へ：虫めがねで葉が大きく見える →</Anchor>} />
}
