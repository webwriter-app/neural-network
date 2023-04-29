import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import { StateController } from "@lit-app/state";
import state from '@/state'

import '@/components/cards/dataset_info_card'
import '@/components/cards/dataset_select_card'

import DatasetFactory from "@/dataset/dataset_factory";

@customElement('dataset-panel')
class DatasetPanel extends LitElementWw {

    state = new StateController(this, state)

    connectedCallback() {
        super.connectedCallback()
    
        // Load the standard dataset
        DatasetFactory.getDatasetByName("Boston House Pricing").then(dataset => {
            state.dataset = dataset
        })
    }

    static styles = css`
        .panel {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
    `

    render(){
        return html`
            <div class="panel">
                ${ state.dataset ? html`
                    <dataset-info-card .dataset="${state.dataset}"></dataset-info-card>
                ` : ``}
                <dataset-select-card .dataset="${state.dataset}"></dataset-select-card>
            </div>
        `;
    }
}