import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html } from 'lit'

import { CPanel } from '../reusables/c-panel'
import { HelpQAndACard } from '../cards/help-q-and-a-card'
import { HelpKeyboardShortcutsCard } from '../cards/help-keyboard-shortcuts-card'
import { HelpAboutCard } from '../cards/help-about-card'

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
