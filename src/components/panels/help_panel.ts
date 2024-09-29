import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html } from 'lit'

import { CPanel } from '../reusables/c-panel'
import { HelpQAndACard } from '@/components/cards/help_q_and_a_card'
import { HelpKeyboardShortcutsCard } from '@/components/cards/help_keyboard_shortcuts_card'
import { HelpAboutCard } from '@/components/cards/help_about_card'

export class HelpPanel extends LitElementWw {

  static scopedElements = {
    "c-panel": CPanel,
    "help-q-and-a-card": HelpQAndACard,
    "help-about-card": HelpAboutCard
  }

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-panel name="help">
        <help-q-and-a-card></help-q-and-a-card>
        <help-about-card></help-about-card>
      </c-panel>
    `
  }
}
