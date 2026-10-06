import type { LessonContent } from '../../../components/lesson'

export const lesson = {
  title: '鏡の向こうに見える葉の場所',
  subtitle: '同じ葉を、机の鏡へ近づけたり離したりします。',
  question: '鏡の向こうの葉は、どの場所に見える？',
  startingPoint: {
    scene: '机の鏡へ小さな葉を近づけたり、離したりする場面です。',
    focus: '同じ葉先から鏡を経て目へ届く光をたどります。'
  },
  learningGoal: {
    understand: '鏡へ葉を近づけると、鏡の向こうに見える葉も同じだけ近づく関係を理解します。',
    scope: '十分広い理想平面鏡を上から見た位置の図。正面の景色、目の中の結像や奥行き判断は再現しません。'
  },
  overview: '鏡の向こうにもう一枚の葉があるわけではありません。戻って目へ届いた光の向きをたどると、鏡から等しい奥行きの場所を指します。',
  relationships: [],
  observation: '同じ葉先から鏡を経て目へ届く光をたどります。',
  connection: '次は、虫めがねで葉が大きく見える関係を見ます。'
} as const satisfies LessonContent
