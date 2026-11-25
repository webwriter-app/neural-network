import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html, nothing } from 'lit'
import { consume } from '@lit/context'

import { editableContext } from '../contexts'
import type { Settings } from '../../model/app-types'
import { settingsContext } from '../contexts'
import { InputLayer } from '../network/input-layer'
import { OutputLayer } from '../network/output-layer'
import { CNeuron } from '../network/neuron'
import type { DataSet } from '../../model/data-types'
import { dataSetContext } from '../contexts'
import { DataSetUtils } from '../data-sets/data-set-utils'
import type { SelectedEle } from '../../model/app-types'
import { selectedEleContext } from '../contexts'

import { NeuronInfoCard } from '../cards/neuron-info-card'
import { NeuronFeatureCard } from '../cards/neuron-feature-card'
import { PlotsCard } from '../cards/plots-card'
import { NeuronInputsCard } from '../cards/neuron-inputs-card'
import { NeuronActivationCard } from '../cards/neuron-activation-card'
import { NeuronLabelCard } from '../cards/neuron-label-card'
import { NeuronOutputsCard } from '../cards/neuron-outputs-card'
import { CPanel } from '../reusables/c-panel'

export class NeuronPanel extends LitElementWw {

  static scopedElements = {
    'c-panel': CPanel,
    'neuron-info-card': NeuronInfoCard,
    'neuron-feature-card': NeuronFeatureCard,
    'plots-card': PlotsCard,
    'neuron-inputs-card': NeuronInputsCard,
    'neuron-activation-card': NeuronActivationCard,
    'neuron-label-card': NeuronLabelCard,
    'neuron-outputs-card': NeuronOutputsCard
  }

  @consume({ context: editableContext, subscribe: true })
  accessor editable: boolean = false

  @consume({ context: settingsContext, subscribe: true })
  accessor settings: Settings

  @consume({ context: dataSetContext, subscribe: true })
  accessor dataSet: DataSet

  @consume({ context: selectedEleContext, subscribe: true })
  accessor selectedEle: SelectedEle

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> | typeof nothing {
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
                    neuron.key ?? ''
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
    return nothing
  }
}
