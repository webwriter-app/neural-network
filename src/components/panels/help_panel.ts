import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import '@/components/cards/help_q_and_a_card'
import '@/components/cards/help_keyboard_shortcuts_card'
import '@/components/cards/help_about_card'

@customElement('help-panel')
export class HelpPanel extends LitElementWw {
  static styles: CSSResult[] = globalStyles

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
