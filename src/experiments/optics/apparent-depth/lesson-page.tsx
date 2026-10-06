import { Anchor, Text } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import Lesson from '../../../components/lesson'
import { ApparentDepth } from '../concept-experiences'
import { lesson } from './meta'
import '../concept-lessons.css'

export default function LessonPage() {
  return <Lesson lesson={lesson} number="03" singleConcept subject={{ title: '光学', to: '/optics', label: 'OPTICS' }}
    mechanism={<ApparentDepth />}
    explanation={<Text>既存strawSceneの物の位置と目を固定し、水の屈折率1.33または1。近接した二本の延長交点で見える点を求める。</Text>}
    sources={[{ title: 'OpenStax · Images Formed by Refraction', url: 'https://openstax.org/books/university-physics-volume-3/pages/2-3-images-formed-by-refraction' }]}
    next={<Anchor component={Link} to="/optics/reflection">次へ：鏡で戻る光の向き →</Anchor>} />
}
