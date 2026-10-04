import { readFileSync, readdirSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const experiments = fileURLToPath(new URL('../src/experiments/', import.meta.url))
const lessons = readdirSync(experiments, { recursive: true, encoding: 'utf8' })
  .filter(path => basename(path) === 'LessonPage.tsx')
  .map(path => join(dirname(path), 'lesson.md'))
  .sort()

const designTables = [
  { heading: '## 概念の導入', columns: ['概念', '名前を付ける前に見るもの', '図で指す対象', '混同を避ける比較'] },
  { heading: '## 観察と説明の流れ', columns: ['場面', '注目する対象', '観察と操作', 'ここで分かる関係'] },
] as const

describe('全教材に概念の導入と観察の設計を残す', () => {
  it('教材を自動で見つける', () => {
    expect(lessons.length).toBeGreaterThan(0)
  })

  it.each(lessons)('%s：設計表があり、空欄や未記入を残さない', path => {
    // This checks omissions in the author's plan, not prose quality or learning outcomes.
    const markdown = readFileSync(join(experiments, path), 'utf8')
    expect(markdown, `${path}：テンプレートを具体的な設計に置き換える`).not.toMatch(/要記入：|\b(?:TODO|TBD)\b/i)
    const lines = markdown.split(/\r?\n/)
    for (const { heading, columns } of designTables) {
      const start = lines.findIndex(line => line.trim() === heading)
      expect(start, `${path}：${heading} が必要`).toBeGreaterThan(-1)
      const next = lines.findIndex((line, index) => index > start && /^##\s/.test(line))
      const rows = lines.slice(start + 1, next === -1 ? undefined : next)
        .filter(line => line.trim().startsWith('|') && line.trim().endsWith('|'))
        .map(line => line.trim().slice(1, -1).split(/(?<!\\)\|/).map(cell => cell.trim()))
      expect(rows[0], `${path}：${heading} の列をテンプレートとそろえる`).toEqual([...columns])
      expect(rows[1], `${path}：表の区切り行の列をそろえる`).toHaveLength(columns.length)
      expect(rows[1]?.every(cell => /^:?-{3,}:?$/.test(cell)), `${path}：表の区切り行が必要`).toBe(true)
      const entries = rows.slice(2)
      expect(entries.length, `${path}：${heading} に具体的な設計を記す`).toBeGreaterThan(0)
      for (const cells of entries) {
        expect(cells, `${path}：設計表の列が不足`).toHaveLength(columns.length)
        expect(cells.every(cell => cell.length > 0), `${path}：設計表の空欄を埋める`).toBe(true)
      }
    }
  })
})
