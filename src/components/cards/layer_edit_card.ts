import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import { consume } from '@lit-labs/context'
import { canvasContext } from '@/contexts/canvas_context'

import type { CCanvas } from '@/components/canvas'

import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js'

import { CLayer } from '@/components/network/c_layer'
import { DenseLayerConf } from '@/components/network/dense_layer_conf'
import { DenseLayer } from '@/components/network/dense_layer'

import { SlSelect } from '@shoelace-style/shoelace'
import { spawnAlert } from '@/utils/alerts'

@customElement('layer-edit-card')
export class LayerEditCard extends LitElementWw {
  @property()
  layer: CLayer

  @consume({ context: canvasContext, subscribe: true })
  canvas: CCanvas

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
    if (this.layer instanceof DenseLayer) {
      this.layer.conf.units--
      this.dispatchEvent(
        new Event('layer-confs-updated', {
          bubbles: true,
          composed: true,
        })
      )
    }
  }

  _handleAddNeuron(): void {
    if (this.layer instanceof DenseLayer) {
      this.layer.conf.units++
      this.dispatchEvent(
        new Event('layer-confs-updated', {
          bubbles: true,
          composed: true,
        })
      )
    }
  }

  _handleSetNeurons(e: SubmitEvent): void {
    e.preventDefault()
    const formData = serialize(this._updateNeuronsForm)
    const units: number = parseInt(<string>formData.units)
    if (this.layer instanceof DenseLayer) {
      this.layer.conf.units = units
    }
    this.dispatchEvent(
      new Event('layer-confs-updated', {
        bubbles: true,
        composed: true,
      })
    )
    this._updateNeuronsForm.reset()
  }

  _handleDuplicateLayer(): void {
    if (this.layer instanceof DenseLayer) {
      const newLayerConf = { ...this.layer.conf }
      newLayerConf.layerId = undefined
      newLayerConf.pos.y -=
        this.canvas.getHeight(this.layer.getCyId()) + this.canvas.LAYER_DISTANCE
      this.dispatchEvent(
        new CustomEvent<DenseLayerConf>('layer-conf-created', {
          detail: newLayerConf,
          bubbles: true,
          composed: true,
        })
      )
    } else {
      spawnAlert({
        message: `The selected layer can not be duplicated!`,
        variant: 'warning',
        icon: 'x-circle',
      })
    }
  }

  _handleDeleteLayer(): void {
    this.dispatchEvent(
      new CustomEvent<CLayer>('query-layer-deletion', {
        detail: this.layer,
        bubbles: true,
        composed: true,
      })
    )
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
          ${this.layer instanceof DenseLayer
            ? html`<div>
                  <h2>Neurons</h2>
                  <c-button-group>
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
            ${this.layer instanceof DenseLayer
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
