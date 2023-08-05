import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import '@shoelace-style/shoelace/dist/components/card/card'

@customElement('c-tag-group')
export class CButtonGroup extends LitElementWw {
  /* STYLES */
  static styles: CSSResult[] = [
    globalStyles,
    css`
      .c-tag-group {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        gap: 10px;
        flex-wrap: wrap;
      }
    `,
  ]

  render(): TemplateResult<1> {
    return html`
      <div class="c-tag-group">
        <slot></slot>
      </div>
    `
  }
}
