import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import { consume } from '@lit-labs/context'
import { openPanelsContext } from '@/contexts/panels_context'

@customElement('c-tab')
export class CTab extends LitElementWw {
  @property({ type: String })
  name: string

  @property({ type: String })
  group: string

  @property({ type: Boolean })
  colored: boolean

  @consume({ context: openPanelsContext, subscribe: true })
  openPanels: string[]

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = [
    globalStyles,
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
          class="${this.openPanels.includes(this.name) ? 'active' : ''}" 
          @click="${(_e: MouseEvent) =>
            this.dispatchEvent(
              new CustomEvent<{
                panel: string
                group?: string
              }>('open-panel', {
                detail: {
                  panel: this.name,
                  group: this.group,
                },
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
