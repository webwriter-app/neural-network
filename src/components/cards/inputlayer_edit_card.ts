import { LitElementWw } from "@webwriter/lit"
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { StateController } from "@lit-app/state";
import state from '@/state'

import InputLayer from "@/network/input_layer";

@customElement('inputlayer-edit-card')
class InputlayerEditCard extends LitElementWw {

  state = new StateController(this, state)

  @property() layer: InputLayer | null;

  _handleChangeOutput(e) {
    const layerIDs = this.renderRoot.querySelector('#outputSelect').value.map(id => {return parseInt(id)})
    const layers = state.network.getLayersByIds(layerIDs)
    this.layer.setOutputTo(layers)
  }
  
  _getInputOptions() {
    const selectedOptions = this.layer.getAssignedInputs().map((key) => html`
        <sl-option value="${key}">
            <sl-tooltip content="${state.dataset.getInputByKey(key).description}">${key}</sl-tooltip>
        </sl-option>
    `)
    const options = state.dataset.getNonAssignedInputKeys()
    const unselectedOptions = options.map((key) => html`
        <sl-option .value="${key}">
            <sl-tooltip content="${state.dataset.getInputByKey(key).description}">${key}</sl-tooltip>
        </sl-option>
    `)
    return html`${selectedOptions} ${unselectedOptions}`
  }

  _handleChangeInputData(e) {
    const inputKeys = this.renderRoot.querySelector('#inputDataSelect').value
    this.layer.setInputs(inputKeys)
  }

  _getOutputOptions() {
    const options = state.network.layers.filter((layer) => layer != this.layer && !(layer instanceof InputLayer))
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
            <sl-select id="inputDataSelect" value=${this.layer.getAssignedInputs().join(' ')} multiple @sl-change="${this._handleChangeInputData}" max-options-visible=100 help-text="Assign input data to this layer">
                ${this._getInputOptions()}
            </sl-select>
          </div>
          <div>
            <h3>Outputs</h3>
            <sl-select id="outputSelect" value=${this.layer.outputTo.map(layer => layer.id).join(' ')} multiple clearable @sl-change="${this._handleChangeOutput}">
              ${this._getOutputOptions()}
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