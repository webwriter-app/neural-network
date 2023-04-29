import { LitElementWw } from "@webwriter/lit"
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { StateController } from "@lit-app/state";
import state from '@/state'

import InputLayer from "@/network/input_layer";

@customElement('inputlayer-data-card')
class InputlayerDataCard extends LitElementWw {

    state = new StateController(this, state)

    @property() layer: InputLayer | null

    _handleAssignAllData() {
        const nonAssignedInputKeys = state.dataset.getNonAssignedInputKeys()
        this.layer.assignInputs(nonAssignedInputKeys)
    }

    _handleChangeInputData(e) {
        const inputKeys = this.renderRoot.querySelector('#inputDataSelect').value
        this.layer.setInputs(inputKeys)
    }

    _getOptions() {
        const selectedOptions = this.layer.getAssignedInputs().map((key) => html`<sl-option value="${key}">${key}</sl-option>`)
        const options = state.dataset.getNonAssignedInputKeys()
        const unselectedOptions = options.map((key) => html`<sl-option .value="${key}">${key}</sl-option>`)
        return html`${selectedOptions} ${unselectedOptions}`
    }

    render(){
        return html`
            <c-card>
                <div slot="title">
                    Assign input data
                </div>
                <div slot="content">
                    <sl-button @click="${this._handleAssignAllData}">Assign all non-assigned inputs to this layer</sl-button>
                    <sl-select id="inputDataSelect" value=${this.layer.getAssignedInputs().join(' ')} multiple clearable @sl-change="${this._handleChangeInputData}" help-text="Assign yet non-assigned input data manually">
                        ${this._getOptions()}
                    </sl-select>
                </div>
            </c-card>
        `;
    }
}