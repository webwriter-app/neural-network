import { createContext } from '@lit-labs/context'
import { CLayerConf } from '@/components/network/c_layer_conf'

export const layerConfsContext = createContext<CLayerConf[]>('layer-confs')

/* related functions
  addLayer: (layer: CLayerConf) => void
  removeLayer: (layerId: number) => void
*/
