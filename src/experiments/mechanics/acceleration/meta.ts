export const accelerationLesson = {
  title: '加速度',
  subtitle: '速度の変化を、時間でとらえる。',
  question: '1秒ごとに速度が同じ量ずつ増えると、位置のグラフはどう変わる？',
  predictionQuestion: '右向きの速度に、右向きの加速度を加えると、1秒ごとに進む距離は？',
  predictions: [
    '毎秒、同じ距離',
    '毎秒、進む距離が増える',
    '毎秒、進む距離が減る',
    'まだ分からない',
  ],
  observation:
    '青は等加速度運動、灰色の破線は同じ初期位置・初速度で加速度が0の運動です。1秒ごとの位置の差と、速度の増え方を比べましょう。',
  reflection:
    '「加速度が一定」と「速度が一定」はどう違う？ 位置のグラフと速度のグラフの形を、単位も使って説明してみましょう。',
  challenge: '初期位置0 m、初速度0 m/s、加速度2 m/s²。3秒後の位置は？',
  challengeOptions: ['3 m', '6 m', '9 m'],
  challengeAnswer: '9 m',
  challengeExplanation:
    '位置は ½ × 2 × 3² = 9 m。3秒後の速度6 m/sを、最初から一定だった速度として使うことはできません。',
  journalPath: 'notes/journal/TEMPLATE.md',
} as const
