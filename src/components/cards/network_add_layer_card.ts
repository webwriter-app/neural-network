import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import { consume } from '@lit-labs/context'
import {
  NetworkConf,
  networkConfContext,
} from '@/contexts/network_conf_context'

import { InputLayer } from '@/components/network/input_layer'
import { DenseLayer } from '@/components/network/dense_layer'
import { OutputLayer } from '@/components/network/output_layer'

@customElement('network-add-layer-card')
export class NetworkAddLayerCard extends LitElementWw {
  @consume({ context: networkConfContext, subscribe: true })
  networkConf: NetworkConf

  _handleAddInputLayer(): void {
    InputLayer.create()
  }

  _handleAddDenseLayer(): void {
    DenseLayer.create()
  }

  _handleAddOutputLayer(): void {
    OutputLayer.create()
  }

  static styles: CSSResult[] = [globalStyles]

  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Add layer</div>
        <div slot="content">
          <c-button-group>
            <sl-button
              @click="${(_e: MouseEvent) => this._handleAddInputLayer()}"
            >
              <sl-icon slot="prefix" name="plus-lg"></sl-icon>
              Input
            </sl-button>
            <sl-button
              @click="${(_e: MouseEvent) => this._handleAddDenseLayer()}"
            >
              <sl-icon slot="prefix" name="plus-lg"></sl-icon>
              Dense
            </sl-button>
            <sl-button
              @click="${(_e: MouseEvent) => this._handleAddOutputLayer()}"
            >
              <sl-icon slot="prefix" name="plus-lg"></sl-icon>
              Output
            </sl-button>
          </c-button-group>
        </div>
      </c-card>
    `
  }
}
