import type { LessonContent } from '../../../components/lesson'

export const lesson = {
  title: '白い紙に文字を映す場所',
  subtitle: '文字とレンズを保ち、白い紙だけを動かします。',
  question: '紙をどこへ置くと、文字がくっきり映る？',
  startingPoint: {
    scene: 'レンズを通った文字の光を、白い紙で受けて紙を動かす場面です。',
    focus: '同じ文字の上端Aから出た二本が、紙のどこへ届くかを比べます。'
  },
  learningGoal: {
    understand: '文字の各点から出た光がそれぞれ一か所へ集まる位置に紙を置くと、輪郭がくっきり映る関係を理解します。',
    scope: '理想的な薄い凸レンズ。二本の到着位置の比較で、ぼけの形、収差と明るさ全体は再現しません。'
  },
  overview: '紙が集まる位置から外れると、同じ点から出た光が別々の場所へ当たります。集まる位置なら、各点が別々の一点として映ります。',
  relationships: [],
  observation: '同じ文字の上端Aから出た二本が、紙のどこへ届くかを比べます。',
  connection: 'この題材での観察を終えたら、光学の目次から次に見る問いを選べます。'
} as const satisfies LessonContent
