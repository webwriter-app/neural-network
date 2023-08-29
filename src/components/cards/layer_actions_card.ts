import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import type { CCanvas } from '@/components/canvas'
import { canvasContext } from '@/contexts/canvas_context'
import type { CLayer } from '@/components/network/c_layer'
import { OutputLayer } from '@/components/network/output_layer'

@customElement('layer-actions-card')
export class LayerActionsCard extends LitElementWw {
  @property()
  layer: CLayer

  @consume({ context: canvasContext, subscribe: true })
  canvas: CCanvas

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  handleDuplicateLayer(): void {
    this.layer.duplicate()
  }

  handleDeleteLayer(): void {
    this.layer.delete()
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = globalStyles

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Actions</div>
        <div slot="content">
          <div class="button-group">
            ${!(this.layer instanceof OutputLayer)
              ? html` <sl-button
                  @click="${(_e: MouseEvent) => this.handleDuplicateLayer()}"
                >
                  <sl-icon slot="prefix" name="files"></sl-icon>
                  Duplicate
                </sl-button>`
              : html``}
            <sl-button @click="${(_e: MouseEvent) => this.handleDeleteLayer()}">
              <sl-icon slot="prefix" name="trash"></sl-icon>
              Delete
            </sl-button>
          </div>
        </div>
      </c-card>
    `
  }
}
