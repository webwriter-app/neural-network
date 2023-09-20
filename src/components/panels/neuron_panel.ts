import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { editableContext } from '@/contexts/editable_context'
import type { Settings } from '@/types/settings'
import { settingsContext } from '@/contexts/settings_context'
import { InputLayer } from '@/components/network/input_layer'
import { OutputLayer } from '@/components/network/output_layer'
import { CNeuron } from '@/components/network/neuron'
import type { DataSet } from '@/types/data_set'
import { dataSetContext } from '@/contexts/data_set_context'
import { DataSetUtils } from '@/utils/data_set_utils'
import type { SelectedEle } from '@/types/selected_ele'
import { selectedEleContext } from '@/contexts/selected_ele_context'

import '@/components/cards/neuron_info_card'
import '@/components/cards/neuron_feature_card'
import '@/components/cards/plots_card'
import '@/components/cards/neuron_inputs_card'
import '@/components/cards/neuron_activation_card'
import '@/components/cards/neuron_label_card'
import '@/components/cards/neuron_outputs_card'

@customElement('neuron-panel')
export class NeuronPanel extends LitElementWw {
  @consume({ context: editableContext, subscribe: true })
  editable: boolean

  @consume({ context: settingsContext, subscribe: true })
  settings: Settings

  @consume({ context: dataSetContext, subscribe: true })
  dataSet: DataSet

  @consume({ context: selectedEleContext, subscribe: true })
  selectedEle: SelectedEle

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    if (this.selectedEle && this.selectedEle instanceof CNeuron) {
      const neuron: CNeuron = this.selectedEle
      return html`
        <c-panel name="neuron">
          <neuron-info-card .neuron=${neuron}></neuron-info-card>
          ${neuron.layer instanceof InputLayer
            ? html`
                <neuron-feature-card
                  .neuron=${neuron}
                  .featureDesc=${DataSetUtils.getDataSetInputByKey(
                    this.dataSet,
                    neuron.key
                  )}
                ></neuron-feature-card>
                ${(this.editable || this.settings.showPlots) && neuron.key
                  ? html` <plots-card .featureKey=${neuron.key}></plots-card> `
                  : html``}
              `
            : html`
                <neuron-inputs-card .neuron=${neuron}></neuron-inputs-card>
                <neuron-activation-card
                  .neuron=${neuron}
                ></neuron-activation-card>
              `}
          ${neuron.layer instanceof OutputLayer
            ? html`
                <neuron-label-card
                  .neuron=${neuron}
                  .labelDesc=${this.dataSet.labelDesc}
                ></neuron-label-card>
              `
            : html`
                <neuron-outputs-card .neuron=${neuron}></neuron-outputs-card>
              `}
        </c-panel>
      `
    }
  }
}
