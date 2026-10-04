import { DURATION } from './types'

// フレーム数ではなくrequestAnimationFrameの経過時間を使う。
export function advanceTime(time: number, elapsedMilliseconds: number) {
  return Math.min(DURATION, time + Math.max(0, elapsedMilliseconds) / 1000)
}
