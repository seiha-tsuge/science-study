import { MantineProvider } from '@mantine/core'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { StrawScene, StrawObservation } from './straw-experience'

describe('観察と説明を段階で分ける', () => {
  const render = (node: React.ReactNode) => renderToStaticMarkup(<MantineProvider>{node}</MantineProvider>)
  it('観察には光の矢印も逆向きの延長も出さない', () => {
    for (const water of [true, false]) {
      const html = render(<StrawObservation water={water} onWaterChange={() => {}} />)
      expect(html).not.toContain('marker-end')
      expect(html).not.toContain('stroke-dasharray="6 5"')
      expect(html).toContain('変えるのは、水だけ')
    }
  })
  it('実線を先に重ね、見える位置の場面で初めて補助線を示す', () => {
    const shape = render(<StrawScene water explanation step={0} />)
    const light = render(<StrawScene water explanation step={1} />)
    const position = render(<StrawScene water explanation step={2} />)
    expect(shape).not.toContain('marker-end')
    expect(light).toContain('marker-end')
    expect(light).not.toContain('stroke-dasharray="6 5"')
    expect(light).not.toContain('破線は見える場所を探す')
    expect(position).toContain('stroke-dasharray="6 5"')
    expect(position).toContain('光が逆走する道筋ではない')
  })
})
