import { LitElementWw } from "@webwriter/lit"
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import Layer from "@/network/layer";

@customElement('layer-info-card')
class LayerInfoCard extends LitElementWw {

    @property() layer: Layer | null

    render(){
        return html`
            <c-card>
                <div slot="title">
                    Info
                </div>
                <div slot="content">
                    <span>Selected: <c-canvas-link target="${this.layer.id}" disabled>${this.layer.getName()}</c-canvas-link></span>
                    <span>${this.layer.constructor.DESCRIPTION}</span>
                </div>
            </c-card>
        `;
    }
}