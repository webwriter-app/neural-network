import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import { StateController } from "@lit-app/state";
import state from '@/state'

import InputLayer from "@/network/input_layer";
import DenseLayer from "@/network/dense_layer";
import OutputLayer from "@/network/output_layer";

// canvas cards
import '@/components/cards/canvas_info_card'
import '@/components/cards/canvas_quick_actions_card'
import '@/components/cards/canvas_add_layer_card'

// layer cards
import '@/components/cards/layer_info_card'
import '@/components/cards/layer_edit_card'
import '@/components/cards/layer_activation_card'
    // input layer
    import '@/components/cards/inputlayer_data_card'
    import '@/components/cards/inputlayer_edit_card'
    // output layer
    import '@/components/cards/outputlayer_data_card'
    import '@/components/cards/outputlayer_edit_card'

// neuron cards
import '@/components/cards/neuron_info_card'

// edge cards
import '@/components/cards/edge_info_card'

@customElement('network-panel')
class NetworkPanel extends LitElementWw {

    state = new StateController(this, state)

    static styles = css`
        .panel {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
    `

    getCards() {
        if (state.selected == null) {
            return html`
            <canvas-info-card></canvas-info-card>
            <canvas-quick-actions-card></canvas-quick-actions-card>
            <canvas-add-layer-card></canvas-add-layer-card>
            `
        } else if (state.selected == 'layer') {
            const layer = state.network.getLayerById(state.activeLayer)
            if (layer instanceof InputLayer) {
                return html`
                <layer-info-card .layer=${layer}></layer-info-card>
                <inputlayer-data-card .layer=${layer}></inputlayer-data-card>
                <inputlayer-edit-card .layer=${layer}></inputlayer-edit-card>
                `
            } else if (layer instanceof DenseLayer) {
                return html`
                <layer-info-card .layer=${layer}></layer-info-card>
                <layer-edit-card .layer=${layer}></layer-edit-card>
                <layer-activation-card .layer=${layer}></layer-activation-card>
                `
            }
            else if (layer instanceof OutputLayer) {
                return html`
                <layer-info-card .layer=${layer}></layer-info-card>
                <outputlayer-data-card .layer=${layer}></outputlayer-data-card>
                <outputlayer-edit-card .layer=${layer}></outputlayer-edit-card>
                <layer-activation-card .layer=${layer}></layer-activation-card>
                `
            }
        } else if (state.selected == 'neuron') {
            return html`
            <neuron-info-card></neuron-info-card>
            `
        } else if (state.selected == 'edge') {
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