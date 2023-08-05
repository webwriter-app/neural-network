import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, query } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import { consume } from '@lit-labs/context'
import { networkContext } from '@/contexts/network_context'
import { dataSetContext } from '@/contexts/data_set_context'
import { Model, modelContext } from '@/contexts/model_context'

import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js'

import { DataSetInput } from '@/types/data_set_input'
import { InputLayer } from '@/components/network/input_layer'
import { DataSet, getDataSetInputsByKeys } from '@/data_set/data_set'
import { Network } from '@/components/network/network'

@customElement('predict-card')
export class PredictCard extends LitElementWw {
  @consume({ context: networkContext, subscribe: true })
  network: Network

  @consume({ context: dataSetContext, subscribe: true })
  dataSet: DataSet
  getDataSetInputsByKeys = getDataSetInputsByKeys

  @consume({ context: modelContext, subscribe: true })
  model: Model

  @query('#predictForm')
  _predictForm: HTMLFormElement

  async connectedCallback() {
    super.connectedCallback()
    await this.updateComplete
    this._predictForm.addEventListener('submit', (e: SubmitEvent) =>
      this._handlePredict(e)
    )
  }

  _handlePredict(e: SubmitEvent): void {
    e.preventDefault()
    const formData = serialize(this._predictForm)
    this._predictForm.reset()
  }

  getInputFieldsForLayer(layer: InputLayer): TemplateResult<1>[] {
    const assignedInputs: DataSetInput[] = this.getDataSetInputsByKeys(
      layer.conf.dataSetKeys
    )
    return assignedInputs.map((assignedInput: DataSetInput) => {
      return html`
        <sl-tooltip content=${assignedInput['description']}>
          <sl-input
            name="${assignedInput['key']}"
            label="${assignedInput['key']}"
            type="number"
            required
          ></sl-input>
        </sl-tooltip>
      `
    })
  }

  getInputFields(): TemplateResult<1>[] {
    const inputLayers = this.network.getInputLayers()
    return inputLayers.map((inputLayer) => {
      return html`
        ${inputLayer.getName()} ${this.getInputFieldsForLayer(inputLayer)}
      `
    })
  }

  static styles: CSSResult[] = [globalStyles]

  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Predict</div>
        <form slot="content" id="predictForm">
          ${this.getInputFields()}
          <sl-button variant="primary" type="submit">
            Predict
            <sl-icon slot="suffix" name="send"></sl-icon>
          </sl-button>
        </form>
      </c-card>
    `
  }
}
