import type { LessonContent } from '../../../components/lesson'

export const lesson = {
  title: '鏡で戻る光の向き',
  subtitle: '机の鏡に届く光が、どちらへ戻るかを見ます。',
  question: '鏡へ届く向きと、戻る向きはどう対応する？',
  startingPoint: {
    scene: '机に置いた鏡へ日差しが届き、同じ側へ戻る場面です。',
    focus: '同じ鏡の面を基準に、届く側と戻る側を比べます。'
  },
  learningGoal: {
    understand: '鏡へ届く向きを変えると、鏡に直角な線から同じ角度で光が戻る関係を理解します。',
    scope: '平らな理想鏡での光の向き。明るさ、散乱や、物の像の位置はこのページでは扱いません。'
  },
  overview: '鏡へ届いた光は手前へ戻ります。面に直角な線から測ると、届く側と戻る側の角度は等しくなります。',
  connection: '次は、鏡で戻った光が、葉をどこに見せるかを見ます。'
} as const satisfies LessonContent
