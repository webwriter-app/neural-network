import { createContext } from '@lit-labs/context'
import { CLayerConnectionConf } from '@/components/network/c_layer_connection_conf'

export const layerConnectionConfsContext = createContext<
  CLayerConnectionConf[]
>('layer-connection-confs')

/* related functions
  addLayerConnection: (source: number, target: number) => void
  removeLayerConnection: (source: number, target: number) => void
*/
