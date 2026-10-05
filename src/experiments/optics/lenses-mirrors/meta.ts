import type { LessonContent } from '../../../components/Lesson'

export const imagesLesson = {
  title: '凸レンズの像と平面鏡の像',
  subtitle: 'スクリーンに映る像、虫めがねで見る像、鏡の奥に見える像。物の一点から出る光を手がかりに比べます。',
  question: '像が見える場所は、光の道筋からなぜ決まるのか？',
  startingPoint: {
    scene: '虫めがねを文字の近くへ置くと大きく見え、鏡を見ると奥に物があるように見えます。一方、レンズにはスクリーンへ像を映せる置き方もあります。',
    focus: '砂地で足が進みにくくなる場面を図にします。中央だけ長く遅れる人の列を、レンズを通る光の目印へ移して、集まる向きが生まれる関係を見ます。その後、物の先端Aから出た光と像の位置を追います。',
  },
  overview: '物を見るときは、その物から目へ光が届いています。レンズで曲がったり鏡で反射したりすると、目へ入る最後の向きが変わります。像の位置は、その光が集まる場所、またはそこから広がって来たように見える場所として求められます。',
  relationships: [
    { title: '中央の遅れから、集まる向きへ', detail: '中央だけ長い砂地では、列の中央が後ろに残ります。レンズで遅れた光の並びへ移し、並びに90°の向きが内側を向く関係を見ます。' },
    { title: '一点の光から、像の一点へ', detail: '物の先端Aと根元Bを分けて追うと、光の交点の並びが、像の形や向きを決めると分かります。' },
    { title: '鏡では、延長が奥で交わる', detail: '平面鏡の奥の像は、反射して目へ届く光の延長から求められます。物と像の、鏡からの距離は等しくなります。' },
  ],
  observation: '物を動かしてから、スクリーンを動かすと、像の位置と「映せる場所」の対応を追えます。鏡では物を固定して目だけ動かし、変わる光路と変わらない像の位置を比べます。',
  connection: '虫めがねの拡大、スクリーンに映る倒立像、鏡の奥の像は、各点から出た光の道筋でつながります。どちらの像も目に届く光で見えます。レンズで光が曲がる理由は屈折へ、目の網膜に像を作る仕組みは眼の光学へつながります。',
} as const satisfies LessonContent

export const imageSources = [
  { title: 'OpenStax · Huygens’s Principle', url: 'https://openstax.org/books/university-physics-volume-3/pages/1-6-huygenss-principle' },
  { title: 'MIT · Lens Image Formation', url: 'https://people.csail.mit.edu/fredo/comp-photo-book/02-fundamentals-03-lens-image-formation.html' },
  { title: 'OpenStax · Plane Mirrors', url: 'https://openstax.org/books/university-physics-volume-3/pages/2-1-images-formed-by-plane-mirrors' },
  { title: 'OpenStax · Thin Lenses', url: 'https://openstax.org/books/university-physics-volume-3/pages/2-4-thin-lenses' },
] as const
