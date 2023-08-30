import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import type { DataSet } from '@/types/data_set'
import { dataSetContext } from '@/contexts/data_set_context'
import { DataSetUtils } from '@/utils/data_set_utils'
import type { Neuron } from '@/components/network/neuron'
import { OutputLayer } from '@/components/network/output_layer'
import { InputLayer } from '@/components/network/input_layer'

@customElement('neuron-info-card')
export class NeuronInfoCard extends LitElementWw {
  @property({ attribute: false })
  neuron: Neuron

  @consume({ context: dataSetContext, subscribe: true })
  dataSet: DataSet

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult = globalStyles

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    let type, dataDesc
    if (this.neuron.layer instanceof InputLayer) {
      type = 'feature'
      dataDesc = DataSetUtils.getDataSetInputByKey(
        this.dataSet,
        this.neuron.key
      )
    } else if (this.neuron.layer instanceof OutputLayer) {
      type = 'label'
      dataDesc = this.dataSet.labelDesc
    }
    return html`
      <c-card>
        <div slot="title">Neuron</div>
        <div slot="content">
          <div>
            <p>
              Name:
              <c-network-link .target=${this.neuron}
                >${this.neuron.getName()}</c-network-link
              >
            </p>
            <p>
              Corresponding layer:
              <c-network-link .target=${this.neuron.layer}
                >${this.neuron.layer.getName()}</c-network-link
              >
            </p>
            ${dataDesc
              ? html`
                  <h2>Assigned data</h2>
                  <c-data-info
                    .type=${type}
                    .dataDesc=${dataDesc}
                    .dataSet=${this.dataSet}
                  ></c-data-info>
                `
              : html``}
          </div>
        </div>
      </c-card>
    `
  }
}
