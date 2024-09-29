import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { editableContext } from '@/contexts/editable_context'
import type { Settings } from '@/types/settings'
import { settingsContext } from '@/contexts/settings_context'
import { CCanvas } from '@/components/canvas'
import { canvasContext } from '@/contexts/canvas_context'
import type { CLayerConf } from '@/types/c_layer_conf'
import { layerConfsContext } from '@/contexts/layer_confs_context'
import { panelContext } from '@/contexts/panels_context'

import { GetStartedCard } from '@/components/cards/start_get_started_card'
import SlButton from "@shoelace-style/shoelace/dist/components/button/button.component.js"
import SlTooltip from "@shoelace-style/shoelace/dist/components/tooltip/tooltip.component.js"
import SlIcon from "@shoelace-style/shoelace/dist/components/icon/icon.component.js"
import IconZoomIn from "bootstrap-icons/icons/zoom-in.svg"
import IconZoomOut from "bootstrap-icons/icons/zoom-out.svg"
import IconArrowsCollapse from "bootstrap-icons/icons/arrows-collapse.svg"

export class CCanvasArea extends LitElementWw {

  static scopedElements = {
    "c-canvas": CCanvas,
    "sl-button": SlButton,
    "sl-tooltip": SlTooltip,
    "sl-icon": SlIcon,
    "start-get-started-card": GetStartedCard
  }

  @consume({ context: editableContext, subscribe: true })
  accessor editable: boolean

  @consume({ context: settingsContext, subscribe: true })
  accessor settings: Settings

  @consume({ context: layerConfsContext, subscribe: true })
  accessor layerConfs: CLayerConf[] = []

  @consume({ context: canvasContext, subscribe: true })
  accessor canvas: CCanvas

  @consume({ context: panelContext, subscribe: true })
  accessor panel: string

  @state()
  accessor isDragging: boolean = false

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  zoomInCanvas() {
    this.canvas.zoomIn()
  }

  centerCanvas() {
    this.canvas.fit()
  }

  zoomOutCanvas() {
    this.canvas.zoomOut()
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult = css`
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

    sl-button::part(label) {
      margin: auto;
    }
  `

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-canvas
        @drag-entered="${(_e: Event) => (this.isDragging = true)}"
        @drag-leaved="${(_e: Event) => (this.isDragging = false)}"
      ></c-canvas>

      ${!this.layerConfs.length &&
      !this.panel &&
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
          <sl-button @click="${(_e: MouseEvent) => this.zoomInCanvas()}" circle>
            <sl-icon src=${IconZoomIn}></sl-icon>
          </sl-button>
        </sl-tooltip>
        <sl-tooltip content="Zoom to network">
          <sl-button @click="${(_e: MouseEvent) => this.centerCanvas()}" circle>
            <sl-icon src=${IconArrowsCollapse}></sl-icon>
          </sl-button>
        </sl-tooltip>
        <sl-tooltip content="Zoom out">
          <sl-button
            @click="${(_e: MouseEvent) => this.zoomOutCanvas()}"
            circle
          >
            <sl-icon src=${IconZoomOut}></sl-icon>
          </sl-button>
        </sl-tooltip>
      </div>
    `
  }
}
