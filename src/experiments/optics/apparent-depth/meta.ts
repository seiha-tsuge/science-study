import type { LessonContent } from '../../../components/lesson'

export const lesson = {
  title: '水中のストローの見える場所',
  subtitle: '水だけを変えて、同じストローをのぞきます。',
  question: '水を入れると、同じストローはなぜずれて見える？',
  startingPoint: {
    scene: 'コップのストローを斜め上からのぞき、水を入れたり抜いたりする場面です。',
    focus: '同じ下端を目印に、実際の場所と見える場所を比べます。'
  },
  learningGoal: {
    understand: '水を入れてもストロー自体はまっすぐなのに、届く光の向きが変わると下側がずれて見える関係を理解します。',
    scope: '平らな水面を通る細い光の束から求めた位置の近似。コップの壁、曲面、目の中の結像は省きます。'
  },
  overview: '変えるのは水だけです。水面で向きを変えた光が届くと、下端は実際より浅い場所から来たように見えます。',
  relationships: [],
  observation: '同じ下端を目印に、実際の場所と見える場所を比べます。',
  connection: '次は、机の鏡へ届いた光が戻る向きを見ます。'
} as const satisfies LessonContent
