import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import '@/components/cards/help_q_and_a_card'
import '@/components/cards/help_keyboard_shortcuts_card'
import '@/components/cards/help_about_card'

@customElement('help-panel')
export class HelpPanel extends LitElementWw {
  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-panel name="help">
        <help-q-and-a-card></help-q-and-a-card>
        <help-keyboard-shortcuts-card></help-keyboard-shortcuts-card>
        <help-about-card></help-about-card>
      </c-panel>
    `
  }
}
