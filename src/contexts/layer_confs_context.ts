import { createContext } from '@lit-labs/context'
import { CLayerConf } from '@/components/network/c_layer_conf'
import type { WwDeepLearning } from '@/app'

export const layerConfsContext = createContext<CLayerConf[]>('layer-confs')

export function addLayer(layerConf: CLayerConf): void {
  ;(<WwDeepLearning>this).layerConfs.push(layerConf)
  ;(<WwDeepLearning>this).updateLayerConfs()
}

export function updateLayerConfs() {
  ;(<WwDeepLearning>this).layerConfs = [...(<WwDeepLearning>this).layerConfs]
}

export function removeLayer(layerId: number): void {
  const index = (<WwDeepLearning>this).layerConfs.findIndex((layerConf) => {
    return layerConf.layerId == layerId
  })
  if (index > -1) {
    ;(<WwDeepLearning>this).layerConfs.splice(index, 1)
    ;(<WwDeepLearning>this).updateLayerConfs()
  }
}
