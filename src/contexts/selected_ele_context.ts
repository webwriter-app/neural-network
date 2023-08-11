import { createContext } from '@lit-labs/context'
import type { WwDeepLearning } from '@/app'
import { Neuron } from '@/network/neuron'
import { CLayer } from '@/network/c_layer'
import { CEdge } from '@/network/c_edge'

export type SelectedEle = CLayer | Neuron | CEdge

export const selectedEleContext = createContext<SelectedEle>('selected-ele')

export function selectedEleRendered(ele: CLayer | Neuron | CEdge) {
  const previousSelected = (<WwDeepLearning>this).selectedEle
  ;(<WwDeepLearning>this).selectedEle = ele
  const cyEle = (<WwDeepLearning>this).canvas.cy.getElementById(ele.getCyId())
  if (cyEle.length) {
    cyEle.select()
  }
  if (!previousSelected) {
    if (ele instanceof CLayer) {
      ;(<WwDeepLearning>this).openPanel('layer')
    } else if (ele instanceof Neuron) {
      ;(<WwDeepLearning>this).openPanel('neuron')
    } else if (ele instanceof CEdge) {
      ;(<WwDeepLearning>this).openPanel('edge')
    }
  }
}
