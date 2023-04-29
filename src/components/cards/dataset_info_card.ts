import { LitElementWw } from "@webwriter/lit"
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('dataset-info-card')
class DatasetInfoCard extends LitElementWw {

    @property() dataset

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
                        ${this.dataset.inputs.map((input) => html`
                            <sl-tooltip content="${input.description}">
                                <sl-tag pill>${input.key}</sl-tag>
                            </sl-tooltip>
                        `)}
                        <h4>Outputs</h4>
                        ${this.dataset.outputs.map((output) => html`
                            ${output.type == "regression" ? html`
                                <sl-tooltip>
                                    <div slot="content">
                                        <p>Type: regression</p>
                                        <p>${output.description}</p>
                                    </div>
                                    <sl-tag pill>${output.key}</sl-tag>
                                </sl-tooltip>
                            `: html``}
                            ${output.type == "classification" ? html`
                                <sl-tooltip>
                                    <div slot="content">
                                        <p>Type: classification</p>
                                        <p>${output.description}</p>
                                        ${output.classes.map((clazz) => html`
                                            <p>${clazz.key}: ${clazz.description}</p>`
                                        )}
                                    </div>
                                    <sl-tag pill>${output.key}</sl-tag>
                                </sl-tooltip>
                            `: html``}
                        `)}
                    </div>
                </div>
            </c-card>
        `
    }
}