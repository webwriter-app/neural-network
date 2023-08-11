import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import { networkContext } from '@/contexts/network_context'
import {
  SelectedEle,
  selectedEleContext,
} from '@/contexts/selected_ele_context'

import type { Network } from '@/network/network'
import { InputLayer } from '@/network/input_layer'
import { Neuron } from '@/network/neuron'

import '@/components/cards/neuron_info_card'
import '@/components/cards/plots_card'

@customElement('neuron-panel')
export class NeuronPanel extends LitElementWw {
  @consume({ context: networkContext, subscribe: true })
  network: Network

  @consume({ context: selectedEleContext, subscribe: true })
  selectedEle: SelectedEle

  static styles: CSSResult[] = [globalStyles]

  render(): TemplateResult<1> {
    if (this.selectedEle && this.selectedEle instanceof Neuron) {
      const neuron: Neuron = this.selectedEle
      return html`
        <c-panel name="neuron">
          <neuron-info-card .neuron=${neuron}></neuron-info-card>
          ${neuron.layer instanceof InputLayer && neuron.label
            ? html` <plots-card .inputKey=${neuron.label}></plots-card> `
            : html``}
        </c-panel>
      `
    }
  }
}
