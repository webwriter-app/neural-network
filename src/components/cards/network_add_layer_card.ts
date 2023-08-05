import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import { canvasContext } from '@/contexts/canvas_context'
import { CCanvas } from '@/components/canvas'

import { InputLayer } from '@/components/network/input_layer'
import { DenseLayer } from '@/components/network/dense_layer'
import { OutputLayer } from '@/components/network/output_layer'
import type { Position } from '@/types/position'

@customElement('network-add-layer-card')
export class NetworkAddLayerCard extends LitElementWw {
  @consume({ context: canvasContext, subscribe: true })
  canvas: CCanvas

  _getModelPosForDragEvent(e: DragEvent): Position {
    const renderedPos = {
      x: e.clientX,
      y: e.clientY,
    }
    return this.canvas.toModelPosition(renderedPos)
  }

  _handleAddInputLayer(e: DragEvent): void {
    InputLayer.create({
      pos: this._getModelPosForDragEvent(e),
    })
  }

  _handleAddDenseLayer(e): void {
    DenseLayer.create({
      pos: this._getModelPosForDragEvent(e),
    })
  }

  _handleAddOutputLayer(e): void {
    OutputLayer.create({
      pos: this._getModelPosForDragEvent(e),
    })
  }

  static styles: CSSResult[] = [globalStyles]

  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Add layer</div>
        <div slot="content">
          Drag a layer onto the canvas
          <c-tag-group>
            <sl-tag
              size="large"
              draggable="true"
              @dragend="${(e: DragEvent) => this._handleAddInputLayer(e)}"
            >
              <sl-icon slot="prefix" name="plus-lg"></sl-icon>
              Input
            </sl-tag>
            <sl-tag
              size="large"
              draggable="true"
              @dragend="${(e: DragEvent) => this._handleAddDenseLayer(e)}"
            >
              <sl-icon slot="prefix" name="plus-lg"></sl-icon>
              Dense
            </sl-tag>
            <sl-tag
              size="large"
              draggable="true"
              @dragend="${(e: DragEvent) => this._handleAddOutputLayer(e)}"
            >
              <sl-icon slot="prefix" name="plus-lg"></sl-icon>
              Output
            </sl-tag>
          </c-tag-group>
        </div>
      </c-card>
    `
  }
}
