import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('c-confirm-dialog')
export class CConfirmDialog extends LitElementWw {
  @property({ type: String })
  label: string = 'Please confirm this action!'

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  confirm() {}

  abort() {}

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <sl-dialog label="${this.label}">
        <slot></slot>
        <sl-button @click="${(_e: MouseEvent) => this.abort()}"
          >Abort</sl-button
        >
        <sl-button
          variant="primary"
          @click="${(_e: MouseEvent) => this.confirm()}"
          >Confirm</sl-button
        >
      </sl-dialog>
    `
  }
}
