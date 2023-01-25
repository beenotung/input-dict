import fs from 'fs'
import path from 'path'

export function idToFile(id: number) {
  let parts = ['images', ...id.toString().split('')]
  let file = parts.join('/') + '.png'
  return file
}

let dirs = new Set<string>()

export function prepareDir(file: string) {
  let dir = path.dirname(file)
  if (dirs.has(dir)) return
  fs.mkdirSync(dir, { recursive: true })
  dirs.add(dir)
}
