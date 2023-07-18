import { createContext } from '@lit-labs/context'
import { Network } from '@/components/network/network'
import { CLayer } from '@/components/network/c_layer'
import { CLayerConnection } from '@/components/network/c_layer_connection'

export interface NetworkConf {
  // layers: map having the layer id as a key and the layer itself as the value
  layers: Map<number, CLayer>
  addLayer: (layer: CLayer) => void
  removeLayer: (layerId: number) => void

  // layer connections: map having the layer ids of the connected layers as a
  // key
  layerConnections: Map<[number, number], CLayerConnection>
  addLayerConnection: (layerConnection: CLayerConnection) => void
  removeLayerConnection: ([sourceLayerId, targetLayerId]: [
    sourceLayerId: number,
    targetLayerId: number
  ]) => void

  // the network component for rendering and advanced managing
  network: Network
}

export const networkConfContext = createContext<NetworkConf>('network-conf')
