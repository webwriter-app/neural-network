import { createContext } from '@lit-labs/context'
import { CLayerConnectionConf } from '@/network/c_layer_connection_conf'
import type { WwDeepLearning } from '@/app'

export const layerConnectionConfsContext = createContext<
  CLayerConnectionConf[]
>('layer-connection-confs')

export function addLayerConnection(source: number, target: number): void {
  const layerConnectionConf: CLayerConnectionConf = {
    sourceLayerId: source,
    targetLayerId: target,
  }
  ;(<WwDeepLearning>this).layerConnectionConfs.push(layerConnectionConf)
  ;(<WwDeepLearning>this).layerConnectionConfs = [
    ...(<WwDeepLearning>this).layerConnectionConfs,
  ]
}

export function removeLayerConnection(source: number, target: number): void {
  const index = (<WwDeepLearning>this).layerConnectionConfs.findIndex(
    (layerConnectionConf) => {
      return (
        layerConnectionConf.sourceLayerId == source &&
        layerConnectionConf.targetLayerId == target
      )
    }
  )
  if (index > -1) {
    ;(<WwDeepLearning>this).layerConnectionConfs.splice(index, 1)
    ;(<WwDeepLearning>this).layerConnectionConfs = [
      ...(<WwDeepLearning>this).layerConnectionConfs,
    ]
  }
}
