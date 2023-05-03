import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import { StateController } from "@lit-app/state";
import state from '@/state'

import NeuronLayer from "@/network/neuron_layer";

import '@/components/cards/neuron_info_card'

@customElement('neuron-panel')
class NeuronPanel extends LitElementWw {

    state = new StateController(this, state)

    static styles = css`
        .panel {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
    `

    getCards() {
        if (!state.activeNeuron) {
            return html``
        }

        const layer = <NeuronLayer>state.network.getLayerById(state.activeLayer)
        const neuron = layer.units[state.activeNeuron - 1]
        return html`
            <neuron-info-card .neuron=${neuron} .dataset=${state.dataset}></neuron-info-card>
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