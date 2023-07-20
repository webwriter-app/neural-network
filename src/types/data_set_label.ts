import { CLayer } from '@/components/network/c_layer'

export interface DataSetLabel {
  key: string
  description: string
  layer?: CLayer
  // classes only for label in classification dataset
  classes?: Array<{
    key: string
    description: string
  }>
}
