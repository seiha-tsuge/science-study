export const motionLesson = {
  title: '位置と速度',
  subtitle: '同じ時間に、同じ距離を進む。',
  question: '同じ速度で進み続ける物体の位置は、時間とともにどう変わる？',
  predictionQuestion: '位置と時間のグラフは、どんな形になると思いますか？',
  predictions: [
    '一定の傾きの直線',
    'だんだん傾きが大きくなる曲線',
    '時間が経っても位置は変わらない',
    'まだ分からない',
  ],
  observation:
    '1秒、2秒、3秒で一時停止して、位置の増え方を比べましょう。次に速度だけを変え、同じ時刻の位置を比較してください。',
  reflection:
    'なぜ位置のグラフは直線になる？ 速度を2倍にしたとき、位置の変化量とグラフの傾きはどう変わる？',
  challenge: '初期位置が10 m、速度が −3 m/s のとき、4秒後の位置は？',
  challengeOptions: ['−2 m', '2 m', '22 m'],
  challengeAnswer: '−2 m',
  challengeExplanation:
    '4秒間の変位は −12 m。出発点の10 mに加えると −2 mです。位置と移動距離は同じとは限りません。',
  journalPath: 'notes/journal/TEMPLATE.md',
} as const
