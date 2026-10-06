import { Anchor, Text } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import Lesson from '../../../components/lesson'
import { StartingCar } from '../shared/daily-motion'
import { accelerationLesson } from './meta'

export default function LessonPage() {
  return <Lesson lesson={accelerationLesson} number="02"
    mechanism={<StartingCar />}
    explanation={<Text>止まった車が出発するので、初期位置と初期速度は0です。毎秒の速度の増え方aを一定にすると、v = at、進んだ距離x = ½at²です。aの単位はm/s²、tは開始からの秒数、xはmです。a = 0〜2 m/s²、t = 0〜6秒に絞ります。三角形の底辺tと高さatを掛けて半分にすると、道の距離になります。初期速度が0以外の場合は別の項が加わるため、全距離を時間の二乗だけでは表せません。</Text>}
    next={<Anchor component={Link} to="/mechanics">次へ：力学の目次 →</Anchor>} />
}
