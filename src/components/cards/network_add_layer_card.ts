import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { globalStyles } from '@/global_styles'

import { editableContext } from '@/contexts/editable_context'
import type { Settings } from '@/types/settings'
import { settingsContext } from '@/contexts/settings_context'
import type { CCanvas } from '@/components/canvas'
import { canvasContext } from '@/contexts/canvas_context'
import type { CLayerConf } from '../../types/c_layer_conf'
import { layerConfsContext } from '@/contexts/layer_confs_context'
import { CCard } from '../reusables/c-card'

import { SlButton, SlIcon } from '@shoelace-style/shoelace'

import IconPlusLg from 'bootstrap-icons/icons/plus-lg.svg'
import IconBoxArrowInRight from 'bootstrap-icons/icons/box-arrow-in-right.svg' // Input
import IconLayers from 'bootstrap-icons/icons/layers.svg' // Dense
import IconBoxArrowRight from 'bootstrap-icons/icons/box-arrow-right.svg' // Output
import { msg } from '@lit/localize'

export class NetworkAddLayerCard extends LitElementWw {
  static scopedElements = {
    'c-card': CCard,
    'sl-icon': SlIcon,
    'sl-button': SlButton,
  }

  @consume({ context: editableContext, subscribe: true })
  accessor editable: boolean

  @consume({ context: settingsContext, subscribe: true })
  accessor settings: Settings

  @consume({ context: canvasContext, subscribe: true })
  accessor canvas: CCanvas

  @consume({ context: layerConfsContext, subscribe: true })
  accessor layerConfs: CLayerConf[]

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = [
    globalStyles,
    css`
      .drag-area {
        width: 100%;
        height: 200px;
        border-radius: 5px;
        border-style: dashed;
      }
      .draggable-tag {
        cursor: grab;
        user-select: none;
      }
    `,
  ]

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">${msg('Add layer')}</div>
        <div slot="content">
          <p>${msg('Drag a layer anywhere to place it on the canvas')}</p>
          <div class="tag-group">
            <sl-button
              class="draggable-tag"
              draggable="true"
              ?disabled=${this.editable}
              @dragstart="${(e: DragEvent) =>
                e.dataTransfer.setData('LAYER_TYPE', 'Input')}"
            >
              <sl-icon slot="prefix" src=${IconBoxArrowInRight}></sl-icon>
              Input
            </sl-button>
            ${this.editable || this.settings.allowDenseLayers
              ? html`<sl-button
                class="draggable-tag"
                  draggable="true"
                  @dragstart="${(e: DragEvent) =>
                    e.dataTransfer.setData('LAYER_TYPE', 'Dense')}"
                >
                  <sl-icon slot="prefix" src=${IconLayers}></sl-icon>
                  Dense
                </sl-tag>`
              : html``}
            ${this.layerConfs.every(
              (layerConf) => layerConf.LAYER_TYPE != 'Output',
            )
              ? html`<sl-button
                  class="draggable-tag"
                  draggable="true"
                  @dragstart="${(e: DragEvent) =>
                    e.dataTransfer.setData('LAYER_TYPE', 'Output')}"
                >
                  <sl-icon slot="prefix" src=${IconBoxArrowRight}></sl-icon>
                  ${msg('Output')}
                </sl-tag>`
              : html``}
          </div>
        </div>
      </c-card>
    `
  }
}
