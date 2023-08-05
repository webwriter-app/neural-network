import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import { layerConfsContext } from '@/contexts/layer_confs_context'
import { canvasContext } from '@/contexts/canvas_context'

import type { CCanvas } from '@/components/canvas'

import { CLayerConf } from '@/components/network/c_layer_conf'

import '@/components/canvas'
import '@/components/cards/canvas_info_card'
import '@/components/cards/canvas_get_started_card'

@customElement('canvas-area')
export class CCanvasArea extends LitElementWw {
  @consume({ context: layerConfsContext, subscribe: true })
  layerConfs: CLayerConf[]

  @consume({ context: canvasContext, subscribe: true })
  canvas: CCanvas

  async connectedCallback() {
    super.connectedCallback()

    await this.updateComplete
  }

  /* STYLES */
  static styles: CSSResult[] = [
    globalStyles,
    css`
      :host {
        position: relative;
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

  _handleZoomIn() {
    this.canvas.zoomIn()
  }

  _handleCenter() {
    this.canvas.fit()
  }

  _handleZoomOut() {
    this.canvas.zoomOut()
  }

  render(): TemplateResult<1> {
    return html`
      <c-canvas></c-canvas>
      ${!this.layerConfs.length
        ? html`
            <c-panel id="welcomeArea">
              <canvas-info-card></canvas-info-card>
              <canvas-get-started-card></canvas-get-started-card>
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
