import { LitElementWw } from "@webwriter/lit"
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { StateController } from "@lit-app/state";
import state from '@/state'

import OutputLayer from "@/network/output_layer";

@customElement('outputlayer-data-card')
class OutputlayerDataCard extends LitElementWw {

    state = new StateController(this, state)

    @property() layer: OutputLayer | null

    _handleChangeOutputData(e) {
        const outputKey = this.renderRoot.querySelector('#outputDataSelect').value
        this.layer.setOutput(outputKey)
    }

    _getOptions() {
        const assignedOutputKey = this.layer.getAssignedOutput()
        const selectedOption = html`<sl-option value="${assignedOutputKey}">${assignedOutputKey}</sl-option>`
        const nonassignedOutputKeys = state.dataset.getNonAssignedOutputKeys()
        const unselectedOptions = nonassignedOutputKeys.map((key) => html`<sl-option .value="${key}">${key}</sl-option>`)
        return html`${selectedOption}${unselectedOptions}`
    }

    render(){
        return html`
            <c-card>
                <div slot="title">
                    Assign output data
                </div>
                <div slot="content">
                    <sl-select id="outputDataSelect" value=${this.layer.getAssignedOutput()} clearable @sl-change="${this._handleChangeOutputData}" help-text="Assign output data to this layer">
                        ${this._getOptions()}
                    </sl-select>
                </div>
            </c-card>
        `;
    }
}