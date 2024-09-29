import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { globalStyles } from '@/global_styles'

import type { CCanvas } from '@/components/canvas'
import { canvasContext } from '@/contexts/canvas_context'
import type { CLayer } from '@/components/network/c_layer'
import { OutputLayer } from '@/components/network/output_layer'
import { CCard } from '../reusables/c-card'
import SlIcon from "@shoelace-style/shoelace/dist/components/icon/icon.component.js"
import SlButton from "@shoelace-style/shoelace/dist/components/button/button.component.js"

import IconFiles from "bootstrap-icons/icons/files.svg"
import IconTrash from "bootstrap-icons/icons/trash.svg"

export class LayerActionsCard extends LitElementWw {
  
  static scopedElements = {
    "c-card": CCard,
    "sl-button": SlButton,
    "sl-icon": SlIcon,
  }
  
  @property()
  accessor layer: CLayer

  @consume({ context: canvasContext, subscribe: true })
  accessor canvas: CCanvas

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  handleDuplicateLayer(): void {
    this.layer.duplicate()
  }

  handleDeleteLayer(): void {
    this.layer.delete()
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult = globalStyles

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
                  <sl-icon slot="prefix" src=${IconFiles}></sl-icon>
                  Duplicate
                </sl-button>`
              : html``}
            <sl-button @click="${(_e: MouseEvent) => this.handleDeleteLayer()}">
              <sl-icon slot="prefix" src=${IconTrash}></sl-icon>
              Delete
            </sl-button>
          </div>
        </div>
      </c-card>
    `
  }
}
