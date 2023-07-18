import { CLayer } from '@/components/network/c_layer'
import { Neuron } from '@/components/network/neuron'

export type Edge = {
  sourceLayer: CLayer
  sourceNeuron?: Neuron
  targetLayer: CLayer
  targetNeuron?: Neuron
}
