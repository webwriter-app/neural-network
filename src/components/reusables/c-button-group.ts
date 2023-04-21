import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import '@shoelace-style/shoelace/dist/components/card/card';

@customElement('c-button-group')
class CButtonGroup extends LitElementWw {

    /* STYLES */
    static styles = css`

        .c-button-group {
            width: 100%;
            display: flex;
            justify-content: space-between;
            gap: 20px;
        }

        .c-button-group ::slotted(*) {
            flex-grow: 1;
        }
    `

    render(){
        return html`
            <div class="c-button-group">
                <slot></slot>
            </div>
        `;
    }
}