import { CLayer } from '@/components/network/c_layer'

export interface DataSetLabel {
  type: string
  key: string
  description: string
  layer?: CLayer
}
