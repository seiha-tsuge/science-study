import type { LessonContent } from '../../../components/lesson'

export const imagesLesson = {
  title: '凸レンズの像と平面鏡の像',
  subtitle: '虫めがねで文字が大きく見える、鏡の奥に文字があるように見える。身近な見え方を比べてから、紙に映せる像との違いをたどります。',
  question: 'なぜ、紙に映る像と、のぞくと見える像があるのか？',
  startingPoint: {
    scene: '本の文字に虫めがねを近づけ、レンズあり・なしで同じ文字を比べます。鏡では文字を近づけ、奥にあるように見える位置がどう変わるかを見ます。',
    focus: '文字の縦線を一本取り出し、上端Aと下端Bを目印にします。まず一点Aの光を追い、白い紙を動かして、同じ点として映る場所を見ます。虫めがねと鏡でも同じAを追い、目に届く向きを比べます。',
  },
  learningGoal: {
    understand: '虫めがねで文字が大きく見え、鏡では奥にあるように見える理由を、同じ文字から目へ届く光でたどります。紙に映せる場所と、のぞくと見える場所の違いを理解します。',
    scope: '薄い凸レンズと平面鏡による、文字の各点と像の対応。虫めがねの図は像の高さ・位置を示し、目に映る見え方の再現ではありません。眼鏡の補正との違いは紹介しますが、網膜への結像の計算や脳の仕組みは扱いません。',
  },
  overview: '本を読むときは、文字で反射した光の一部が目へ届いています。レンズを通すと、文字の一点から出た光が紙の一か所へ集まる場合と、広がったまま目へ届く場合があります。鏡では光が反射して目へ届きます。',
  relationships: [
    { title: '紙に映す：各点の光がまとまる', detail: '一点Aからの光が紙の同じ一か所へ届くと、Aが一つの点として映ります。下端Bは別の場所へ映り、点の並びが文字の形になります。' },
    { title: 'のぞく：届く向きをたどる', detail: '目に届く二本を、光が来た側へまっすぐ延ばします。その線が交わる場所が、そこから光が来たように見える位置です。' },
    { title: '違いを比べてから、理由を深める', detail: '紙に映る像、虫めがね、鏡を同じAで比べます。焦点や、レンズが光を曲げる理由は、その後で図を選んでたどれます。' },
  ],
  observation: 'ここからは、入口とは独立した条件で広い範囲を比べます。物を動かしてからスクリーンを動かすと、像の位置と「映せる場所」の対応を追えます。鏡では物を固定して目だけ動かし、変わる光路と変わらない像の位置を比べます。',
  connection: '虫めがねで文字を見るときと、鏡に物を近づけるときへ戻ると、光が来たように見える場所を同じ方法でたどれます。一方、カメラでは各点の光をセンサーへ集め、紙に映す実像と同じ関係を使います。眼鏡は拡大そのものを目的にせず、目に届く光を調整して網膜へ像を合わせます。近視の凹レンズと遠視の凸レンズの補正、目のピント調節は眼の光学へつながります。',
} as const satisfies LessonContent

export const imageSources = [
  { title: 'OpenStax · The Eye', url: 'https://openstax.org/books/university-physics-volume-3/pages/2-5-the-eye' },
  { title: 'OpenStax · Huygens’s Principle', url: 'https://openstax.org/books/university-physics-volume-3/pages/1-6-huygenss-principle' },
  { title: 'MIT · Lens Image Formation', url: 'https://people.csail.mit.edu/fredo/comp-photo-book/02-fundamentals-03-lens-image-formation.html' },
  { title: 'OpenStax · Plane Mirrors', url: 'https://openstax.org/books/university-physics-volume-3/pages/2-1-images-formed-by-plane-mirrors' },
  { title: 'OpenStax · Thin Lenses', url: 'https://openstax.org/books/university-physics-volume-3/pages/2-4-thin-lenses' },
] as const
