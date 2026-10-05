import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { LensDiagram } from './Diagrams'

describe('条件操作の光線の対応', () => {
  it('焦点の前後でもAの二本は軸の上下2.5 mmの同じ場所へ入る', () => {
    for (const objectDistance of [.4, .105, .1, .095, .075, .05]) {
      const html = renderToStaticMarkup(<LensDiagram input={{ focalLength: .1, objectDistance, objectHeight: .002 }} fixedEntry screen={.2} />)
      const rays = [...html.matchAll(/<path d="([^"]+)"[^>]*stroke="#1971c2"/g)].map(match => match[1])
      const entries = rays.filter(path => !path.startsWith('M310 ')).map(path => path.split(' L')[1])
      expect(entries).toEqual(['310 210', '310 130'])
      expect(html.includes('stroke-dasharray="7 6"')).toBe(objectDistance < .1)
    }
  })
})

describe('作図アニメーションの科学的な区別', () => {
  const input = { focalLength: .1, objectDistance: .075, objectHeight: .002 }
  it('虚像は実線を描いた後に延長をたどり、交点まで到達してから表示する', () => {
    const before = renderToStaticMarkup(<LensDiagram input={input} progress={.7} />)
    const extending = renderToStaticMarkup(<LensDiagram input={input} progress={.85} />)
    const complete = renderToStaticMarkup(<LensDiagram input={input} progress={1} />)
    expect(before).not.toContain('>Aの像<')
    expect(extending).not.toContain('>Aの像<')
    expect(complete).toContain('>Aの像<')
    for (const html of [before, extending, complete]) {
      // The growing backward extension remains dashed, with no physical-direction arrow.
      const extensions = [...html.matchAll(/<path[^>]*stroke="#7048a5"[^>]*>/g)]
      expect(extensions).toHaveLength(2)
      for (const [path] of extensions) {
        expect(path).toContain('stroke-dasharray="7 6"')
        expect(path).not.toContain('marker-end')
      }
      expect(html).not.toMatch(/(?:NaN|Infinity)/)
    }
  })
  it('スクリーンで実線が止まり、仮想の像の目印と受け止める面を区別する', () => {
    const html = renderToStaticMarkup(<LensDiagram input={{ ...input, objectDistance: .15 }} screen={.2} />)
    const outgoing = [...html.matchAll(/<path d="(M310 [^"]+)"[^>]*pathLength="1"[^>]*stroke="#1971c2"/g)].map(match => match[1])
    expect(outgoing).toHaveLength(2)
    for (const path of outgoing) expect(path).toMatch(/ L396 /)
    expect(html).toContain('>Aの像<')
    expect(html).toContain('>スクリーン<')
  })
  it('虫めがねのAとBはそれぞれ目へ届き、延長の交点は同じ像の面の別々の点になる', () => {
    const html = renderToStaticMarkup(<LensDiagram input={input} secondPoint />)
    const outgoing = [...html.matchAll(/<path d="(M310 [^"]+)"[^>]*pathLength="1"[^>]*stroke="(?:#1971c2|#d9480f)"/g)].map(match => match[1]!)
    expect(outgoing).toHaveLength(4)
    // Both object points send one ray to each edge of the same pupil at x=40 cm.
    outgoing.forEach((path, i) => {
      const [x, y] = path.split(' L')[1]!.split(' ').map(Number)
      expect(x).toBeCloseTo(482)
      expect(y).toBeCloseTo(i % 2 === 0 ? 232.4 : 219.6)
    })
    const extensions = [...html.matchAll(/<path d="([^"]+)"[^>]*stroke="(?:#7048a5|#d9480f)"[^>]*stroke-dasharray="7 6"/g)].map(match => match[1]!)
    expect(extensions).toHaveLength(4)
    extensions.forEach((path, i) => {
      const [x, y] = path.split(' L')[1]!.split(' ').map(Number)
      expect(x).toBeCloseTo(181) // left 30 cm for both A and B
      expect(y).toBeCloseTo(i < 2 ? 170 : 42) // B on the axis; A 8 mm above it
    })
    expect(html).toContain('>Aの像<')
    expect(html).toContain('>Bの像<')
  })
  it('虚像の二点の目印も完成時だけ表示し、焦点では有限の像の高さを示さない', () => {
    for (const progress of [0, .7, .85]) {
      const html = renderToStaticMarkup(<LensDiagram input={input} secondPoint progress={progress} />)
      expect(html).not.toContain('>Bの像<')
    }
    const html = renderToStaticMarkup(<LensDiagram input={{ ...input, objectDistance: .1 }} secondPoint fixedEntry screen={.2} />)
    expect(html).not.toContain('>Aの像<')
    expect(html).not.toContain('>Bの像<')
  })
})
