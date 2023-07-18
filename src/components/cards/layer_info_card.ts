import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import { CLayer } from '@/components/network/c_layer'

@customElement('layer-info-card')
export class LayerInfoCard extends LitElementWw {
  @property() layer: CLayer

  static styles: CSSResult[] = [globalStyles]

  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Info</div>
        <div slot="content">
          <span>
            Selected:
            <c-network-link .target="${this.layer}">
              ${this.layer.getName()}
            </c-network-link>
          </span>
          <span> ${this.layer.getDescription()} </span>
        </div>
      </c-card>
    `
  }
}
