import { LitElementWw } from "@webwriter/lit"
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { observeState } from 'lit-element-state';
import networkState from '@/state/network_state.js';

@customElement('neuron-info-card')
class NeuronInfoCard extends observeState(LitElementWw) {

    render(){
        return html`
            <c-card>
                <div slot="title">
                    Info
                </div>
                <div slot="content">
                    <span>Selected: 'Neuron ${networkState.activeNeuron}'' inside '${networkState.net.getLayerById(networkState.activeLayer).getName()}'</span>
                </div>
            </c-card>
        `;
    }
}