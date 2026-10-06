import type { LessonContent } from '../../../components/lesson'

export const imagesLesson = {
  title: '凸レンズの像と平面鏡の像',
  subtitle: '同じ葉を、虫めがねでのぞいたり、鏡に映したりする。',
  question: '虫めがねや鏡をのぞくと、何が変わる？',
  startingPoint: {
    scene: '小さな葉を虫めがねでのぞき、次に机の鏡へ近づけます。同じ葉と道具を保ちながら、見える大きさや奥行きを比べます。',
    focus: '先に葉の姿を見てから、同じ葉先から目へ届く光を重ねます。レンズの表面と鏡の面で、向きが変わる場所をたどります。',
  },
  learningGoal: {
    understand: '虫めがねでは葉が大きく、鏡では向こう側に葉があるように見えます。道具を経て目へ届く光と、同じ葉の見え方をつなぎます。',
    scope: '理想的な薄い凸レンズと平面鏡の模式表示。虫めがねは小さい角度での大きさの比較、鏡は上から見た配置です。ぼけ、明るさ、目のピント調節は再現しません。',
  },
  overview: '見ているのは、物から目へ届く光です。レンズはその向きを変え、鏡は光を反射します。届く向きが変わると、物の見える大きさや場所も変わります。',
  relationships: [
    { title: '道具の境目', detail: 'レンズでは空気とガラスの境目、鏡では反射する面に注目します。' },
    { title: '物から目へ届く光', detail: '同じ葉から来た光の向きを、道具の前後でたどります。' },
    { title: '道具を通した葉の姿', detail: '見える場所を図で示してから、その姿を「像」と呼びます。' },
  ],
  observation: '道具を使う場面で見た関係を、もう少し広い条件で試せます。数値を使った作図と、紙に光を集める別の使い方は、必要なときに開けます。ここでの条件は上の観察とは独立しています。',
  connection: '虫めがねを外すと、同じ葉へ戻ります。鏡から離すと、向こうに見える葉の奥行きも変わります。いつもの道具をのぞくときも、物から目までの間に何があるかを見ると、見え方の違いをたどれます。',
} as const satisfies LessonContent

export const imageSources = [
  { title: 'OpenStax · The Simple Magnifier', url: 'https://openstax.org/books/university-physics-volume-3/pages/2-7-the-simple-magnifier' },
  { title: 'MIT · Lens Image Formation', url: 'https://people.csail.mit.edu/fredo/comp-photo-book/02-fundamentals-03-lens-image-formation.html' },
  { title: 'OpenStax · Plane Mirrors', url: 'https://openstax.org/books/university-physics-volume-3/pages/2-1-images-formed-by-plane-mirrors' },
  { title: 'OpenStax · Thin Lenses', url: 'https://openstax.org/books/university-physics-volume-3/pages/2-4-thin-lenses' },
] as const
