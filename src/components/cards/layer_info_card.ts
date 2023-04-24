import { LitElementWw } from "@webwriter/lit"
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { observeState } from 'lit-element-state';
import Layer from "@/network/layer";

@customElement('layer-info-card')
class LayerInfoCard extends observeState(LitElementWw) {

    @property() layer: Layer | null

    render(){
        return html`
            <c-card>
                <div slot="title">
                    Info
                </div>
                <div slot="content">
                    <span>Selected: '${this.layer.getName()}'</span>
                    <span>${this.layer.constructor.DESCRIPTION}</span>
                </div>
            </c-card>
        `;
    }
}