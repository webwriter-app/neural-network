import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

@customElement('network-info-card')
export class NetworkInfoCard extends LitElementWw {
  static styles: CSSResult[] = [globalStyles]

  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Info</div>
        <div slot="content">
          <p>
            Add layers manually to the network. You might also want to clear the
            network for a fresh start or export your current configuration!
          </p>
        </div>
      </c-card>
    `
  }
}
