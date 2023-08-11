import { createContext } from '@lit-labs/context'
import { Network } from '@/network/network'
import type { WwDeepLearning } from '@/app'

export const networkContext = createContext<Network>('network')

// reset the network by resetting the network conf
export function clearNetwork() {
  // deselect the currently selected element since it will be removed
  ;(<WwDeepLearning>this).unselect()

  // empty the network
  ;(<WwDeepLearning>this).layerConnectionConfs = []
  ;(<WwDeepLearning>this).layerConfs = []
}
