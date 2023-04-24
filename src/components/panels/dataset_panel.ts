import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import '@/components/cards/dataset_info_card'

@customElement('dataset-panel')
class DatasetPanel extends LitElementWw {

    render(){
        return html`
            <dataset-info-card></dataset-info-card>
        `;
    }
}