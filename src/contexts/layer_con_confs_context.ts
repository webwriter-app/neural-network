import { createContext } from '@lit/context'
import { CLayerConnectionConf } from '@/types/c_layer_connection_conf'

export const layerConnectionConfsContext = createContext<
  CLayerConnectionConf[]
>('layer-connection-confs')
