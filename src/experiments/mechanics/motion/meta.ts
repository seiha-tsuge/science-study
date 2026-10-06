import type { LessonContent } from '../../../components/lesson'

export const motionLesson = {
  title: '歩く場所とグラフ',
  subtitle: '同じペースで歩く人の場所を、グラフへ移します。',
  question: '同じペースで歩くと、なぜグラフは直線になる？',
  startingPoint: {
    scene: 'まっすぐな道を、同じ向きに同じペースで歩く場面です。',
    focus: '同じ人が1秒ごとにいた場所を目印にし、同じ時刻のグラフの点へ渡します。',
  },
  learningGoal: {
    understand: '同じペースで歩くと、同じ時間に場所が同じ量ずつ変わり、位置と時間のグラフが直線になる関係を理解します。',
    scope: '出発点から右へ同じペースで歩くモデル。歩行の姿勢、ペースを保つ力や、別の出発点は扱いません。',
  },
  overview: '1秒ごとの道の印は等間隔です。横に時刻、縦に道の場所を取ると、同じ印が直線に並びます。',
  connection: '次は、止まった車が毎秒同じだけ速くなる場合に、進む距離を比べます。',
} as const satisfies LessonContent
