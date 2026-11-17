import { widgetMsg } from '@webwriter/lit/localize'
import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { property, state } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { editableContext } from './contexts'
import type { Settings } from '../model/app-types'
import { settingsContext } from './contexts'
import { CCanvas } from './canvas'
import { canvasContext } from './contexts'
import type { CLayerConf } from '../model/network-types'
import { layerConfsContext } from './contexts'
import { panelContext } from './contexts'

import { GetStartedCard } from './cards/start-get-started-card'
import SlButton from "@shoelace-style/shoelace/dist/components/button/button.component.js"
import SlTooltip from "@shoelace-style/shoelace/dist/components/tooltip/tooltip.component.js"
import SlIcon from "@shoelace-style/shoelace/dist/components/icon/icon.component.js"
import IconZoomIn from "@tabler/icons/outline/zoom-in.svg"
import IconList from "@tabler/icons/outline/list.svg"
import IconZoomOut from "@tabler/icons/outline/zoom-out.svg"
import IconArrowsCollapse from "@tabler/icons/outline/arrows-minimize.svg"
import IconFullscreenMaximize from "@tabler/icons/outline/maximize.svg";
import IconFullscreenMinimize from "@tabler/icons/outline/minimize.svg";

export class CCanvasArea extends LitElementWw {
  private readonly msg = widgetMsg(this);

  static scopedElements = {
    "c-canvas": CCanvas,
    "sl-button": SlButton,
    "sl-tooltip": SlTooltip,
    "sl-icon": SlIcon,
    "start-get-started-card": GetStartedCard
  }

  @consume({ context: editableContext, subscribe: true })
  accessor editable: boolean = false

  @consume({ context: settingsContext, subscribe: true })
  accessor settings: Settings

  @consume({ context: layerConfsContext, subscribe: true })
  accessor layerConfs: CLayerConf[] = []

  @consume({ context: canvasContext, subscribe: true })
  accessor canvas: CCanvas

  @consume({ context: panelContext, subscribe: true })
  accessor panel: string

  @property({ type: Boolean })
  accessor fullscreen = false;

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

  handleSideMenu() {
    if(this.className === ""){
      this.dispatchEvent(
        new Event('close-all-panels', {
          bubbles: true,
          composed: true,
        })
      )
    }else if(this.className === "right-collapsed"){
      this.dispatchEvent(
        new CustomEvent<string>('open-panel', {
          detail: 'start',
          bubbles: true,
          composed: true,
        })
      )
    }
  }

  /**
 * Forwards the fullscreen toggle event.
 * @private
 */
  private async handleFullscreenToggle() {
      this.dispatchEvent(
        new Event('toggle-fullscreen', {})
      )
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
      width: 70%;
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
        <sl-tooltip content=${this.msg('Toggle Menu')}>
          <sl-button @click="${(_e: MouseEvent) => this.handleSideMenu()}" circle>
            <sl-icon src=${IconList}></sl-icon>
          </sl-button>
        </sl-tooltip>
        <sl-tooltip content=${this.msg('Zoom in')}>
          <sl-button @click="${(_e: MouseEvent) => this.zoomInCanvas()}" circle>
            <sl-icon src=${IconZoomIn}></sl-icon>
          </sl-button>
        </sl-tooltip>
        <sl-tooltip content=${this.msg('Zoom to network')}>
          <sl-button @click="${(_e: MouseEvent) => this.centerCanvas()}" circle>
            <sl-icon src=${IconArrowsCollapse}></sl-icon>
          </sl-button>
        </sl-tooltip>
        <sl-tooltip content=${this.msg('Zoom out')}>
          <sl-button
            @click="${(_e: MouseEvent) => this.zoomOutCanvas()}"
            circle
          >
            <sl-icon src=${IconZoomOut}></sl-icon>
          </sl-button>
        </sl-tooltip>
        <sl-tooltip content=${this.fullscreen ? this.msg('Exit Fullscreen') : this.msg('Fullscreen')}>
          <sl-button @click="${(_e: MouseEvent) => this.handleFullscreenToggle()}" circle>
            <sl-icon src=${this.fullscreen ? IconFullscreenMinimize : IconFullscreenMaximize}></sl-icon>
          </sl-button>
        </sl-tooltip>
      </div>
    `
  }
}
