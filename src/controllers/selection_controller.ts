import type { ReactiveController } from 'lit'
import type { WwDeepLearning } from '@/app'
import type { CLayer } from '@/components/network/c_layer'
import type { Neuron } from '@/components/network/neuron'
import type { CEdge } from '@/components/network/c_edge'
import type { Selected } from '@/types/selected'
import type { SelectedEle } from '@/types/selected_ele'

export class SelectionController implements ReactiveController {
  host: WwDeepLearning

  constructor(host: WwDeepLearning) {
    this.host = host
    host.addController(this)
  }

  // HOST LIFECYCLE  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  hostConnected() {
    // add event listeners for selection related events on host
    this.host.renderRoot.addEventListener('unselect', (_e: Event) =>
      this.unselect()
    )
    this.host.renderRoot.addEventListener(
      'select-layer',
      (e: CustomEvent<string>) => this.selectLayer(e.detail)
    )
    this.host.renderRoot.addEventListener(
      'select-neuron',
      (e: CustomEvent<string>) => this.selectNeuron(e.detail)
    )
    this.host.renderRoot.addEventListener(
      'select-edge',
      (e: CustomEvent<string>) => this.selectEdge(e.detail)
    )
    this.host.renderRoot.addEventListener(
      'selected-ele-rendered',
      (e: CustomEvent<CLayer | Neuron | CEdge>) =>
        this.selectedEleRendered(e.detail)
    )
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // unselects the current selection
  unselect() {
    const newSelected: Selected = {}
    this.host.selected = newSelected
    this.host.selectedEle = undefined
  }

  // selects a layer by storing its cyID
  selectLayer(layer: string) {
    const newSelected: Selected = {}
    newSelected['layer'] = layer
    this.host.selected = newSelected
    this.host.selectedEle = undefined
  }

  // selects a neuron by storing its cyID
  selectNeuron(neuron: string) {
    const newSelected: Selected = {}
    newSelected['neuron'] = neuron
    this.host.selected = newSelected
    this.host.selectedEle = undefined
  }

  // selects an edge by storing its cyID
  selectEdge(edge: string) {
    const newSelected: Selected = {}
    newSelected['edge'] = edge
    this.host.selected = newSelected
    this.host.selectedEle = undefined
  }

  // this function is called when the selected element was (re)-rendered. Due to
  // the architecture of the network component, a different component might have
  // been rendered even though no new selection took place
  selectedEleRendered(ele: SelectedEle) {
    const previousSelected: SelectedEle = this.host.selectedEle
    this.host.selectedEle = ele

    // select the element visually on the canvas
    const cyEle = this.host.canvas.cy.getElementById(ele.getCyId())
    if (cyEle.length) {
      cyEle.select()
    }

    // open the corresponding panel only if the selection just happened (previous selected element is undefined, see methods above)
    if (!previousSelected) {
      ele.openCorrespondingPanel()
    }
  }
}
