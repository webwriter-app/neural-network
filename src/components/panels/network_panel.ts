import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import '@/components/cards/network_info_card'
import '@/components/cards/get_started_card'
import '@/components/cards/network_add_layer_card'

@customElement('network-panel')
export class NetworkPanel extends LitElementWw {
  static styles: CSSResult[] = [globalStyles]

  render(): TemplateResult<1> {
    return html`
      <c-panel name="network">
        <network-info-card></network-info-card>
        <get-started-card></get-started-card>
        <network-add-layer-card> </network-add-layer-card>
      </c-panel>
    `
  }
}
