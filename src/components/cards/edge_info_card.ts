import { LitElementWw } from "@webwriter/lit"
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { StateController } from "@lit-app/state";
import state from '@/state'

@customElement('edge-info-card')
class EdgeInfoCard extends LitElementWw {

    state = new StateController(this, state)

    render(){
        return html`
            <c-card>
                <div slot="title">
                    Info
                </div>
                <div slot="content">
                    <span>
                        Selected: Edge connecting
                        ${state.activeEdge.sourceNeuron != null
                        ? html`<c-canvas-link>Neuron ${state.activeEdge.sourceNeuron}</c-canvas-link> inside`
                        : html``}
                        <c-canvas-link>${state.network.getLayerById(state.activeEdge.sourceLayer).getName()}</c-canvas-link> with
                        ${state.activeEdge.sourceNeuron != null
                        ? html`<c-canvas-link>Neuron ${state.activeEdge.targetNeuron}</c-canvas-link> inside`
                        : html``}
                        <c-canvas-link>${state.network.getLayerById(state.activeEdge.targetLayer).getName()}</c-canvas-link>
                    </span>
                </div>
            </c-card>
        `;
    }
}