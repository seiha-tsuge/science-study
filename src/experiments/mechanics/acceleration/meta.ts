import type { LessonContent } from '../../../components/lesson'

export const accelerationLesson = {
  title: '発進した車が進む距離',
  subtitle: '止まった車が発進し、毎秒同じだけ速くなります。',
  question: '車が発進して速くなると、なぜ距離に時間の二乗が現れる？',
  startingPoint: {
    scene: '止まっていた車が、まっすぐな道へ発進する場面です。',
    focus: '同じ車の1秒ごとの場所と、2秒後、4秒後に進んだ距離を比べます。',
  },
  learningGoal: {
    understand: '止まった車の速度が毎秒同じ量ずつ増えると、進んだ距離が時間の二乗に比例して増える理由を理解します。',
    scope: '止まった状態から速度が毎秒同じ量ずつ増える車のモデル。エンジン、力、初めから動いている車や反転は扱いません。',
  },
  overview: '後の1秒ほど遠くへ進むので、道の印の間隔が広がります。同じ車の速度と時間へ移すと、進んだ距離は三角形の面積に対応します。',
  connection: '同じ車が進んだ距離を、速度と時間の面積で説明しました。力学の目次から、次に見る問いを選べます。',
} as const satisfies LessonContent
