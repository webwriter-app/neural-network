import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import '@/components/panels/dataset_panel.ts'
import '@/components/panels/network_panel.ts'
import '@/components/panels/train_panel.ts'

@customElement('right-panel')
class RightPanel extends LitElementWw {

    static styles = css`
        .panel {
            padding: 10px;
        }
    `

    render(){
        return html`
            <div class="panel">
                <sl-tab-group>
                    <sl-tab slot="nav" panel="network">Network</sl-tab>
                    <sl-tab slot="nav" panel="dataset">Dataset</sl-tab>
                    <sl-tab slot="nav" panel="training">Training</sl-tab>
                    <sl-tab-panel name="network"><network-panel></network-panel></sl-tab-panel>
                    <sl-tab-panel name="dataset"><dataset-panel></dataset-panel></sl-tab-panel>
                    <sl-tab-panel name="training"><train-panel></train-panel></sl-tab-panel>
                </sl-tab-group>
            </div>
        `;
     }
}