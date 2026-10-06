import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const source = fileURLToPath(new URL('../src/', import.meta.url))
// TanStack Router discovers its root route by this fixed name.
const fixedNames = new Set(['routes/__root.tsx'])
const directoryName = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const fileName = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\.(?:test|spec|d|gen))?\.[a-z0-9]+$/

function invalidNames(directory: string, prefix = ''): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const relative = prefix + entry.name
    if (entry.isDirectory()) {
      return [
        ...(directoryName.test(entry.name) ? [] : [relative]),
        ...invalidNames(directory + '/' + entry.name, relative + '/'),
      ]
    }
    return fileName.test(entry.name) || fixedNames.has(relative) ? [] : [relative]
  })
}

describe('srcのファイルとディレクトリの命名', () => {
  it('TanStackの固定名以外は小文字ハイフン区切りと意味のある接尾辞を使う', () => {
    expect(invalidNames(source)).toEqual([])
  })
})
