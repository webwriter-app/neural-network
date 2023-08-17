import { LitElement } from 'lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import { consume } from '@lit-labs/context'
import { panelContext } from '@/contexts/panels_context'

@customElement('c-tab')
export class CTab extends LitElement {
  @property({ type: String })
  name: string

  @property({ type: Boolean })
  colored: boolean

  @consume({ context: panelContext, subscribe: true })
  panel: string

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = [
    ...globalStyles,
    css`
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
    `,
  ]

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
