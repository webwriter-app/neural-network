import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { panelContext } from '@/contexts/panels_context'

export @customElement('c-tab') class CTab extends LitElementWw {
  @property({ type: String })
  accessor name: string

  @property({ type: Boolean })
  accessor colored: boolean

  @consume({ context: panelContext, subscribe: true })
  accessor panel: string

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult = css`
    sl-button {
      width: 100%;
    }

    :host([colored]) sl-button::part(base) {
      background-color: var(--sl-color-primary-100);
    }

    .active::part(base) {
      background-color: var(--sl-color-primary-600) !important;
      color: var(--sl-color-neutral-0);
    }
  `

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <div class="c-tab">
        <sl-button 
          class="${this.panel == this.name ? 'active' : ''}" 
          @click="${(_e: MouseEvent) =>
            this.dispatchEvent(
              new CustomEvent<string>('open-panel', {
                detail: this.name,
                bubbles: true,
                composed: true,
              })
            )}"
        >
          <slot>
        </sl-button>
      </div>
    `
  }
}
