import { ActivationOption } from '@/components/network/activation'
import { Position } from '@/types/position'

export interface CLayerConf {
  // html tag
  HTML_TAG: string
  // a type and description that is displayed as an info for the layer
  LAYER_TYPE: string
  LAYER_NAME: string
  // layer id
  layerId: number
  // activation
  activation: ActivationOption
  // position
  pos: Position
}
