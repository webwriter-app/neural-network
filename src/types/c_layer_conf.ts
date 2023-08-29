import type { Activation } from '@/types/activation'
import type { Position } from '@/types/position'

export interface CLayerConf {
  // html tag
  HTML_TAG: string
  // a type and description that is displayed as an info for the layer
  LAYER_TYPE: string
  LAYER_NAME: string
  // layer id
  layerId: number
  // activation
  activation: Activation
  // position
  pos: Position
  // firstSpawn: if true, the layer spawns an alert about its creation when it
  // is connected and then sets it to false
  firstSpawn: boolean
}
