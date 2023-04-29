import { LitElementWw } from "@webwriter/lit"
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import DatasetFactory from "@/dataset/dataset_factory";

@customElement('dataset-select-card')
class DatasetSelectCard extends LitElementWw {

    @property() dataset

    _handleChangeDataset(e) {

    }

    render(){
        return html`
            <c-card>
                <div slot="title">
                    Select dataset
                </div>
                <div slot="content">
                    ${this.dataset
                    ? html`<sl-select .value="${encodeURI(this.dataset.name)}" @sl-change="${this._handleChangeDataset}">
                        ${DatasetFactory.getOptions().map((option) => html`<sl-option .value="${encodeURI(option.name)}">${option.name}</sl-option>`)}
                    </sl-select>`
                    : html`<sl-select @sl-change="${this._handleChangeDataset}" placeholder="Select a dataset">
                        ${DatasetFactory.getOptions().map((option) => html`<sl-option .value="${encodeURI(option.name)}">${option.name}</sl-option>`)}
                    </sl-select>`
                    }
                    <h3 style="text-align: center">or</h3>
                    <sl-button disabled>Create your own dataset</sl-button>
                </div>
            </c-card>
        `;
    }
}