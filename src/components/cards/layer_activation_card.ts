import { LitElementWw } from "@webwriter/lit"
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { observeState } from 'lit-element-state';
import Layer from "@/network/layer";
import Activation from '@/network/activation'

@customElement('layer-activation-card')
class LayerActivationCard extends observeState(LitElementWw) {

    @property() layer: Layer | null

    _handleChangeActivation(e) {
        this.layer.setActivation(this.renderRoot.querySelector('sl-select').value)
    }

    render(){
        return html`
            <c-card>
                <div slot="title">
                    Activation function
                </div>
                <div slot="content">
                    <sl-select .value="${this.layer.activation.name}" help-text="The selected activation will be applied to all neurons in this layer." @sl-change="${this._handleChangeActivation}">
                    ${Activation.getOptions().map((option) => html`<sl-option .value="${option}">${option}</sl-option>`)}
                    </sl-select>
                </div>
            </c-card>
        `;
    }
}