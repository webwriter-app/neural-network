import { LitElementWw } from "@webwriter/lit"
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { observeState } from 'lit-element-state';
import networkState from '@/state/network_state.js';

@customElement('edge-info-card')
class EdgeInfoCard extends observeState(LitElementWw) {

    render(){
        return html`
            <c-card>
                <div slot="title">
                    Info
                </div>
                <div slot="content">
                    <span>
                        Selected: Edge connecting
                        ${networkState.activeEdge.sourceNeuron != null
                        ? html`'Neuron ${networkState.activeEdge.sourceNeuron}' inside`
                        : html``}
                        '${networkState.net.getLayerById(networkState.activeEdge.sourceLayer).getName()}'' with
                        ${networkState.activeEdge.sourceNeuron != null
                        ? html`'Neuron ${networkState.activeEdge.targetNeuron}' inside`
                        : html``}
                        '${networkState.net.getLayerById(networkState.activeEdge.targetLayer).getName()}''
                    </span>
                </div>
            </c-card>
        `;
    }
}