import { LitElement } from 'lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js'

import { DenseLayer } from '@/network/dense_layer'

import { SlSelect } from '@shoelace-style/shoelace'

@customElement('layer-neurons-card')
export class LayerNeuronsCard extends LitElement {
  @property()
  layer: DenseLayer

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
    this.layer.conf.units--
    this.requestUpdate()
    this.dispatchEvent(
      new Event('update-layer-confs', {
        bubbles: true,
        composed: true,
      })
    )
  }

  _handleAddNeuron(): void {
    this.layer.conf.units++
    this.requestUpdate()
    this.dispatchEvent(
      new Event('update-layer-confs', {
        bubbles: true,
        composed: true,
      })
    )
  }

  _handleSetNeurons(e: SubmitEvent): void {
    e.preventDefault()
    const formData = serialize(this._updateNeuronsForm)
    const units: number = parseInt(<string>formData.units)
    this.layer.conf.units = units
    this.requestUpdate()
    this.dispatchEvent(
      new Event('update-layer-confs', {
        bubbles: true,
        composed: true,
      })
    )
    this._updateNeuronsForm.reset()
  }

  static styles: CSSResult[] = globalStyles

  // @TODO: somehow make the number of units reactive, so that when removing
  // multiple neurons, the button to remove is disabled when we reach a units
  // value of 1
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Neurons</div>
        <div slot="content">
          <div>
            <div class="button-group">
              <sl-button
                .disabled=${this.layer.conf.units <= 1}
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
            </div>
          </div>
          <form id="updateNeuronsForm">
            <div class="button-group">
              <sl-input
                name="units"
                placeholder="neurons"
                type="number"
                required
                min="1"
              ></sl-input>
              <sl-button type="submit">
                <sl-icon slot="prefix" name="arrow-clockwise"></sl-icon>
                Update
              </sl-button>
            </div>
          </form>
        </div>
      </c-card>
    `
  }
}
