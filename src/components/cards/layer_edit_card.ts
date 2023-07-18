import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'

import { consume } from '@lit-labs/context'
import {
  NetworkConf,
  networkConfContext,
} from '@/contexts/network_conf_context'

import { globalStyles } from '@/global_styles'

import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js'

import { CLayer } from '@/components/network/c_layer'
import { NeuronLayer } from '@/components/network/neuron_layer'
import { InputLayer } from '@/components/network/input_layer'
import { DenseLayer } from '@/components/network/dense_layer'
import { OutputLayer } from '@/components/network/output_layer'
import { spawnAlert } from '@/utils/alerts'

import { SlSelect } from '@shoelace-style/shoelace'

@customElement('layer-edit-card')
export class LayerEditCard extends LitElementWw {
  @property()
  layer: CLayer

  @consume({ context: networkConfContext, subscribe: true })
  networkConf: NetworkConf

  @query('#inputSelect')
  _inputSelect: SlSelect

  @query('#outputSelect')
  _outputSelect: SlSelect

  @query('#updateNeuronsForm')
  _updateNeuronsForm: HTMLFormElement

  async connectedCallback() {
    super.connectedCallback()
    await this.updateComplete
    if (this._updateNeuronsForm) {
      this._updateNeuronsForm.addEventListener('submit', (e: SubmitEvent) => {
        this._handleSetNeurons(e)
      })
    }
  }

  _handleRemoveNeuron(): void {
    if (this.layer instanceof NeuronLayer) {
      this.layer.removeNeuron()
    }
  }

  _handleAddNeuron(): void {
    if (this.layer instanceof NeuronLayer) {
      this.layer.addNeuron()
    }
  }

  _handleSetNeurons(e: SubmitEvent): void {
    e.preventDefault()
    const formData = serialize(this._updateNeuronsForm)
    if (typeof formData.units !== 'string')
      throw new Error(
        'The number of neurons in the form should be of type string.'
      )
    const units: number = parseInt(formData.units)
    if (this.layer instanceof DenseLayer) {
      this.layer.setNeurons(units)
    }
    this._updateNeuronsForm.reset()
  }

  _handleDuplicateLayer(): void {
    this.layer.duplicate()
  }

  _handleDeleteLayer(): void {
    this.networkConf.network.removeLayer(this.layer)
    spawnAlert({
      message: `'${this.layer.getName()}' has been deleted!`,
      variant: 'danger',
      icon: 'trash',
    })
  }

  static styles: CSSResult[] = [globalStyles]

  // @TODO: somehow make the number of units reactive, so that when removing
  // multiple neurons, the button to remove is disabled when we reach a units
  // value of 1
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Edit layer</div>
        <div slot="content">
          ${!(
            this.layer instanceof InputLayer ||
            this.layer instanceof OutputLayer
          )
            ? html`<div>
                  <h2>Neurons</h2>
                  <c-button-group>
                    <sl-button
                      .disabled=${this.layer instanceof NeuronLayer &&
                      this.layer.neurons.length <= 1}
                      @click="${(_e: MouseEvent) => this._handleRemoveNeuron()}"
                    >
                      <sl-icon slot="prefix" name="dash-square"></sl-icon>
                      Remove
                    </sl-button>
                    <sl-button
                      @click="${(_e: MouseEvent) => this._handleAddNeuron()}"
                    >
                      <sl-icon slot="prefix" name="plus-square"></sl-icon>
                      Add
                    </sl-button>
                  </c-button-group>
                </div>
                <form id="updateNeuronsForm">
                  <c-button-group>
                    <sl-input
                      name="units"
                      placeholder="neurons"
                      type="number"
                      required
                    ></sl-input>
                    <sl-button type="submit">
                      <sl-icon slot="prefix" name="arrow-clockwise"></sl-icon>
                      Update
                    </sl-button>
                  </c-button-group>
                </form>`
            : html``}
          <h2>Layer</h2>
          <c-button-group>
            ${!(
              this.layer instanceof InputLayer ||
              this.layer instanceof OutputLayer
            )
              ? html` <sl-button
                  @click="${(_e: MouseEvent) => this._handleDuplicateLayer()}"
                >
                  <sl-icon slot="prefix" name="files"></sl-icon>
                  Duplicate
                </sl-button>`
              : html``}
            <sl-button
              @click="${(_e: MouseEvent) => this._handleDeleteLayer()}"
            >
              <sl-icon slot="prefix" name="trash"></sl-icon>
              Delete
            </sl-button>
          </c-button-group>
        </div>
      </c-card>
    `
  }
}
