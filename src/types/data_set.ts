import type { FeatureDesc } from '@/types/feature_desc'
import type { LabelDesc } from '@/types/label_desc'

export interface DataSet {
  // information about the dataSet
  name: string
  description: string
  type: 'regression' | 'classification'

  // formal description of features and labels
  featureDescs: FeatureDesc[]
  labelDesc: LabelDesc

  // data (features and labels)
  data: Array<{
    features: number[]
    label: number
  }>
}
