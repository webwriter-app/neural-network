import { LitElementWw } from "@webwriter/lit"
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('top-bar')
class TopBar extends LitElementWw {

  static styles = css`
    .top-bar {
      padding: 10px;
      display: flex;
      justify-content: space-between;

      background-color: var(--sl-color-neutral-50);
      border-radius: var(--sl-border-radius-medium);
    }
  `

  render(){
    return html`
        <div class="top-bar">
            <div class="left">
                <sl-button variant="primary">Setup</sl-button>
                <sl-button variant="default">Import</sl-button>
            </div>
            <div class="right">
                <sl-button variant="default">Export</sl-button>
            </div>
        </div>
    `;
  }
}