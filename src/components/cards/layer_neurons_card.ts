import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import type { DenseLayer } from '@/components/network/dense_layer'

import type { SlSelect } from '@shoelace-style/shoelace'
import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js'

@customElement('layer-neurons-card')
export class LayerNeuronsCard extends LitElementWw {
  @property()
  layer: DenseLayer

  @query('#inputSelect')
  _inputSelect: SlSelect

  @query('#outputSelect')
  _outputSelect: SlSelect

  @query('#updateNeuronsForm')
  _updateNeuronsForm: HTMLFormElement

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async connectedCallback() {
    super.connectedCallback()
    await this.updateComplete
    if (this._updateNeuronsForm) {
      this._updateNeuronsForm.addEventListener('submit', (e: SubmitEvent) => {
        this.handleSetNeurons(e)
      })
    }
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  handleRemoveNeuron(): void {
    this.layer.conf.units--
    this.requestUpdate()
    this.dispatchEvent(
      new Event('update-layer-confs', {
        bubbles: true,
        composed: true,
      })
    )
  }

  handleAddNeuron(): void {
    this.layer.conf.units++
    this.requestUpdate()
    this.dispatchEvent(
      new Event('update-layer-confs', {
        bubbles: true,
        composed: true,
      })
    )
  }

  handleSetNeurons(e: SubmitEvent): void {
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

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = globalStyles

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Neurons</div>
        <div slot="content">
          <div>
            <div class="button-group">
              <sl-button
                .disabled=${this.layer.conf.units <= 1}
                @click="${(_e: MouseEvent) => this.handleRemoveNeuron()}"
              >
                <sl-icon slot="prefix" name="dash-square"></sl-icon>
                Remove
              </sl-button>
              <sl-button @click="${(_e: MouseEvent) => this.handleAddNeuron()}">
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
