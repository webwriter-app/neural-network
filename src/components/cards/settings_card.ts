import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

@customElement('settings-card')
export class SettingsCard extends LitElementWw {
  static styles: CSSResult[] = [globalStyles]

  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Settings</div>
        <div slot="content">
          <p>
            Configure which options the users of this widget are allowed to view
            and edit
          </p>
          <h2>Network</h2>
          <sl-switch checked
            >Allow creating / changing the network topology using the 'quick
            setup' options</sl-switch
          >
          <sl-switch checked
            >Allow manual adding and removing of layers</sl-switch
          >
          <h2>DataSet</h2>
          <h2>Training</h2>
        </div>
      </c-card>
    `
  }
}
