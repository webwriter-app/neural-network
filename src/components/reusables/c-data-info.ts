import { LitElementWw } from "@webwriter/lit"
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('c-data-info')
class CDataInfo extends LitElementWw {

    @property({ type: Object }) dataProperty

    render(){
        let content
        if (!this.dataProperty.type) {
            content = html`
                <p>${this.dataProperty.description}</p>
            `
        } else {
            if (this.dataProperty.type == 'regression') {
                content = html`
                    <p>Type: regression</p>
                    <p>${this.dataProperty.description}</p>
                `
            } else if (this.dataProperty.type == 'classification') {
                content = html`
                    <p>Type: classification</p>
                    <p>${this.dataProperty.description}</p>
                    ${this.dataProperty.classes.map((clazz) => html`
                        <p>${clazz.key}: ${clazz.description}</p>`
                    )}
                `
            }
        }
        return html`
            <sl-tooltip>
                <div slot="content">
                    ${content}
                </div>
                <sl-tag pill>${this.dataProperty.key}</sl-tag>
            </sl-tooltip>
        `;
     }
}