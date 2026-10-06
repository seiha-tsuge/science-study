import { Anchor, Text } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import Lesson from '../../../components/lesson'
import { Magnifier } from '../concept-experiences'
import { lesson } from './meta'
import '../concept-lessons.css'

export default function LessonPage() {
  return <Lesson lesson={lesson} number="06" subject={{ title: '光学', to: '/optics', label: 'OPTICS' }}
    mechanism={<Magnifier />}
    explanation={<Text>レンズの中心から葉までの距離をa、見える葉までの符号付き距離をb、焦点距離をfとすると、1/f = 1/a + 1/bです。光が出ていく側を正とし、ここではbは負です。像の高さの倍率m = −b/aだけでは、目から見える大きさは決まりません。同じ目と葉の位置で比較する小さい角度の比は、m(0.4+a)/(0.4−b)です。f = 0.1 m、葉の高さ0.002 m、a = 0.05〜0.075 m、目はレンズから0.4 mに固定しています。</Text>}
    sources={[{ title: 'OpenStax · The Simple Magnifier', url: 'https://openstax.org/books/university-physics-volume-3/pages/2-7-the-simple-magnifier' }]}
    next={<Anchor component={Link} to="/optics/paper-image">次へ：白い紙に文字を映す場所 →</Anchor>} />
}
