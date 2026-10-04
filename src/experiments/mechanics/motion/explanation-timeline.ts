// 説明の秒数と、モデルへ渡す物理時刻を区別する。
export const EXPLANATION_DURATION = 22

export const explanationScenes = [
  { end: 2, label: '座標', caption: '原点は0 m。右向きを正として、出発点に物体を置きます。' },
  { end: 6, label: '運動', caption: '速度は5 m/s。物理時刻を0〜4秒まで進めると、位置は0〜20 mへ一定の割合で変わります。' },
  { end: 10, label: '位置の印', caption: '物理時刻を4秒で止め、過去の位置を振り返ります。1秒ごとの印は等間隔です。' },
  { end: 14, label: '変位', caption: 'どの1秒間でも変位は＋5 m。等しい時間ごとに、等しい変位が生じています。' },
  { end: 18, label: 'グラフ', caption: '横軸を時間、縦軸を位置にすると、同じ増え方の点が一直線に並びます。傾きは5 m/sです。' },
  { end: 22, label: '式', caption: '位置は「出発点＋速度×時間」。この例では x₀ = 0 m、v = 5 m/s、t = 4 sなので、x = 20 mです。' },
] as const

export function explanationPhysicalTime(presentationTime: number) {
  // 説明2〜6秒の間だけ、物理時刻0〜4秒を等倍で進める。
  return Math.min(4, Math.max(0, presentationTime - 2))
}

export function explanationSceneIndex(presentationTime: number) {
  const index = explanationScenes.findIndex((scene) => presentationTime <= scene.end)
  return index < 0 ? explanationScenes.length - 1 : index
}
