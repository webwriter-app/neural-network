import { LitElement } from 'lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { consume } from '@lit-labs/context'
import { dataSetContext } from '@/contexts/data_set_context'
import { DataSet, getDataSetInputByKey } from '@/data_set/data_set'

import { globalStyles } from '@/global_styles'

import { Neuron } from '@/network/neuron'
import { OutputLayer } from '@/network/output_layer'
import { InputLayer } from '@/network/input_layer'

@customElement('neuron-info-card')
export class NeuronInfoCard extends LitElement {
  @property({ attribute: false })
  neuron: Neuron

  @consume({ context: dataSetContext, subscribe: true })
  dataSet: DataSet
  getDataSetInputByKey = getDataSetInputByKey

  static styles: CSSResult[] = globalStyles

  render(): TemplateResult<1> {
    let type, dataProperty
    if (this.neuron.layer instanceof InputLayer) {
      type = 'feature'
      dataProperty = this.getDataSetInputByKey(this.neuron.label)
    } else if (this.neuron.layer instanceof OutputLayer) {
      type = 'label'
      dataProperty = this.dataSet.label
    }
    return html`
      <c-card>
        <div slot="title">Neuron</div>
        <div slot="content">
          <div>
            <p>
              Name:
              <c-network-link .target="${this.neuron}"
                >${this.neuron.getName()}</c-network-link
              >
            </p>
            <p>
              Corresponding layer:
              <c-network-link .target="${this.neuron.layer}"
                >${this.neuron.layer.getName()}</c-network-link
              >
            </p>
            ${dataProperty
              ? html`
                  <h2>Assigned data</h2>
                  <c-data-info
                    .type="${type}"
                    .dataProperty="${dataProperty}"
                    .dataSet="${this.dataSet}"
                  ></c-data-info>
                `
              : html``}
          </div>
        </div>
      </c-card>
    `
  }
}
