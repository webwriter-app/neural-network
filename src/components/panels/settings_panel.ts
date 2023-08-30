import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import '@/components/cards/settings_card'

@customElement('settings-panel')
export class SettingsPanel extends LitElementWw {
  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-panel name="settings">
        <settings-card></settings-card>
      </c-panel>
    `
  }
}
