import { proxy, Word } from './proxy'
import { db } from './db'

export function hasWordById(id: number) {
  return id in proxy.word
}

export function storeWord(id: number, word: Word) {
  proxy.word[id] = word
}

export function countWords() {
  return proxy.word.length
}

let select_max_id = db.prepare(/* sql */ `select max(id) from word`).pluck()
export function getMaxId() {
  return select_max_id.get() || 0
}
