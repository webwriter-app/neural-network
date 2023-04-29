import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('c-card')
class CCard extends LitElementWw {

  /* STYLES */
  static styles = css`

    .c-card {
      width: 100%;
      position: relative;
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

    .drawer {
      border: 1px solid black;
      background-color: green;
    }

   /*  :host(:not([editable])) div[slot="header"] {
      display: none
    } */
  `

  _handleToggleDrawer() {
    const drawer = this.renderRoot.querySelector('.drawer');
    drawer.open = !drawer.open
  }

  render(){
    return html`
      <sl-card class="c-card">
        <div slot="header">
          <h2><slot name="title"></slot></h2>
          <sl-icon-button name="gear" label="Settings" @click=${this._handleToggleDrawer}></sl-icon-button>
        </div>
        <slot name="content">
        </slot>
        <sl-drawer label="Settings" contained class="drawer" style="--size: 80%;">
          <slot name="settings">
        </sl-drawer>
      </sl-card>
    `;
  }
}