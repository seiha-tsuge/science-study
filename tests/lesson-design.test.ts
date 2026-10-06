import { readFileSync, readdirSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const experiments = fileURLToPath(new URL('../src/experiments/', import.meta.url))
const template = fileURLToPath(new URL('../docs/templates/lesson.md', import.meta.url))
const lessons = readdirSync(experiments, { recursive: true, encoding: 'utf8' })
  .filter(path => basename(path) === 'lesson-page.tsx')
  .map(path => join(dirname(path), 'lesson.md'))
  .sort()

const designTables = [
  {
    heading: '## 身近な感覚から概念への橋渡し',
    columns: ['身近な場面', 'そこで見える関係', '新しく理解する対象', '図と操作で保つ対応', '対応しない点と限界', '元の現象への戻り方'],
  },
  { heading: '## 概念の導入', columns: ['概念', '名前を付ける前に見るもの', '図で指す対象', '混同を避ける比較'] },
  { heading: '## 観察と説明の流れ', columns: ['場面', '注目する対象', '観察と操作', 'ここで分かる関係', '図と説明、操作の配置', '切り替え時の状態'] },
  { heading: '## 今回理解すること', columns: ['身近な行為', 'そこで起きていること', '理解する関係', '扱う範囲'] },
] as const

// This checks omissions in the author's plan, not prose quality or learning outcomes.
function assertDesignTables(markdown: string, path: string) {
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
}

function assertLessonDesign(markdown: string, path: string) {
  expect(markdown, `${path}：テンプレートを具体的な設計に置き換える`).not.toMatch(/要記入：|\b(?:TODO|TBD)\b/i)
  assertDesignTables(markdown, path)
}

function tableRowIndex(lines: string[], heading: string, offset: number) {
  const start = lines.indexOf(heading)
  const next = lines.findIndex((line, index) => index > start && /^##\s/.test(line))
  const indices = lines.map((line, index) => ({ line, index }))
    .filter(({ line, index }) => index > start && (next === -1 || index < next) && line.startsWith('|'))
    .map(({ index }) => index)
  return indices[offset]
}

describe('全教材に理解のゴール・橋渡し・概念の導入・観察の設計を残す', () => {
  it('教材を自動で見つける', () => {
    expect(lessons.length).toBeGreaterThan(0)
  })

  it('新規教材のテンプレートも同じ設計表を持つ', () => {
    // The template contains prompts; only completed lesson plans must resolve them.
    assertDesignTables(readFileSync(template, 'utf8'), template)
  })

  it.each(lessons)('%s：設計表があり、空欄や未記入を残さない', path => {
    assertLessonDesign(readFileSync(join(experiments, path), 'utf8'), path)
  })
})

describe('説明と操作の設計を省略した教材を検出する', () => {
  const example = readFileSync(join(experiments, 'mechanics/motion/lesson.md'), 'utf8')
  const heading = designTables[0].heading

  it.each(designTables)('$heading の表がない場合を検出する', table => {
    const missing = example.replace(table.heading, '## 別の節')
    expect(() => assertLessonDesign(missing, '表の欠落')).toThrow(/が必要/)
  })

  it.each(['図と説明、操作の配置', '切り替え時の状態'] as const)('%sの空欄を検出する', column => {
    const table = designTables[2]
    const lines = example.split('\n')
    const rowIndex = tableRowIndex(lines, table.heading, 2)
    const cells = lines[rowIndex].split('|')
    cells[table.columns.indexOf(column) + 1] = ' '
    lines[rowIndex] = cells.join('|')
    expect(() => assertLessonDesign(lines.join('\n'), '不正な教材')).toThrow(/空欄/)
  })

  it.each(designTables[3].columns)('理解のゴールの%sが空欄なら検出する', column => {
    const table = designTables[3]
    const lines = example.split('\n')
    const rowIndex = tableRowIndex(lines, table.heading, 2)
    const cells = lines[rowIndex].split('|')
    cells[table.columns.indexOf(column) + 1] = ' '
    lines[rowIndex] = cells.join('|')
    expect(() => assertLessonDesign(lines.join('\n'), '不正な教材')).toThrow(/空欄/)
  })

  it('配置と状態の記録がない旧形式の表を検出する', () => {
    const table = designTables[2]
    const lines = example.split('\n')
    const headerIndex = tableRowIndex(lines, table.heading, 0)
    const cells = lines[headerIndex].split('|')
    lines[headerIndex] = `${cells.slice(0, 5).join('|')}|`
    expect(() => assertLessonDesign(lines.join('\n'), '旧形式')).toThrow(/列をテンプレートとそろえる/)
  })

  it.each(['図と操作で保つ対応', '対応しない点と限界', '元の現象への戻り方'] as const)('%sの空欄を検出する', column => {
    const lines = example.split('\n')
    const rowIndex = tableRowIndex(lines, heading, 2)
    const cells = lines[rowIndex].split('|')
    cells[designTables[0].columns.indexOf(column) + 1] = ' '
    lines[rowIndex] = cells.join('|')
    expect(() => assertLessonDesign(lines.join('\n'), '不正な教材')).toThrow(/空欄/)
  })

  it('テンプレートの未記入を検出する', () => {
    const unfinished = example.replace('まっすぐな道を同じペースで進む', '要記入：図で示す場面')
    expect(() => assertLessonDesign(unfinished, '未記入')).toThrow(/具体的な設計/)
  })
})
