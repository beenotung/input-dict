import { proxySchema } from 'better-sqlite3-proxy'
import { db } from './db'

export type Word = {
  id?: number | null
  char: string
}

export type DBProxy = {
  word: Word[]
}

export let proxy = proxySchema<DBProxy>({
  db,
  tableFields: {
    word: [],
  },
})
