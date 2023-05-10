import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import { StateController } from "@lit-app/state";
import state from '@/state'

import InputLayer from "@/network/input_layer";
import DenseLayer from "@/network/dense_layer";
import OutputLayer from "@/network/output_layer";

import '@/components/cards/layer_info_card'
import '@/components/cards/layer_edit_card'
import '@/components/cards/layer_activation_card'
    // input layer
    import '@/components/cards/inputlayer_edit_card'
    // output layer
    import '@/components/cards/outputlayer_edit_card'

@customElement('layer-panel')
class LayerPanel extends LitElementWw {

    state = new StateController(this, state)

    static styles = css`
        .panel {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
    `

    getCards() {
        if (!state.activeLayer) {
            return html``
        }

        const layer = state.activeLayer
        if (layer instanceof InputLayer) {
            return html`
            <layer-info-card .layer=${layer}></layer-info-card>
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
            <outputlayer-edit-card .layer=${layer} .dataset=${state.dataset}></outputlayer-edit-card>
            <layer-activation-card .layer=${layer}></layer-activation-card>
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