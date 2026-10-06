import type { LessonContent } from '../../../components/lesson'

export const lesson = {
  title: '人の列が傾く',
  subtitle: '列の片側だけが先に遅くなると、並びの向きが変わります。',
  question: '片側が先に遅くなると、並びはどう変わる？',
  startingPoint: {
    scene: '横に並んだ人たちが、舗装された道から砂地へ歩く場面です。',
    focus: '同じ時間にAとBが進む距離を比べます。'
  },
  learningGoal: {
    understand: '砂地へ先に入った側が遅くなると、人の列の向きが変わる関係を理解します。',
    scope: '全員が同じ方向へ歩き、砂地で速さが変わる模式図。人が互いを引っ張る運動は扱いません。'
  },
  overview: '斜めに砂地へ入ると、先に入った側は長い時間ゆっくり進みます。個人の歩く向きを保っても、並びは傾きます。',
  relationships: [],
  observation: '同じ時間にAとBが進む距離を比べます。',
  connection: '次は、速さの違いと光の向きの関係を見ます。人の歩く向きと光の向きは同一ではありません。'
} as const satisfies LessonContent
