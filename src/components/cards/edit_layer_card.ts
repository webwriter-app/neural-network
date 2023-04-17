import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { observeState } from 'lit-element-state';
import networkState from '@/state/network_state.js';

@customElement('edit-layer-card')
class EditLayerCard extends observeState(LitElementWw) {

  /* STYLES */
  static styles = css`

    #cytoscapeCanvasWrapper {
      height: 400px;
      width: calc(100% + 40px);
      resize: vertical;
      overflow: auto;
      margin: -20px;
    }

    #cytoscapeCanvas{
      height: calc(100% - 10px);
      width: 100%;
    }
  `

  _handleAddNeuron(e) {
    networkState.net.addNeuronToLayer(networkState.activeLayer)
  }
  _handleAddLayer(e) {
    networkState.net.insertLayerAfter(networkState.activeLayer)
  }
  _handleDeleteLayer(e) {
    networkState.net.deleteLayer(networkState.activeLayer)
  }

  render(){
    return html`
      <c-card>
        <div slot="title">
          ${networkState.activeEntity} • ${networkState.activeLayer} • Edit
        </div>
        <div slot="content">
          <sl-button @click="${this._handleAddNeuron}" variant="primary">Add neuron</sl-button>
          <sl-button @click="${this._handleAddLayer}">Insert new layer after this layer</sl-button>
          ${networkState.activeLayer != 'inputLayer' 
            ? html`
              <sl-button @click="${this._handleDeleteLayer}" variant="danger">Delete layer</sl-button>
            ` 
            : html``
          }
        </div>
      </c-card>
    `;
  }
}