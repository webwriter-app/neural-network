import { DataSetInput } from '@/types/data_set_input'
import { DataSetLabel } from '@/types/data_set_label'

export interface DataSet {
  // information about the dataSet
  name: string
  description: string
  type: 'regression' | 'classification'

  // formal description of input and labels, not the data
  inputs: DataSetInput[]
  label: DataSetLabel

  // data
  data: Array<{
    inputs: number[]
    label: number
  }>
}

interface HasDataSet {
  dataSet: DataSet
}

// OPENING - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
export const predefinedDataSetOptions = [
  {
    name: 'Boston House Pricing',
    configPath: '/data_set/boston/config.json',
    dataPath: '/data_set/boston/data.txt',
  },
  {
    name: 'Pima Indians Diabetes',
    configPath: '/data_set/diabetes/config.json',
    dataPath: '/data_set/diabetes/data.txt',
  },
]

// UTILITY FUNCTIONS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// -> INPUT CONF - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
export function getDataSetInputsByKeys(keys: string[]): DataSetInput[] {
  return (<HasDataSet>this).dataSet.inputs.filter((input: DataSetInput) =>
    keys.includes(input.key)
  )
}

export function getDataSetInputByKey(key: string): DataSetInput {
  const input = (<HasDataSet>this).dataSet.inputs.find(
    (input: DataSetInput) => input.key == key
  )
  return input
}

// -> GETTING DATA - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
export function getData(): Array<{
  inputs: number[]
  label: number
}> {
  return (<HasDataSet>this).dataSet.data
}

export function getInputDataByKeys(keys: string[]): number[][] {
  // get the indizes for the data that belongs to the layer
  const desiredIndizes = []
  for (const [index, input] of (<HasDataSet>this).dataSet.inputs.entries()) {
    if (keys.includes(input.key)) desiredIndizes.push(index)
  }

  // filter the data
  const inputData = (<HasDataSet>this).dataSet.data.map(({ inputs }) =>
    inputs.filter((_input, index) => desiredIndizes.includes(index))
  )
  return inputData
}

export function getLabelData(): number[] {
  return (<HasDataSet>this).dataSet.data.map(({ label }) => label)
}
