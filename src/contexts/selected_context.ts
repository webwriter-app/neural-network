import { createContext } from '@lit-labs/context'
import { CLayer } from '@/components/network/c_layer'
import { Neuron } from '@/components/network/neuron'
import { Edge } from '@/components/network/edge'
import type { WwDeepLearning } from '@/app'

export interface Selected {
  layer?: CLayer
  neuron?: Neuron
  edge?: Edge
}
export const selectedContext = createContext<Selected>('selected')

export function select({
  layer = null,
  neuron = null,
  edge = null,
}: { layer?: CLayer; neuron?: Neuron; edge?: Edge } = {}): void {
  const newSelected = {}
  if (neuron && layer) {
    newSelected['neuron'] = neuron
    newSelected['layer'] = layer
    ;(<WwDeepLearning>this).openPanel('neuron', 'right')
  } else if (layer) {
    newSelected['layer'] = layer
    ;(<WwDeepLearning>this).openPanel('layer', 'right')
  } else if (edge) {
    /* if(elm instanceof Edge) */
    newSelected['edge'] = edge
    ;(<WwDeepLearning>this).openPanel('edge', 'right')
  }
  ;(<WwDeepLearning>this).selected = newSelected
}
