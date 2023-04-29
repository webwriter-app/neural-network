import { LitElementWw } from "@webwriter/lit"
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { StateController } from "@lit-app/state";
import state from '@/state'

@customElement('neuron-info-card')
class NeuronInfoCard extends LitElementWw {

    state = new StateController(this, state)

    render(){
        return html`
            <c-card>
                <div slot="title">
                    Info
                </div>
                <div slot="content">
                    <span>Selected item: <c-canvas-link disabled>Neuron ${state.activeNeuron}</c-canvas-link> inside <c-canvas-link>${state.network.getLayerById(state.activeLayer).getName()}</c-canvas-link></span>
                </div>
            </c-card>
        `;
    }
}