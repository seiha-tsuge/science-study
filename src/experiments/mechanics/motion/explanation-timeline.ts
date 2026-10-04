// 説明の秒数と、モデルへ渡す物理時刻を区別する。
export const EXPLANATION_DURATION = 22

export const explanationScenes = [
  { end: 2, label: '座標', caption: '基準に選んだ0 mの場所を「原点」と呼びます。原点より右を正、左を負として、物体の位置を表します。この例の出発点は0 mです。' },
  { end: 6, label: '運動', caption: '毎秒5 mずつ右へ進みます。これが速度＋5 m/sです。物体の時間を0〜4秒まで進めると、位置は0 mから20 mへ変わります。' },
  { end: 10, label: '位置の印', caption: '物体の時間を4秒で止めます。白い輪は0、1、2、3、4秒にいた場所です。隣り合う輪の間隔はすべて5 mです。' },
  { end: 14, label: '変位', caption: '後の位置から前の位置を引いた差が「変位」です。緑の矢印は隣り合う印の位置の差を示し、どの1秒間も＋5 mになります。' },
  { end: 18, label: 'グラフ', caption: '道の上の印を、横が時間、縦が位置の点に移します。右へ1秒進むごとに5 m高くなるので、点は一直線に並びます。この上がる割合が「傾き」で、5 m/sです。' },
  { end: 22, label: '式', caption: '出発時からの位置の差は「速度×時間」です。これを出発点に足すと、今の位置になります。この例では x₀ = 0 m、v = 5 m/s、t = 4 sなので、x = 20 mです。' },
] as const

export function explanationPhysicalTime(presentationTime: number) {
  // 説明2〜6秒の間だけ、物理時刻0〜4秒を等倍で進める。
  return Math.min(4, Math.max(0, presentationTime - 2))
}

export function explanationSceneIndex(presentationTime: number) {
  const index = explanationScenes.findIndex((scene) => presentationTime <= scene.end)
  return index < 0 ? explanationScenes.length - 1 : index
}
