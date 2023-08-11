import { createContext } from '@lit-labs/context'
import type { WwDeepLearning } from '@/app'

// layer/neuron/edge represent the cyId of the element, ele the actual element
// (which will be added later after first render as selected)
export interface Selected {
  layer?: string
  neuron?: string
  edge?: string
}
export const selectedContext = createContext<Selected>('selected')

export function unselect() {
  const newSelected: Selected = {}
  ;(<WwDeepLearning>this).selected = newSelected
  ;(<WwDeepLearning>this).selectedEle = undefined
}

export function selectLayer(layer: string) {
  const newSelected: Selected = {}
  newSelected['layer'] = layer
  ;(<WwDeepLearning>this).selected = newSelected
  ;(<WwDeepLearning>this).selectedEle = undefined
}

export function selectNeuron(neuron: string) {
  const newSelected: Selected = {}
  newSelected['neuron'] = neuron
  ;(<WwDeepLearning>this).selected = newSelected
  ;(<WwDeepLearning>this).selectedEle = undefined
}

export function selectEdge(edge: string) {
  const newSelected: Selected = {}
  newSelected['edge'] = edge
  ;(<WwDeepLearning>this).selected = newSelected
  ;(<WwDeepLearning>this).selectedEle = undefined
}
