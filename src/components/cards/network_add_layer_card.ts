import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import { editableContext } from '@/contexts/editable_context'
import { settingsContext, Settings } from '@/contexts/settings_context'
import { canvasContext } from '@/contexts/canvas_context'
import { CCanvas } from '@/components/canvas'

import { layerConfsContext } from '@/contexts/layer_confs_context'
import { CLayerConf } from '../../network/c_layer_conf'

@customElement('network-add-layer-card')
export class NetworkAddLayerCard extends LitElementWw {
  @consume({ context: editableContext, subscribe: true })
  editable: boolean

  @consume({ context: settingsContext, subscribe: true })
  settings: Settings

  @consume({ context: canvasContext, subscribe: true })
  canvas: CCanvas

  @consume({ context: layerConfsContext, subscribe: true })
  layerConfs: CLayerConf[]

  static styles: CSSResult[] = [
    globalStyles,
    css`
      .drag-area {
        width: 100%;
        height: 200px;
        border-radius: 5px;
        border-style: dashed;
      }
    `,
  ]

  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Add layer</div>
        <div slot="content">
          Drag a layer anywhere to place it on the canvas
          <div class="tag-group">
            <sl-tag
              size="large"
              draggable="true"
              ?disabled=${this.editable}
              @dragstart="${(e: DragEvent) =>
                e.dataTransfer.setData('LAYER_TYPE', 'Input')}"
            >
              <sl-icon slot="prefix" name="plus-lg"></sl-icon>
              Input
            </sl-tag>
            ${this.editable || this.settings.allowDenseLayers
              ? html`<sl-tag
                  size="large"
                  draggable="true"
                  @dragstart="${(e: DragEvent) =>
                    e.dataTransfer.setData('LAYER_TYPE', 'Dense')}"
                >
                  <sl-icon slot="prefix" name="plus-lg"></sl-icon>
                  Dense
                </sl-tag>`
              : html``}
            ${this.layerConfs.every(
              (layerConf) => layerConf.LAYER_TYPE != 'Output'
            )
              ? html` <sl-tag
                  size="large"
                  draggable="true"
                  @dragstart="${(e: DragEvent) =>
                    e.dataTransfer.setData('LAYER_TYPE', 'Output')}"
                >
                  <sl-icon slot="prefix" name="plus-lg"></sl-icon>
                  Output
                </sl-tag>`
              : html``}
          </div>
        </div>
      </c-card>
    `
  }
}
