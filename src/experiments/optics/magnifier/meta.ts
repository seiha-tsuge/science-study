import type { LessonContent } from '../../../components/lesson'

export const lesson = {
  title: '虫めがねで葉が大きく見える',
  subtitle: '虫めがねを使う前後で、同じ葉を比べます。',
  question: '虫めがねを使うと、同じ葉はなぜ大きく見える？',
  startingPoint: {
    scene: '小さな葉を虫めがねでのぞき、虫めがねだけを外して比べる場面です。',
    focus: '葉と見る目の位置を保ち、同じ葉脈の間隔を比べます。'
  },
  learningGoal: {
    understand: '虫めがねを通る光の向きが変わると、同じ葉が目から広い角度を占めて大きく見える関係を理解します。',
    scope: '焦点距離より近い葉を理想的な薄い凸レンズで見る場合。小さい角度の近似で、ぼけ、明るさ、目の調節は扱いません。'
  },
  overview: '葉そのものは大きくなりません。レンズで曲がった光が、そのまま見る場合より広い角度から目へ届きます。',
  connection: '次は、レンズを通った文字の光を白い紙で受ける場所を見ます。'
} as const satisfies LessonContent
