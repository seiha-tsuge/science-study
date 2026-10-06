import { lesson as walkingRow } from '../experiments/optics/walking-row/meta'
import { lesson as refraction } from '../experiments/optics/refraction/meta'
import { lesson as apparentDepth } from '../experiments/optics/apparent-depth/meta'
import { lesson as reflection } from '../experiments/optics/reflection/meta'
import { lesson as mirrorImage } from '../experiments/optics/mirror-image/meta'
import { lesson as magnifier } from '../experiments/optics/magnifier/meta'
import { lesson as paperImage } from '../experiments/optics/paper-image/meta'

export const opticsLessons = [
  { lesson: walkingRow, to: '/optics/walking-row', prerequisite: 'なし' },
  { lesson: refraction, to: '/optics/refraction', prerequisite: '人の列が傾く' },
  { lesson: apparentDepth, to: '/optics/apparent-depth', prerequisite: '水へ入る光の向き' },
  { lesson: reflection, to: '/optics/reflection', prerequisite: 'なし' },
  { lesson: mirrorImage, to: '/optics/mirror-image', prerequisite: '鏡で戻る光の向き' },
  { lesson: magnifier, to: '/optics/magnifier', prerequisite: '水へ入る光の向き' },
  { lesson: paperImage, to: '/optics/paper-image', prerequisite: '虫めがねで葉が大きく見える' },
] as const
