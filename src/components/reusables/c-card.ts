import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { globalStyles } from '@/global_styles'

import { themeContext } from '@/contexts/theme_context'
import type { Theme } from '@/types/theme'

export @customElement('c-card') class CCard extends LitElementWw {
  @consume({ context: themeContext, subscribe: true })
  accessor theme: Theme

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = [
    globalStyles,
    css`
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
      .c-card {
        --padding: 5px 15px 15px 15px;
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

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <style>
        ${this.theme.styles}
      </style>
      <sl-card class="c-card">
        <h1><slot name="title"></slot></h1>
        <div>
          <slot name="content"> </slot>
        </div>
      </sl-card>
    `
  }
}
