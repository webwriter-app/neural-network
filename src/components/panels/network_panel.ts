import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { observeState } from 'lit-element-state';
import networkState from '@/state/network_state.js';

// canvas cards
import '@/components/cards/canvas-info-card'
import '@/components/cards/canvas-quick-setup-card'
import '@/components/cards/canvas-add-entity-card'

// entity cards

// layer cards
import '@/components/cards/layer-info-card'
import '@/components/cards/layer-edit-card'

// neuron cards
import '@/components/cards/neuron-info-card'

@customElement('network-panel')
class NetworkPanel extends observeState(LitElementWw) {

    static styles = css`
        .panel {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
    `

    getCards() {
        if (networkState.selected == null) {
            return html`
            <canvas-info-card></canvas-info-card>
            <canvas-quick-setup-card></canvas-quick-setup-card>
            <canvas-add-entity-card></canvas-add-entity-card>
            You may select a network entity, layer, neuron or activation to view and edit its corresponding information.
            `
        } else if (networkState.selected == 'entity') {
            return html`
            Selected network entity
            `
        } else if (networkState.selected == 'layer') {
            return html`
            <layer-info-card></layer-info-card>
            <layer-edit-card></layer-edit-card>
            `
        } else if (networkState.selected == 'neuron') {
            return html`
            <neuron-info-card></neuron-info-card>
            `
        } else if (networkState.selected == 'edge') {
            return html`
            Selected edge
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