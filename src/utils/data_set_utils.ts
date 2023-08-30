import type { DataSet } from '@/types/data_set'
import type { FeatureDesc } from '@/types/feature_desc'
import { bostonHousePricing } from '@/utils/data_sets/boston'
import { pimaIndiansDiabetes } from '@/utils/data_sets/diabetes'

// The DataSetUtils class provides static methods to retrieve data for specific
// queries as well as static properties for the default (available) data set(s)
export class DataSetUtils {
  static defaultDataSet = bostonHousePricing
  static defaultAvailableDataSets = [bostonHousePricing, pimaIndiansDiabetes]

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
  static getDataSetInputByKey(dataSet: DataSet, key: string): FeatureDesc {
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
    const desiredIndizes = []
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
