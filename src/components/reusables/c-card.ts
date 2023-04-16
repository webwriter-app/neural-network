import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import '@shoelace-style/shoelace/dist/components/card/card';

@customElement('c-card')
class CCard extends LitElementWw {

  @property()
  net
  @property()
  selectedLayer

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

    .c-card .body {
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
        <div class="body">
          <slot name="content"></slot>
        </div>
      </sl-card>
    `;
  }
}