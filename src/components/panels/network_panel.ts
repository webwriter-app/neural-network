import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import { StateController } from "@lit-app/state";
import state from '@/state'

import DatasetFactory from "@/dataset/dataset_factory";
import NeuralNet from "@/network/net";
import InputLayer from "@/network/input_layer";
import DenseLayer from "@/network/dense_layer";
import OutputLayer from "@/network/output_layer";
import spawnAlert from "@/alerts";

import '@/components/cards/network_info_card'
import '@/components/cards/network_quick_actions_card'
import '@/components/cards/network_add_layer_card'

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

    async _handleClear(e?) {
        state.network.cleanup()
        spawnAlert("The canvas has been cleared!")
        if (state.dataset.name) {
          state.dataset = await DatasetFactory.getDatasetByName(state.dataset.name)
        } else {
          state.dataset = await DatasetFactory.getDatasetByName(DatasetFactory.getOptions()[0])
        }
        state.network = new NeuralNet()
    }

    async _handleCreateFeedForwardNetwork(e?) {
        await this._handleClear()
    
        const inputLayer = new InputLayer({
        network: state.network,
        pos: {x: 0, y: 0}
        })
        const denseLayer1 = new DenseLayer({
        network: state.network,
        inputFrom: [inputLayer],
        units: 5,
        pos: {x: 0, y: -300}
        })
        const denseLayer2 = new DenseLayer({
        network: state.network,
        inputFrom: [denseLayer1],
        pos: {x: -350, y: -600}
        })
        const denseLayer3 = new DenseLayer({
        network: state.network,
        inputFrom: [denseLayer1],
        units: 3,
        pos: {x: 300, y: -600}
        })
        const outputLayer = new OutputLayer({
        network: state.network,
        inputFrom: [denseLayer2, denseLayer3],
        pos: {x: 0, y: -900}
        })

        state.canvas.fit()

        spawnAlert("A feed forward network has been created!")
    }

    getCards() {
        return html`
            <network-info-card></network-info-card>
            <network-quick-actions-card 
                .network=${state.network}
                .canvas=${state.canvas} 
                @handle-clear="${this._handleClear}" 
                @handle-create-feed-forward="${this._handleCreateFeedForwardNetwork}">
            </network-quick-actions-card>
            <network-add-layer-card 
                .network=${state.network}>
            </network-add-layer-card>
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