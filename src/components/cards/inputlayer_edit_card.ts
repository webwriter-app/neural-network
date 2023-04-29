import { LitElementWw } from "@webwriter/lit"
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { StateController } from "@lit-app/state";
import state from '@/state'

import Layer from "@/network/layer";
import InputLayer from "@/network/input_layer";

@customElement('inputlayer-edit-card')
class InputlayerEditCard extends LitElementWw {

  state = new StateController(this, state)

  @property() layer: Layer | null;

  _handleChangeOutput(e) {
    const layerIDs = this.renderRoot.querySelector('#outputSelect').value.map(id => {return parseInt(id)})
    const layers = state.network.getLayersByIds(layerIDs)
    this.layer.setOutputTo(layers)
  }

  _getOptions() {
    const options = state.network.layers.filter((layer) => layer != this.layer && !(layer instanceof InputLayer))
    return options.map((layer) => html`<sl-option value="${layer.id.toString()}">${layer.getName()}</sl-option>`)
  }

  _handleDeleteLayer(e) {
    state.network.removeLayer(this.layer)
    state.canvas.fit()
  }

  // @TODO: somehow make the number of units reactive, so that when removing multiple neurons, the button to remove is disabled when we reach a units value of 1
  render(){
    return html`
      <c-card>
        <div slot="title">
          Edit layer
        </div>
        <div slot="content">
          <div>
            <h3>Outputs</h3>
            <sl-select id="outputSelect" value=${this.layer.outputTo.map(layer => layer.id).join(' ')} multiple clearable @sl-change="${this._handleChangeOutput}">
              ${this._getOptions()}
            </sl-select>
          </div>
          <div>
            <h3>Layer</h3>
            <sl-button @click="${this._handleDeleteLayer}" variant=danger outline>Delete</sl-button>
          </div>
        </div>
      </c-card>
    `;
  }
}