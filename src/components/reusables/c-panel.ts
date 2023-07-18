import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import { consume } from '@lit-labs/context'
import { Panels, panelsContext } from '@/contexts/panels_context'

@customElement('c-panel')
export class CPanel extends LitElementWw {
  @property({ type: String })
  name: string

  @consume({ context: panelsContext, subscribe: true })
  panels: Panels

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // on disconnect (which should only happen when the panel as well as the
  // corresponding tab is conditionally removed from rendering), call the close
  // function on the panels context to close the current panel. if the panel was
  // not open this does not any harm but if it was, the panels context will tell
  // the menu component that there is no right panel currently open, so it
  // collapses the sidebar
  disconnectedCallback(): void {
    this.panels.close(this.name)
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
        this.name && !this.panels.containsSome(this.name) ? 'hidden' : ''
      }">
        <slot>
      </div>
    `
  }
}
