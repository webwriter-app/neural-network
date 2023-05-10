import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import { StateController } from "@lit-app/state";
import state from '@/state'

import '@/components/cards/edge_info_card'

@customElement('edge-panel')
class EdgePanel extends LitElementWw {

    state = new StateController(this, state)

    static styles = css`
        .panel {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
    `

    getCards() {
        if (!state.activeEdge) {
            return html``
        }

        return html`
            <edge-info-card
                .sourceLayer=${state.activeEdge.sourceLayer}
                .targetLayer=${state.activeEdge.targetLayer}
                .sourceNeuron=${state.activeEdge.sourceNeuron}
                .targetNeuron=${state.activeEdge.targetNeuron}>
            </edge-info-card>
        `
    }

    render(){
        return html`
            <div class="panel">
                ${this.getCards()}
            </div>
        `;
    }
}