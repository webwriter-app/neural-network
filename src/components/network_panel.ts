import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'

import './cards/network_graph_card'
import './cards/network_layer_card'

import net from '../network/net'

@customElement('network-panel')
class NetworkPanel extends LitElementWw {

  @state()
  private _net = net
  @state()
  private _selectedLayer = null
  @state()
  private _selectedNeuron = null

  static styles = css`
    .network-panel {
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  `

getAdditionalCards() {
  if (this._selectedLayer) {
    return html`
      <network-layer-card 
        .net = "${this._net}"
        .selectedLayer = "${this._selectedLayer}"
      ></network-layer-card>
    `
  } else if (this._selectedNeuron) {
    return html`
      Selected Neuron
    `
  } else {
    return html`` // no additional card
  }
}
_handleAddLayerBefore(e) {
  this._net.insertLayer({before: this._selectedLayer})
}
_handleAddLayerAfter(e) {
  this._net.insertLayer({after: this._selectedLayer})
}
_handleAddNeuron(e) {
  this._net.addNeuronToLayer(this._selectedLayer)
}

  render(){
    return html`
      <div class="network-panel">
        <h1>Network</h1>
        <network-graph-card
          .net = "${this._net}"
          @selected-layer="${(e) => { this._selectedLayer = e.detail.id; this._selectedNeuron = null }}"
          @selected-neuron="${(e) => { this._selectedLayer = null; this._selectedNeuron = e.detail.id }}"
          @deselected="${(e) => { this._selectedLayer = null; this._selectedNeuron = null }}"
        ></network-graph-card>
        ${this.getAdditionalCards()}
      </div>
    `;
  }
}