import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { observeState } from 'lit-element-state';
import networkState from '@/state/network_state.js';

// canvas cards
import '@/components/cards/canvas_info_card'
import '@/components/cards/canvas_quick_actions_card'
import '@/components/cards/canvas_add_layer_card'

// layer cards
import '@/components/cards/layer_info_card'
import '@/components/cards/layer_edit_card'
import '@/components/cards/layer_activation_card'

// neuron cards
import '@/components/cards/neuron_info_card'

// edge cards
import '@/components/cards/edge_info_card'

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
            <canvas-quick-actions-card></canvas-quick-actions-card>
            <canvas-add-layer-card layer=null></canvas-add-layer-card>
            You may select a network entity, layer, neuron or activation to view and edit its corresponding information.
            `
        } else if (networkState.selected == 'layer') {
            const layer = networkState.net.getLayerById(networkState.activeLayer)
            return html`
            <layer-info-card .layer=${layer}></layer-info-card>
            <layer-edit-card .layer=${layer}></layer-edit-card>
            <layer-activation-card .layer=${layer}></layer-activation-card>
            <canvas-add-layer-card .layer=${layer}></canvas-add-layer-card>
            `
        } else if (networkState.selected == 'neuron') {
            return html`
            <neuron-info-card></neuron-info-card>
            `
        } else if (networkState.selected == 'edge') {
            return html`
            <edge-info-card></edge-info-card>
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