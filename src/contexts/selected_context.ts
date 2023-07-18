import { createContext } from '@lit-labs/context'
import { CLayer } from '@/components/network/c_layer'
import { Neuron } from '@/components/network/neuron'
import { Edge } from '@/components/network/edge'

export interface Selected {
  layer?: CLayer
  neuron?: Neuron
  edge?: Edge
  select: ({
    layer,
    neuron,
    edge,
  }?: {
    layer?: CLayer
    neuron?: Neuron
    edge?: Edge
  }) => void
}
export const selectedContext = createContext<Selected>('selected')
