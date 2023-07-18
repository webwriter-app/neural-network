import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { customElement, query } from 'lit/decorators.js'

import { consume } from '@lit-labs/context'
import {
  NetworkConf,
  networkConfContext,
} from '@/contexts/network_conf_context'
import { Canvas, canvasContext } from '@/contexts/canvas_context'

import { globalStyles } from '@/global_styles'

import '@/components/cards/canvas_info_card'
import '@/components/cards/get_started_card'

@customElement('canvas-area')
export class CanvasArea extends LitElementWw {
  @query('#canvasElm') _canvasElm: HTMLDivElement

  @consume({ context: networkConfContext, subscribe: true })
  networkConf: NetworkConf

  @consume({ context: canvasContext, subscribe: true })
  canvas: Canvas

  async connectedCallback() {
    super.connectedCallback()

    await this.updateComplete

    // notify the root element that the canvas was created
    this.dispatchEvent(
      new CustomEvent<HTMLDivElement>('canvas-created', {
        detail: this._canvasElm,
        bubbles: true,
        composed: true,
      })
    )
  }

  /* STYLES */
  static styles: CSSResult[] = [
    globalStyles,
    css`
      :host {
        position: relative;
      }

      #canvasElm {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
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
      <div id="canvasElm"></div>
      ${!this.networkConf.layers.size
        ? html`
            <c-panel id="welcomeArea">
              <canvas-info-card></canvas-info-card>
              <get-started-card></get-started-card>
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
