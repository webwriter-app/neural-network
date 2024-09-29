import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { CPanel } from '../reusables/c-panel'
import { SettingsCard } from '@/components/cards/settings_card'

export class SettingsPanel extends LitElementWw {

  static scopedElements = {
    "c-panel": CPanel,
    "settings-card": SettingsCard
  }

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-panel name="settings">
        <settings-card></settings-card>
      </c-panel>
    `
  }
}
