import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { observeState } from 'lit-element-state';
import networkState from '@/state/network_state.js';

import '@/components/cards/edit_layer_card'

@customElement('network-panel')
class NetworkPanel extends observeState(LitElementWw) {

    static styles = css`
        .network-panel {
            padding: 10px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
    `

    getCards() {
        if (networkState.selectedLayer) {
            return html`
            <edit-layer-card 
                .net = "${networkState.net}"
                .selectedLayer = "${networkState.selectedLayer}"
            ></edit-layer-card>
            `
        } else if (networkState.selectedNeuron) {
            return html`
            Selected Neuron
            `
        } else {
            return html`
            Select a neuron, layer or edge in the graph to view and edit its corresponding information.
            `
        }
    }

    render(){
        return html`
            <div class="panel">
                ${this.getCards()}
            </div>
        `;
    }
}