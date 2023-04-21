import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('c-card')
class CCard extends LitElementWw {

  /* STYLES */
  static styles = css`

    .c-card {
      width: 100%;
    }

    .c-card [slot='header'] {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .c-card [slot='content'] {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .c-card ::slotted(div[slot='content']) {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .c-card sl-icon-button {
      font-size: var(--sl-font-size-medium);
    }

   /*  :host(:not([editable])) div[slot="header"] {
      display: none
    } */
  `

  render(){
    return html`
      <sl-card class="c-card">
        <div slot="header">
            <slot name="title"></slot>
            <sl-icon-button name="gear" label="Settings"></sl-icon-button>
        </div>
        <slot name="content"></slot>
      </sl-card>
    `;
  }
}