import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

/* UNDER CONSTRUCTION !!! */
@customElement('c-confirm-dialog')
export class CConfirmDialog extends LitElementWw {
  @property({ type: String }) label: string

  /* STYLES */
  static styles: CSSResult[] = [
    ...globalStyles,
    css`
      sl-card {
        --padding: 10px 20px 20px 20px;
        margin: 0;
        width: 100%;
        position: relative;
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
      <sl-dialog label="${this.label}">
        <slot></slot>
        <sl-button variant="danger">Abort</sl-button>
        <sl-button variant="danger">Confirm</sl-button>
      </sl-dialog>
    `
  }
}
