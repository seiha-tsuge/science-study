import type { LessonContent } from '../../../components/lesson'

export const lesson = {
  title: '水へ入る光の向き',
  subtitle: '水面の上と下で、同じ光の進む向きを比べます。',
  question: '水へ斜めに入ると、光はなぜ向きを変える？',
  startingPoint: {
    scene: '水面に差し込む日差しを、横からの図で見る場面です。',
    focus: '同じ光の目印が水へ入る前後を比べます。'
  },
  learningGoal: {
    understand: '光が水へ斜めに入ると、進む速さの違いに伴って向きが変わる関係を理解します。',
    scope: '平らな水面と透明な空気、水。反射した光や、物質中で遅くなる微視的な仕組みは扱いません。'
  },
  overview: '空気から水へ入ると光は遅く進みます。斜めに届く波では、水へ先に入る側が遅くなり、同じ進み具合の場所を結ぶ線の向きが変わります。',
  relationships: [],
  observation: '同じ光の目印が水へ入る前後を比べます。',
  connection: '次は、水面を通って目へ届く光と、ストローの見える場所をつなぎます。'
} as const satisfies LessonContent
