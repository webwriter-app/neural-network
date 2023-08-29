import { createContext } from '@lit-labs/context'
import { CLayerConnectionConf } from '@/types/c_layer_connection_conf'

export const layerConnectionConfsContext = createContext<
  CLayerConnectionConf[]
>('layer-connection-confs')
