import { Anchor, Text } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import Lesson from '../../../components/lesson'
import { Reflection } from '../concept-experiences'
import { lesson } from './meta'
import '../concept-lessons.css'

export default function LessonPage() {
  return <Lesson lesson={lesson} number="04" subject={{ title: '光学', to: '/optics', label: 'OPTICS' }}
    mechanism={<Reflection />}
    explanation={<Text>平面鏡の反射則。面に直角な方向から角度0°から60°を測る。</Text>}
    sources={[{ title: 'OpenStax · The Law of Reflection', url: 'https://openstax.org/books/university-physics-volume-3/pages/1-2-the-law-of-reflection' }]}
    next={<Anchor component={Link} to="/optics/mirror-image">次へ：鏡の向こうに見える葉の場所 →</Anchor>} />
}
