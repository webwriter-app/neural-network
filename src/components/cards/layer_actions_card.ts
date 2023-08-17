import { LitElement } from 'lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import { consume } from '@lit-labs/context'
import { canvasContext } from '@/contexts/canvas_context'

import type { CCanvas } from '@/components/canvas'

import { CLayer } from '@/network/c_layer'
import { InputLayer } from '@/network/input_layer'
import { DenseLayer } from '@/network/dense_layer'
import { OutputLayer } from '@/network/output_layer'

import { spawnAlert } from '@/utils/alerts'

@customElement('layer-actions-card')
export class LayerActionsCard extends LitElement {
  @property()
  layer: CLayer

  @consume({ context: canvasContext, subscribe: true })
  canvas: CCanvas

  _handleDuplicateLayer(): void {
    if (this.layer instanceof InputLayer) {
      const newPos = { ...this.layer.conf.pos }
      newPos.y -=
        this.canvas.getHeight(this.layer.getCyId()) + this.canvas.LAYER_DISTANCE
      InputLayer.create({
        activation: this.layer.conf.activation,
        dataSetKeys: this.layer.conf.dataSetKeys,
        pos: newPos,
      })
    } else if (this.layer instanceof DenseLayer) {
      const newPos = { ...this.layer.conf.pos }
      newPos.y -=
        this.canvas.getHeight(this.layer.getCyId()) + this.canvas.LAYER_DISTANCE
      DenseLayer.create({
        units: this.layer.conf.units,
        activation: this.layer.conf.activation,
        pos: newPos,
      })
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

  static styles: CSSResult[] = globalStyles

  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Actions</div>
        <div slot="content">
          <div class="button-group">
            ${!(this.layer instanceof OutputLayer)
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
          </div>
        </div>
      </c-card>
    `
  }
}
