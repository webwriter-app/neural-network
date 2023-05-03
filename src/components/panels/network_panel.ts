import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import '@/components/cards/network_info_card'
import '@/components/cards/network_quick_actions_card'
import '@/components/cards/network_add_layer_card'

@customElement('network-panel')
class NetworkPanel extends LitElementWw {

    static styles = css`
        .panel {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
    `

    getCards() {
        return html`
            <network-info-card></network-info-card>
            <network-quick-actions-card></network-quick-actions-card>
            <network-add-layer-card></network-add-layer-card>
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