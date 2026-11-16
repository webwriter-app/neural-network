import type { MsgFn } from "@lit/localize"
import type { DataSet } from '../../model/data-types'
import type { FeatureDesc } from '../../model/data-types'
import { bostonHousePricing } from './boston'
import { pimaIndiansDiabetes } from './diabetes'

// The DataSetUtils class provides static methods to retrieve data for specific
// queries as well as static properties for the default (available) data set(s)
export class DataSetUtils {
  static defaultDataSet = bostonHousePricing
  static defaultAvailableDataSets = [bostonHousePricing, pimaIndiansDiabetes]

  // The built-in data sets hold no rows until they are needed. A data set that
  // already has rows, or is not built in, is returned as it is.
  static async loadData(dataSet: DataSet): Promise<DataSet> {
    if (dataSet.data.length > 0) return dataSet
    let rows: number[][]
    if (dataSet.name === bostonHousePricing.name) {
      rows = (await import('../../assets/boston-data.json')).default
    } else if (dataSet.name === pimaIndiansDiabetes.name) {
      rows = (await import('../../assets/diabetes-data.json')).default
    } else {
      return dataSet
    }
    return {
      ...dataSet,
      data: rows.map((row) => ({ features: row.slice(0, -1), label: row[row.length - 1] })),
    }
  }

  // Keep stored data and dataset identifiers intact while translating built-in labels.
  static localizeText(dataSet: DataSet, text: string, msg: MsgFn): string {
    const builtin = this.defaultAvailableDataSets.find(({ name }) => name === dataSet.name)
    if (!builtin) return text
    const known = text === builtin.name || text === builtin.description ||
      builtin.featureDescs.some(({ description }) => description === text) ||
      text === builtin.labelDesc.description ||
      builtin.labelDesc.classes?.some(({ description }) => description === text)
    // Built-in strings are extracted from the source datasets themselves.
    return known ? (msg as (text: string) => string)(text) : text
  }

  // get features of a data set (key and description) by their keys
  static getFeatureDescsByKeys(
    dataSet: DataSet,
    keys: string[]
  ): FeatureDesc[] {
    return dataSet.featureDescs.filter((featureDesc: FeatureDesc) =>
      keys.includes(featureDesc.key)
    )
  }

  // get a single feature of a data set (key and description) by the key
  static getDataSetInputByKey(dataSet: DataSet, key: string): FeatureDesc | undefined {
    const featureDesc = dataSet.featureDescs.find(
      (featureDesc: FeatureDesc) => featureDesc.key == key
    )
    return featureDesc
  }

  // get the data of the data set
  static getData(dataSet: DataSet): Array<{
    features: number[]
    label: number
  }> {
    return dataSet.data
  }

  // get the feature data
  static getFeatureDataByKeys(dataSet: DataSet, keys: string[]): number[][] {
    // get the indices for the data that belongs to the layer
    const desiredIndizes: number[] = []
    for (const [index, featureDesc] of dataSet.featureDescs.entries()) {
      if (keys.includes(featureDesc.key)) desiredIndizes.push(index)
    }

    // filter the data
    const featureData = this.getData(dataSet).map(({ features }) =>
      features.filter((_feature, index) => desiredIndizes.includes(index))
    )
    return featureData
  }

  static getLabelData(dataSet: DataSet): number[] {
    return dataSet.data.map(({ label }) => label)
  }
}
