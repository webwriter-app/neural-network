import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import { consume } from '@lit-labs/context'
import { openPanelsContext } from '@/contexts/panels_context'

@customElement('c-panel')
export class CPanel extends LitElementWw {
  @property({ type: String })
  name: string

  @consume({ context: openPanelsContext, subscribe: true })
  openPanels: string[]

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // on disconnect (which should only happen when the panel as well as the
  // corresponding tab is conditionally removed from rendering), emit an
  // close-panels event (on window since this is not in the DOM anymore). if the
  // panel was not open this does not any harm but if it was, the panels context
  // will tell the menu component that there is no right panel currently open,
  // so it collapses the sidebar
  disconnectedCallback(): void {
    window.dispatchEvent(
      new CustomEvent<string[]>('close-panels', {
        detail: [this.name],
        bubbles: true,
        composed: true,
      })
    )
    super.disconnectedCallback()
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = [
    globalStyles,
    css`
      .c-panel {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
    `,
  ]

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <div class="c-panel ${
        this.name &&
        !this.openPanels.some((openPanel: string) => {
          return openPanel == this.name
        })
          ? 'hidden'
          : ''
      }">
        <slot>
      </div>
    `
  }
}
