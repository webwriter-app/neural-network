import { LitElementWw } from "@webwriter/lit"
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { StateController } from "@lit-app/state";
import state from '@/state'

import Layer from "@/network/layer";
import OutputLayer from "@/network/output_layer";

@customElement('outputlayer-edit-card')
class OutputlayerEditCard extends LitElementWw {

  state = new StateController(this, state)

  @property() layer: OutputLayer | null
  @property() dataset

  _handleChangeInput(e) {
    const layerIDs = this.renderRoot.querySelector('#inputSelect').value.map(id => {return parseInt(id)})
    const layers = state.network.getLayersByIds(layerIDs)
    this.layer.setInputFrom(layers)
  }

  _getOptions() {
    const options = state.network.layers.filter((layer) => layer != this.layer && !(layer instanceof OutputLayer))
    return options.map((layer) => html`<sl-option value="${layer.id.toString()}">${layer.getName()}</sl-option>`)
  }

  _handleDeleteLayer(e) {
    this.layer.delete()
  }

  render(){
    return html`
      <c-card>
        <div slot="title">
            Edit layer
        </div>
        <div slot="content">
            <div>
                <h3>Inputs</h3>
                <sl-select id="inputSelect" value=${this.layer.inputFrom.map(layer => layer.id).join(' ')} multiple clearable @sl-change="${this._handleChangeInput}">
                    ${this._getOptions()}
                </sl-select>
            </div>
            <div>
                <h3>Output</h3>
                ${this.layer.outputKey ? html`
                    <c-data-info .dataProperty="${this.dataset.getLabel()}"></c-data-info>
                ` : html``}
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