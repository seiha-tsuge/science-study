import { Anchor, Text } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import Lesson from '../../../components/lesson'
import { WalkingMotion } from '../shared/daily-motion'
import { motionLesson } from './meta'

export default function LessonPage() {
  return <Lesson lesson={motionLesson} number="01"
    mechanism={<WalkingMotion />}
    sources={[{ title: 'OpenStax · Instantaneous Velocity and Speed', url: 'https://openstax.org/books/university-physics-volume-1/pages/3-2-instantaneous-velocity-and-speed' }]}
    explanation={<Text>出発点を0 mにし、右向きを正とします。一定の速度vで歩く場所はx = vtです。vは1秒あたりに進む量で、単位はm/s。tは開始からの秒数、xは出発点からの距離mです。v = 0〜2 m/s、t = 0〜10秒に絞ります。条件を変えると時刻0へ戻って停止し、道とグラフを同時に更新します。</Text>}
    next={<Anchor component={Link} to="/mechanics/acceleration">次へ：発進した車が進む距離 →</Anchor>} />
}
