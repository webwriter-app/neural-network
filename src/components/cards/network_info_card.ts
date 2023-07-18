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
          Build your network by adding layers or choose a quick setup option
          below. Select layers in the graph to edit their properties and connect
          them with other layers.
        </div>
      </c-card>
    `
  }
}
