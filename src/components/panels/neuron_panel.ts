import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { consume } from '@lit-labs/context'
import { Selected, selectedContext } from '@/contexts/selected_context'

import { globalStyles } from '@/global_styles'

import { InputLayer } from '@/components/network/input_layer'
import { Neuron } from '@/components/network/neuron'

import '@/components/cards/neuron_info_card'
import '@/components/cards/plots_card'
import { CLayer } from '@/components/network/c_layer'

@customElement('neuron-panel')
export class NeuronPanel extends LitElementWw {
  @consume({ context: selectedContext, subscribe: true })
  selected: Selected

  static styles: CSSResult[] = [globalStyles]

  getCards(): TemplateResult<1> {
    if (!this.selected.neuron && !this.selected.layer) {
      return html``
    }

    const neuron: Neuron = this.selected.neuron
    const layer: CLayer = this.selected.layer

    return html`
      <neuron-info-card .neuron=${neuron} .layer=${layer}></neuron-info-card>
      ${layer instanceof InputLayer && neuron.label
        ? html` <plots-card .inputKey=${neuron.label}></plots-card> `
        : html``}
    `
  }

  render(): TemplateResult<1> {
    return html` <c-panel name="neuron"> ${this.getCards()} </c-panel> `
  }
}
