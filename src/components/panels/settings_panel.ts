import { LitElement } from 'lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import '@/components/cards/settings_card'

@customElement('settings-panel')
export class SettingsPanel extends LitElement {
  static styles: CSSResult[] = globalStyles

  render(): TemplateResult<1> {
    return html`
      <c-panel name="settings">
        <settings-card></settings-card>
      </c-panel>
    `
  }
}
