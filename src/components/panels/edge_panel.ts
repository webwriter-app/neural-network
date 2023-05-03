import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import { StateController } from "@lit-app/state";
import state from '@/state'

import NeuronLayer from "@/network/neuron_layer";

import '@/components/cards/edge_info_card'

@customElement('edge-panel')
class EdgePanel extends LitElementWw {

    state = new StateController(this, state)

    static styles = css`
        .panel {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
    `

    getCards() {
        if (!state.activeEdge) {
            return html``
        }

        const sourceLayer = state.network.getLayerById(state.activeEdge.sourceLayer)
        const targetLayer = state.network.getLayerById(state.activeEdge.targetLayer)
        let sourceNeuron, targetNeuron
        if (state.activeEdge.sourceNeuron && sourceLayer instanceof NeuronLayer) sourceNeuron = sourceLayer.units[state.activeEdge.sourceNeuron - 1]
        if (state.activeEdge.targetNeuron && targetLayer instanceof NeuronLayer) targetNeuron = targetLayer.units[state.activeEdge.targetNeuron - 1]
        return html`
            <edge-info-card .sourceLayer=${sourceLayer} .targetLayer=${targetLayer} .sourceNeuron=${sourceNeuron} .targetNeuron=${targetNeuron}></edge-info-card>
        `
    }

    render(){
        return html`
            <div class="panel">
                ${this.getCards()}
            </div>
        `;
    }
}