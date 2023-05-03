import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('dataset-info-card')
class DatasetInfoCard extends LitElementWw {

    @property() dataset

    static styles = css`
        .data-pills {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 5px;
        }
    `

    render(){
        return html`
            <c-card>
                <div slot="title">
                    Info
                </div>
                <div slot="content">
                    <div>
                        <h3>Dataset: ${this.dataset.name}</h3>
                        <p>${this.dataset.description}</p>
                        <h4>Inputs</h4>
                        <div class="data-pills">
                            ${this.dataset.inputs.map((input) => html`
                                <c-data-info .dataProperty="${input}"></c-data-info>
                            `)}
                        </div>
                        <h4>Outputs</h4>
                        <div class="data-pills">
                            ${this.dataset.outputs.map((output) => html`
                                <c-data-info .dataProperty="${output}"></c-data-info>
                            `)}
                        </div>
                    </div>
                </div>
            </c-card>
        `
    }
}