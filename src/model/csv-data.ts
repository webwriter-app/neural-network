import type { DataSet } from './data-types'
import type { TensorConf } from './network-types'

export type Table = { columns: string[]; rows: (string | number | null)[][] }

/** The reasons a CSV text cannot become a data set. */
export class CsvError extends Error {
  constructor(readonly code: 'empty' | 'columns' | 'not-numeric', readonly line = 0) {
    super(code)
  }
}

const MAX_CLASSES = 10

/** Splits CSV text into rows of cells. Quoted cells may hold the delimiter, quotes and line breaks. */
export function parseCsv(text: string): string[][] {
  const source = text.replace(/^﻿/, '')
  const firstLine = source.split(/\r?\n/, 1)[0]
  const delimiter = [',', ';', '\t'].map((d) => [d, firstLine.split(d).length] as const).sort((a, b) => b[1] - a[1])[0][0]
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let quoted = false
  for (let i = 0; i < source.length; i++) {
    const char = source[i]
    if (quoted) {
      if (char === '"' && source[i + 1] === '"') { cell += '"'; i++ }
      else if (char === '"') quoted = false
      else cell += char
    } else if (char === '"') quoted = true
    else if (char === delimiter) { row.push(cell); cell = '' }
    else if (char === '\n' || char === '\r') {
      if (char === '\r' && source[i + 1] === '\n') i++
      row.push(cell); cell = ''
      rows.push(row); row = []
    } else cell += char
  }
  row.push(cell)
  rows.push(row)
  return rows.filter((cells) => cells.some((c) => c.trim() !== ''))
}

const isNumber = (cell: string) => cell.trim() !== '' && Number.isFinite(Number(cell))

/**
 * Reads a numeric table whose last column is the label. A header row names
 * the columns; without one they are x1 to xn and y. A label that holds the
 * whole numbers 0 to k-1 (2 <= k <= 10) makes a classification data set,
 * any other label a regression data set.
 */
export function csvToDataSet(text: string, name: string): DataSet {
  const rows = parseCsv(text)
  if (rows.length === 0) throw new CsvError('empty')
  const hasHeader = rows[0].some((cell) => !isNumber(cell))
  const header = hasHeader ? rows[0].map((cell) => cell.trim()) : undefined
  const body = hasHeader ? rows.slice(1) : rows
  const width = rows[0].length
  if (width < 2 || body.length === 0) throw new CsvError('empty')
  const data = body.map((cells, index) => {
    const line = index + (hasHeader ? 2 : 1)
    if (cells.length !== width) throw new CsvError('columns', line)
    if (!cells.every(isNumber)) throw new CsvError('not-numeric', line)
    const values = cells.map(Number)
    return { features: values.slice(0, -1), label: values[width - 1] }
  })
  const keys = header ?? [...Array.from({ length: width - 1 }, (_, i) => `x${i + 1}`), 'y']
  const labels = data.map(({ label }) => label)
  const classCount = Math.max(...labels) + 1
  const classification = labels.every((label) => Number.isInteger(label) && label >= 0) &&
    classCount >= 2 && classCount <= MAX_CLASSES &&
    new Set(labels).size === classCount
  const label = keys[width - 1]
  return {
    name,
    description: '',
    type: classification ? 'classification' : 'regression',
    featureDescs: keys.slice(0, -1).map((key) => ({ key, description: key })),
    labelDesc: {
      key: label,
      description: label,
      ...(classification ? { classes: Array.from({ length: classCount }, (_, id) => ({ id, description: String(id) })) } : {}),
    },
    data,
  }
}

const quote = (cell: string) => (/[",;\r\n]/.test(cell) ? `"${cell.replaceAll('"', '""')}"` : cell)

/** Writes a data set as CSV: the feature columns, then the label column, with a header row. */
export function dataSetToCsv(dataSet: DataSet): string {
  const header = [...dataSet.featureDescs.map(({ key }) => key), dataSet.labelDesc.key]
  const lines = dataSet.data.map(({ features, label }) => [...features, label].join(','))
  return [header.map(quote).join(','), ...lines].join('\n') + '\n'
}

/** A safe file name stem for a data set name. */
export const fileStem = (name: string) => name.trim().replace(/[^\p{L}\p{N}_-]+/gu, '-').replace(/^-+|-+$/g, '') || 'network'

type HistoryEntry = Record<string, number | undefined>

/** The training history as a table: one row per epoch, one column per metric that was logged. */
export function historyTable(history: readonly HistoryEntry[]): Table {
  const metrics = ['loss', 'val_loss', 'acc', 'val_acc'].filter((key) => history.some((entry) => typeof entry[key] === 'number'))
  return {
    columns: ['epoch', ...metrics],
    rows: history.map((entry, index) => [index + 1, ...metrics.map((key) => (typeof entry[key] === 'number' ? entry[key]! : null))]),
  }
}

/** The weights of the trained layers as plain arrays, by layer id. */
export function weightsOf(tensorConfs: ReadonlyMap<number, TensorConf> | undefined) {
  const out: Record<string, { weights?: number[]; bias?: number[] }> = {}
  for (const [id, { weights, bias }] of tensorConfs ?? []) {
    if (weights || bias) out[id] = { weights: weights && Array.from(weights), bias: bias && Array.from(bias) }
  }
  return out
}
