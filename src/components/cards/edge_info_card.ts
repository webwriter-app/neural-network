import { LitElementWw } from "@webwriter/lit"
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import Layer from "@/network/layer";
import Neuron from "@/network/neuron";

@customElement('edge-info-card')
class EdgeInfoCard extends LitElementWw {

    @property() sourceLayer: Layer
    @property() targetLayer: Layer
    @property() sourceNeuron: Neuron
    @property() targetNeuron: Neuron

    render(){
        return html`
            <c-card>
                <div slot="title">
                    Info
                </div>
                <div slot="content">
                    <span>
                        Selected: Edge connecting
                        ${this.sourceNeuron != null
                        ? html`<c-network-link .target="${this.sourceNeuron}">Neuron ${this.sourceNeuron.id}</c-network-link> inside`
                        : html``}
                        <c-network-link .target="${this.sourceLayer}">${this.sourceLayer.getName()}</c-network-link> with
                        ${this.targetNeuron != null
                        ? html`<c-network-link .target="${this.targetNeuron}">Neuron ${this.targetNeuron.id}</c-network-link> inside`
                        : html``}
                        <c-network-link .target="${this.targetLayer}">${this.targetLayer.getName()}</c-network-link>
                    </span>
                </div>
            </c-card>
        `;
    }
}