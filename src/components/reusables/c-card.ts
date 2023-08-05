import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

@customElement('c-card')
export class CCard extends LitElementWw {
  /* STYLES */
  static styles: CSSResult[] = [
    globalStyles,
    css`
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
      .c-card {
        --padding: 10px 20px 20px 20px;
        margin: 0;
        width: 100%;
        height: 100%;
      }

      .c-card ::slotted(*[slot='content']) {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
    `,
  ]

  render(): TemplateResult<1> {
    return html`
      <sl-card class="c-card">
        <h1><slot name="title"></slot></h1>
        <div>
          <slot name="content"> </slot>
        </div>
      </sl-card>
    `
  }
}
