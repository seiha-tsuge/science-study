import type { LessonContent } from '../../../components/lesson'

export const imagesLesson = {
  title: '凸レンズの像と平面鏡の像',
  subtitle: 'スクリーンに映る像、虫めがねで見る像、鏡の奥に見える像。物の一点から出る光を手がかりに比べます。',
  question: 'なぜ、紙に映る像と、のぞくと見える像があるのか？',
  startingPoint: {
    scene: '明るい場所で本の文字を読む場面から始めます。虫めがねで同じ文字をのぞき、レンズで白い紙へ映す場合や、鏡越しに見る場合と比べます。',
    focus: '文字の縦線を一本取り出し、上端Aと下端Bを目印にします。まず一点Aの光を追い、白い紙を動かして、同じ点として映る場所を見ます。虫めがねと鏡でも同じAを追い、目に届く向きを比べます。',
  },
  learningGoal: {
    understand: '本の文字を見ることを、文字の各点から目へ届く光で捉えます。同じ点の光が実際に集まる場所と、届く向きを来た側へ延ばして求める場所の違いから、紙に映せる像と、のぞくと見える像を理解します。',
    scope: '薄い凸レンズと平面鏡による、文字の各点と像の対応。網膜の結像や脳が文字を読み取る仕組みは扱いません。',
  },
  overview: '本を読むときは、文字で反射した光の一部が目へ届いています。レンズを通すと、文字の一点から出た光が紙の一か所へ集まる場合と、広がったまま目へ届く場合があります。鏡では光が反射して目へ届きます。',
  relationships: [
    { title: '紙に映す：各点の光がまとまる', detail: '一点Aからの光が紙の同じ一か所へ届くと、Aが一つの点として映ります。下端Bは別の場所へ映り、点の並びが文字の形になります。' },
    { title: 'のぞく：届く向きをたどる', detail: '目に届く二本を、光が来た側へまっすぐ延ばします。その線が交わる場所が、そこから光が来たように見える位置です。' },
    { title: '違いを比べてから、理由を深める', detail: '紙に映る像、虫めがね、鏡を同じAで比べます。焦点や、レンズが光を曲げる理由は、その後で図を選んでたどれます。' },
  ],
  observation: '物を動かしてから、スクリーンを動かすと、像の位置と「映せる場所」の対応を追えます。鏡では物を固定して目だけ動かし、変わる光路と変わらない像の位置を比べます。',
  connection: '本の文字を読むときも、虫めがねや鏡を通して見るときも、文字の各点から目へ届く光を追えます。虫めがねの拡大、スクリーンに映る倒立像、鏡の奥の像は、各点から出た光の道筋でつながります。どちらの像も目に届く光で見えます。レンズで光が曲がる理由は屈折へ、目の網膜に像を作る仕組みは眼の光学へつながります。',
} as const satisfies LessonContent

export const imageSources = [
  { title: 'OpenStax · Huygens’s Principle', url: 'https://openstax.org/books/university-physics-volume-3/pages/1-6-huygenss-principle' },
  { title: 'MIT · Lens Image Formation', url: 'https://people.csail.mit.edu/fredo/comp-photo-book/02-fundamentals-03-lens-image-formation.html' },
  { title: 'OpenStax · Plane Mirrors', url: 'https://openstax.org/books/university-physics-volume-3/pages/2-1-images-formed-by-plane-mirrors' },
  { title: 'OpenStax · Thin Lenses', url: 'https://openstax.org/books/university-physics-volume-3/pages/2-4-thin-lenses' },
] as const
