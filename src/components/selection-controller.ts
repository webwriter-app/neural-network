import type { ReactiveController } from 'lit'
import { listen } from './listen'
import type { WebwriterNeuralNetwork } from '../widgets/webwriter-neural-network'
import type { CLayer } from './network/c-layer'
import type { CNeuron } from './network/neuron'
import type { CEdge } from './network/c-edge'
import type { Selected } from '../model/app-types'
import type { SelectedEle } from '../model/app-types'

export class SelectionController implements ReactiveController {
  host: WebwriterNeuralNetwork

  constructor(host: WebwriterNeuralNetwork) {
    this.host = host
    host.addController(this)
  }

  // HOST LIFECYCLE  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  private abort = new AbortController()

  hostConnected() {
    this.abort = new AbortController()
    // add event listeners for selection related events on host
    listen(this.host.renderRoot, 'unselect', () =>
      this.unselect(), this.abort.signal)
    listen<string>(this.host.renderRoot, 'select-layer', (e) => this.selectLayer(e.detail), this.abort.signal)
    listen<string>(this.host.renderRoot, 'select-neuron', (e) => this.selectNeuron(e.detail), this.abort.signal)
    listen<string>(this.host.renderRoot, 'select-edge', (e) => this.selectEdge(e.detail), this.abort.signal)
    listen<CLayer | CNeuron | CEdge>(this.host.renderRoot, 'selected-ele-rendered', (e) =>
        this.selectedEleRendered(e.detail), this.abort.signal)
  }

  hostDisconnected() {
    this.abort.abort()
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
    const previousSelected: SelectedEle | undefined = this.host.selectedEle
    this.host.selectedEle = ele

    // open the corresponding panel only if the selection just happened (previous selected element is undefined, see methods above)
    if (!previousSelected) {
      ele.openCorrespondingPanel()
    }
  }
}
