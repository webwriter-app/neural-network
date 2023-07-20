import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { consume } from '@lit-labs/context'
import { dataSetContext } from '@/contexts/data_set_context'
import { DataSet } from '@/data_set/data_set'

import { globalStyles } from '@/global_styles'

import { CLayer } from '@/components/network/c_layer'
import { Neuron } from '@/components/network/neuron'
import { OutputLayer } from '@/components/network/output_layer'
import { InputLayer } from '@/components/network/input_layer'

@customElement('neuron-info-card')
export class NeuronInfoCard extends LitElementWw {
  @property()
  neuron: Neuron

  @property()
  layer: CLayer

  @consume({ context: dataSetContext, subscribe: true })
  dataSet: DataSet

  static styles: CSSResult[] = [globalStyles]

  render(): TemplateResult<1> {
    let type, dataProperty
    if (this.neuron.layer instanceof InputLayer) {
      type = 'feature'
      dataProperty = this.dataSet.getByKey(this.neuron.label)
    } else if (this.neuron.layer instanceof OutputLayer) {
      type = 'label'
      dataProperty = this.dataSet.getByKey(this.neuron.label)
    }
    return html`
      <c-card>
        <div slot="title">Info</div>
        <div slot="content">
          <div>
            <p>
              Selected item:
              <c-network-link .target="${this.neuron}"
                >Neuron ${this.neuron.neuronId}</c-network-link
              >
              inside
              <c-network-link .target="${this.layer}"
                >${this.neuron.layer.getName()}</c-network-link
              >
            </p>
            ${dataProperty
              ? html`
                  <h2>Assigned data</h2>
                  <c-data-info
                    .type="${type}"
                    .dataProperty="${dataProperty}"
                  ></c-data-info>
                `
              : html``}
          </div>
        </div>
      </c-card>
    `
  }
}
