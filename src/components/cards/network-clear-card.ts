import { widgetMsg } from '@webwriter/lit/localize'
import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { globalStyles } from '../global-styles'
import { CCard } from '../reusables/c-card'

import SlButton from '@shoelace-style/shoelace/dist/components/button/button.component.js'
import IconTrash from '@tabler/icons/outline/trash.svg'

export class NetworkClearCard extends LitElementWw {
  private readonly msg = widgetMsg(this);
  static scopedElements = {
    'c-card': CCard,
    'sl-button': SlButton,
  }
  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  handleClear() {
    this.dispatchEvent(
      new CustomEvent('clear-network', { bubbles: true, composed: true }),
    )
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult = globalStyles

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">${this.msg('Clear')}</div>
        <div slot="content">
          <sl-button
            @click="${(_e: MouseEvent) => {
              void this.handleClear()
            }}"
          >
            <sl-icon slot="prefix" src=${IconTrash}></sl-icon>
            ${this.msg('Clear network')}
          </sl-button>
          <p>${this.msg('This will remove every layer from the network.')}</p>
        </div>
      </c-card>
    `
  }
}
