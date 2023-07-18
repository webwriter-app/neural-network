import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import { CLayer } from '@/components/network/c_layer'
import { Neuron } from '@/components/network/neuron'
import { DataSet } from '@/data_set/data_set'
import { OutputLayer } from '@/components/network/output_layer'
import { InputLayer } from '@/components/network/input_layer'

@customElement('neuron-info-card')
export class NeuronInfoCard extends LitElementWw {
  @property()
  neuron: Neuron

  @property()
  layer: CLayer

  @property()
  dataSet: DataSet

  static styles: CSSResult[] = [globalStyles]

  render(): TemplateResult<1> {
    let dataProperty
    if (this.neuron.layer instanceof InputLayer) {
      dataProperty = this.dataSet.getByKey(this.neuron.label)
    } else if (this.neuron.layer instanceof OutputLayer) {
      dataProperty = this.neuron.layer.dataSetLabel
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
                  <c-data-info .dataProperty="${dataProperty}"></c-data-info>
                `
              : html``}
          </div>
        </div>
      </c-card>
    `
  }
}
