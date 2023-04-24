import { LitElementWw } from "@webwriter/lit"
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import networkState from "@/state/network_state";

import DenseLayer from "@/network/dense_layer";
import Layer from "@/network/layer";

@customElement('canvas-add-layer-card')
class CanvasAddLayerCard extends LitElementWw {

  @property() layer: Layer | null

  _handleDuplicateLayer(e) {
    console.log(this.layer)
    const duplicatedLayer = this.layer.duplicate()
    networkState.getNet().addLayer(duplicatedLayer)
  }

  _handleAddDenseLayer(e) {
    let layer = new DenseLayer({})
    networkState.getNet().addLayer(layer)
  }

  render(){
    return html`
      <c-card>
        <div slot="title">
          <sl-tooltip content="For maximum editing flexability, you can manually add layers. After adding a layer you can click on it in the graph to specify its input and output layer(s)">
            Add new layers <sl-icon name="question-circle"></sl-icon>
          </sl-tooltip>
        </div>
        <div slot="content">
          ${this.layer
            ? html`<sl-button @click="${this._handleDuplicateLayer}" outline>Duplicate selected layer</sl-button>`
            : html``
          }
          <sl-button @click="${this._handleAddDenseLayer}">Add dense Layer</sl-button>
        </div>
      </c-card>
    `;
  }
}