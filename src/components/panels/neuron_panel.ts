import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { editableContext } from '@/contexts/editable_context'
import type { Settings } from '@/types/settings'
import { settingsContext } from '@/contexts/settings_context'
import { InputLayer } from '@/components/network/input_layer'
import { CNeuron } from '@/components/network/neuron'
import type { SelectedEle } from '@/types/selected_ele'
import { selectedEleContext } from '@/contexts/selected_ele_context'

import '@/components/cards/neuron_info_card'
import '@/components/cards/plots_card'

@customElement('neuron-panel')
export class NeuronPanel extends LitElementWw {
  @consume({ context: editableContext, subscribe: true })
  editable: boolean

  @consume({ context: settingsContext, subscribe: true })
  settings: Settings

  @consume({ context: selectedEleContext, subscribe: true })
  selectedEle: SelectedEle

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    if (this.selectedEle && this.selectedEle instanceof CNeuron) {
      const neuron: CNeuron = this.selectedEle
      return html`
        <c-panel name="neuron">
          <neuron-info-card .neuron=${neuron}></neuron-info-card>
          ${(this.editable || this.settings.showPlots) &&
          neuron.layer instanceof InputLayer &&
          neuron.key
            ? html` <plots-card .featureKey=${neuron.key}></plots-card> `
            : html``}
        </c-panel>
      `
    }
  }
}
