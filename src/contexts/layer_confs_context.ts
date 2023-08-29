import { createContext } from '@lit-labs/context'
import { CLayerConf } from '@/types/c_layer_conf'

export const layerConfsContext = createContext<CLayerConf[]>('layer-confs')
