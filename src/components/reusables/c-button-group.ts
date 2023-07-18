import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import '@shoelace-style/shoelace/dist/components/card/card'

@customElement('c-button-group')
export class CButtonGroup extends LitElementWw {
  /* STYLES */
  static styles: CSSResult[] = [
    globalStyles,
    css`
      .c-button-group {
        width: 100%;
        display: flex;
        justify-content: space-between;
        gap: 20px;
      }

      .c-button-group ::slotted(*) {
        flex-grow: 1;
      }
    `,
  ]

  render(): TemplateResult<1> {
    return html`
      <div class="c-button-group">
        <slot></slot>
      </div>
    `
  }
}
