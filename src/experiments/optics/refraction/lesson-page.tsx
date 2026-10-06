import { Anchor, Text } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import Lesson from '../../../components/lesson'
import { Refraction } from '../concept-experiences'
import { lesson } from './meta'
import '../concept-lessons.css'

export default function LessonPage() {
  return <Lesson lesson={lesson} number="02" singleConcept subject={{ title: '光学', to: '/optics', label: 'OPTICS' }}
    mechanism={<Refraction />}
    explanation={<Text>空気の屈折率n₁ = 1、水の屈折率n₂ = 1.33として、n₁ sin θ₁ = n₂ sin θ₂（スネルの法則）で向きを求めます。θ₁とθ₂は水面に直角な方向から測る角度で、空気側は0°または45°です。屈折率は光の速さc/nを定める無次元の比で、cは真空中の光速です。緑の線は横幅1.2 mを選んだ一つの波面で、波長を設定した意味ではありません。説明の8秒は光の約4.00 nsに対応します。</Text>}
    sources={[{ title: 'OpenStax · Refraction', url: 'https://openstax.org/books/university-physics-volume-3/pages/1-3-refraction' }]}
    next={<Anchor component={Link} to="/optics/apparent-depth">次へ：水中のストローの見える場所 →</Anchor>} />
}
