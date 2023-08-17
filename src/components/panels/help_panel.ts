import { LitElement } from 'lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import '@/components/cards/help_card'

@customElement('help-panel')
export class HelpPanel extends LitElement {
  static styles: CSSResult[] = globalStyles

  render(): TemplateResult<1> {
    return html`
      <c-panel name="help">
        <help-card> </help-card>
      </c-panel>
    `
  }
}
