import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import { editableContext } from '@/contexts/editable_context'
import { settingsContext, Settings } from '@/contexts/settings_context'
import { layerConfsContext } from '@/contexts/layer_confs_context'
import { canvasContext } from '@/contexts/canvas_context'

import type { CCanvas } from '@/components/canvas'

import { CLayerConf } from '@/types/c_layer_conf'

import '@/components/canvas'
import '@/components/cards/start_get_started_card'

@customElement('canvas-area')
export class CCanvasArea extends LitElementWw {
  @consume({ context: editableContext, subscribe: true })
  editable: boolean

  @consume({ context: settingsContext, subscribe: true })
  settings: Settings

  @consume({ context: layerConfsContext, subscribe: true })
  layerConfs: CLayerConf[]

  @consume({ context: canvasContext, subscribe: true })
  canvas: CCanvas

  @state()
  isDragging: boolean = false

  _handleZoomIn() {
    this.canvas.zoomIn()
  }

  _handleCenter() {
    this.canvas.fit()
  }

  _handleZoomOut() {
    this.canvas.zoomOut()
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = [
    ...globalStyles,
    css`
      :host {
        position: relative;
        display: block;
        width: 100%;
        height: 100%;
      }

      c-canvas {
        width: 100%;
        height: 100%;
      }

      #welcomeArea {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        max-height: 100%;
        padding: 10px;
        overflow-y: auto;
      }

      #canvasActions {
        position: absolute;
        bottom: 10px;
        right: 10px;
        display: grid;
        gap: 10px;
      }
    `,
  ]

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-canvas
        @drag-entered="${(_e: Event) => (this.isDragging = true)}"
        @drag-leaved="${(_e: Event) => (this.isDragging = false)}"
      ></c-canvas>

      ${!this.layerConfs.length &&
      this.canvas &&
      !this.isDragging &&
      (this.editable || this.settings.mayImport)
        ? html`
            <c-panel id="welcomeArea">
              <start-get-started-card></start-get-started-card>
            </c-panel>
          `
        : html``}
      <div id="canvasActions">
        <sl-tooltip content="Zoom in">
          <sl-button
            @click="${(_e: MouseEvent) => this._handleZoomIn()}"
            circle
          >
            <sl-icon name="zoom-in"></sl-icon>
          </sl-button>
        </sl-tooltip>
        <sl-tooltip content="Zoom to network">
          <sl-button
            @click="${(_e: MouseEvent) => this._handleCenter()}"
            circle
          >
            <sl-icon name="arrows-collapse"></sl-icon>
          </sl-button>
        </sl-tooltip>
        <sl-tooltip content="Zoom out">
          <sl-button
            @click="${(_e: MouseEvent) => this._handleZoomOut()}"
            circle
          >
            <sl-icon name="zoom-out"></sl-icon>
          </sl-button>
        </sl-tooltip>
      </div>
    `
  }
}
