import { Anchor, Text } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import Lesson from '../../../components/lesson'
import { WalkingRow } from '../concept-experiences'
import { lesson } from './meta'
import '../concept-lessons.css'

export default function LessonPage() {
  return <Lesson lesson={lesson} number="01" subject={{ title: '光学', to: '/optics', label: 'OPTICS' }}
    mechanism={<WalkingRow />}
    explanation={<Text>道1.5 m/s、砂地0.75 m/sまたは1.5 m/s。説明の8秒を歩行の1.5秒へ対応させる。</Text>}
    sources={[{ title: 'OpenStax · Huygens’s Principle', url: 'https://openstax.org/books/university-physics-volume-3/pages/1-6-huygenss-principle' }]}
    next={<Anchor component={Link} to="/optics/refraction">次へ：水へ入る光の向き →</Anchor>} />
}
