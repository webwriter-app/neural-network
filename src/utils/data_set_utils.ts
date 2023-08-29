import type { DataSet } from '@/types/data_set'
import type { DataSetInput } from '@/types/data_set_input'

export class DataSetUtils {
  static getDataSetInputsByKeys(
    dataSet: DataSet,
    keys: string[]
  ): DataSetInput[] {
    return dataSet.inputs.filter((input: DataSetInput) =>
      keys.includes(input.key)
    )
  }

  static getDataSetInputByKey(dataSet: DataSet, key: string): DataSetInput {
    const input = dataSet.inputs.find((input: DataSetInput) => input.key == key)
    return input
  }

  static getData(dataSet: DataSet): Array<{
    inputs: number[]
    label: number
  }> {
    return dataSet.data
  }

  static getInputDataByKeys(dataSet: DataSet, keys: string[]): number[][] {
    // get the indizes for the data that belongs to the layer
    const desiredIndizes = []
    for (const [index, input] of dataSet.inputs.entries()) {
      if (keys.includes(input.key)) desiredIndizes.push(index)
    }

    // filter the data
    const inputData = dataSet.data.map(({ inputs }) =>
      inputs.filter((_input, index) => desiredIndizes.includes(index))
    )
    return inputData
  }

  static getLabelData(dataSet: DataSet): number[] {
    return dataSet.data.map(({ label }) => label)
  }
}
