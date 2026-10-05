export type RayScene = 'direct' | 'focus' | 'real' | 'virtual' | 'mirror'

export function rayObservation(kind: RayScene, progress: number, extensions = true) {
  if (progress === 0) return kind === 'focus'
    ? 'レンズ・軸・Fの目印だけを示しています。まだ光の道筋は描いていません。'
    : '物と目印だけを示しています。まだ光の道筋は描いていません。'
  if (progress < .35) return kind === 'focus'
    ? '軸に平行な三本を、左からレンズまで描いている途中です。'
    : kind === 'direct' ? '同じAから出る二本を、目へ向かって描いている途中です。'
      : `同じAから出る光を、${kind === 'mirror' ? '鏡' : 'レンズ'}まで描いている途中です。`
  if (progress < .7) return kind === 'direct'
    ? '二本の実線が目まで届いた完成図です。最後の段階で、来た向きを逆にたどれます。'
    : kind === 'real' ? 'レンズまで描き終えました。出た後の光をスクリーンへ向かって描く段階です。'
      : kind === 'focus' ? 'レンズまで描き終えました。出た後の三本を右のFへ向かって描く段階です。'
        : `${kind === 'mirror' ? '鏡' : 'レンズ'}まで描き終えました。向きが変わった光を目へ向かって描く段階です。`
  if (kind === 'focus') return '三本が右のFまで届いた完成図です。軸に平行に入る光が集まる、この点が焦点です。'
  if (kind === 'real') return 'Aの光がスクリーンの一点に届いた完成図です。下端Bの光を重ねると、別の点に集まる対応も見られます。'
  if (!extensions) return '二本の実線は目まで描き終えています。逆向きの延長は非表示です。スイッチで重ねても、作図の時間と実線は変わりません。'
  if (progress < 1) return '実線は目まで描き終えています。破線を逆向きに伸ばす段階です。光が逆向きに進む動きではありません。'
  return kind === 'direct' ? '破線を目から逆向きにたどると、元のAで交わります。実際の光はAから目へ進みます。'
    : `破線が${kind === 'mirror' ? '鏡の奥' : 'レンズの左'}で交わった完成図です。この像へ光が実際に集まるわけではありません。`
}
