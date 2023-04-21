import { LitElementWw } from "@webwriter/lit"
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { observeState } from 'lit-element-state';
import networkState from '@/state/network_state.js';

@customElement('layer-edit-card')
class LayerEditCard extends observeState(LitElementWw) {

  _handleAddNeuron(e) {
    let ffentity = networkState.net.getEntityByName(networkState.activeEntity)
    ffentity.addNeuronToLayer(networkState.activeLayer)
  }
  _handleAddLayer(e) {
    let ffentity = networkState.net.getEntityByName(networkState.activeEntity)
    ffentity.insertLayerAfter(networkState.activeLayer)
  }
  _handleDeleteLayer(e) {
    let ffentity = networkState.net.getEntityByName(networkState.activeEntity)
    ffentity.deleteLayer(networkState.activeLayer)
  }

  render(){
    return html`
      <c-card>
        <div slot="title">
          Edit layer
        </div>
        <div slot="content">
          <sl-button @click="${this._handleAddNeuron}" variant="primary">Add neuron</sl-button>
          <sl-button @click="${this._handleAddLayer}">Insert new layer after this layer</sl-button>
          ${networkState.activeLayer != 'input' 
            ? html`
              <sl-button @click="${this._handleDeleteLayer}" variant="danger">Delete layer</sl-button>
            ` 
            : html`
              <sl-button @click="${this._handleDeleteLayer}" variant="danger" disabled>Delete layer</sl-button>
            `
          }
        </div>
      </c-card>
    `;
  }
}