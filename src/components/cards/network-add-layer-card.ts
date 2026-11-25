import { widgetMsg } from '@webwriter/lit/localize'
import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, css, html } from 'lit'
import { query, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { consume } from '@lit/context'

import { globalStyles } from '../global-styles'

import { editableContext } from '../contexts'
import type { Settings } from '../../model/app-types'
import { settingsContext } from '../contexts'
import type { CCanvas } from '../canvas'
import type { LayerType } from '../../model/network-types'
import { canvasContext } from '../contexts'
import type { CLayerConf } from '../../model/network-types'
import { layerConfsContext } from '../contexts'
import { CCard } from '../reusables/c-card'

import SlButton from "@shoelace-style/shoelace/dist/components/button/button.component.js"
import SlIcon from "@shoelace-style/shoelace/dist/components/icon/icon.component.js"

import IconBoxArrowInRight from '@tabler/icons/outline/login.svg' // Input
import IconLayers from '@tabler/icons/outline/stack-2.svg' // Dense
import IconBoxArrowRight from '@tabler/icons/outline/logout.svg' // Output
import type { MsgFn } from '@lit/localize';

const LAYER_BUTTONS: Record<LayerType, { icon: string; label: (msg: MsgFn) => string }> =
  {
    Input: { icon: IconBoxArrowInRight, label: (msg) => msg('Input') },
    Dense: { icon: IconLayers, label: (msg) => msg('Dense') },
    Output: { icon: IconBoxArrowRight, label: (msg) => msg('Output') },
  }

type LayerDragState = {
  pointerId: number
  layerType: LayerType
  source: HTMLElement
  previewOffsetX: number
  previewOffsetY: number
  clientX: number
  clientY: number
}

export class NetworkAddLayerCard extends LitElementWw {
  private readonly msg = widgetMsg(this);
  static scopedElements = {
    'c-card': CCard,
    'sl-icon': SlIcon,
    'sl-button': SlButton,
  }

  @consume({ context: editableContext, subscribe: true })
  accessor editable: boolean = false

  @consume({ context: settingsContext, subscribe: true })
  accessor settings: Settings

  @consume({ context: canvasContext, subscribe: true })
  accessor canvas: CCanvas

  @consume({ context: layerConfsContext, subscribe: true })
  accessor layerConfs: CLayerConf[]

  @state()
  accessor layerDragState: LayerDragState | null = null

  @query('.drag-preview')
  accessor _dragPreview: HTMLElement

  private layerDragFrame: number | null = null

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  disconnectedCallback(): void {
    this.cleanupLayerDrag()
    super.disconnectedCallback()
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> DRAGGING LAYERS  - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  private handleLayerPointerDown(e: PointerEvent, layerType: LayerType): void {
    if (this.layerDragState || e.button !== 0 || !this.canvas) return

    const source = <SlButton>e.currentTarget
    if (source.disabled) return

    e.preventDefault()
    source.setPointerCapture(e.pointerId)

    const rect = source.getBoundingClientRect()
    this.layerDragState = {
      pointerId: e.pointerId,
      layerType,
      source,
      previewOffsetX: e.clientX - rect.left,
      previewOffsetY: e.clientY - rect.top,
      clientX: e.clientX,
      clientY: e.clientY,
    }
    this.requestLayerDragFrame()
  }

  private handleLayerPointerMove(e: PointerEvent): void {
    if (e.pointerId !== this.layerDragState?.pointerId) return

    e.preventDefault()
    this.layerDragState.clientX = e.clientX
    this.layerDragState.clientY = e.clientY
    this.requestLayerDragFrame()
  }

  private handleLayerPointerEnd(e: PointerEvent): void {
    const state = this.layerDragState
    if (!state || e.pointerId !== state.pointerId) return

    // pointercancel or a lost pointer capture abort the drag without adding a
    // layer
    this.cleanupLayerDrag(
      e.type === 'pointerup'
        ? { layerType: state.layerType, clientX: e.clientX, clientY: e.clientY }
        : undefined
    )
  }

  private requestLayerDragFrame(): void {
    if (this.layerDragFrame !== null) return
    this.layerDragFrame = requestAnimationFrame(() => this.runLayerDragFrame())
  }

  // moving the preview, panning and hit testing are bundled into one animation
  // frame to avoid multiple layout updates per frame
  private runLayerDragFrame(): void {
    this.layerDragFrame = null
    const state = this.layerDragState
    if (!state || !this.canvas) return

    // read layout before writing the preview position
    const didPan = this.canvas.dragLayerOver(state.clientX, state.clientY)
    if (this._dragPreview) {
      this._dragPreview.style.transform = `translate3d(${state.clientX - state.previewOffsetX}px, ${state.clientY - state.previewOffsetY}px, 0)`
    }

    // keep panning even if the pointer rests close to the edge of the canvas
    if (didPan) this.requestLayerDragFrame()
  }

  private cleanupLayerDrag(
    drop?: Parameters<CCanvas['endLayerDrag']>[0]
  ): void {
    const state = this.layerDragState
    this.layerDragState = null

    if (this.layerDragFrame !== null) cancelAnimationFrame(this.layerDragFrame)
    this.layerDragFrame = null
    if (!state) return

    if (state.source.hasPointerCapture(state.pointerId)) {
      state.source.releasePointerCapture(state.pointerId)
    }
    this.canvas?.endLayerDrag(drop)
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = [
    globalStyles,
    css`
      .draggable-tag {
        cursor: grab;
        user-select: none;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        touch-action: none;
      }
      .draggable-tag::part(base) {
        touch-action: none;
      }
      .draggable-tag.drag-source {
        opacity: 0.5;
      }
      .drag-preview {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        opacity: 0.8;
        pointer-events: none;
        user-select: none;
        will-change: transform;
      }
    `,
  ]

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  private renderLayerContent(layerType: LayerType): TemplateResult<1> {
    const { icon, label } = LAYER_BUTTONS[layerType]
    return html`<sl-icon slot="prefix" src=${icon}></sl-icon>${label(this.msg)}`
  }

  private renderLayerButton(
    layerType: LayerType,
    disabled = false
  ): TemplateResult<1> {
    return html`<sl-button
      class=${classMap({
        'draggable-tag': true,
        'drag-source': this.layerDragState?.layerType === layerType,
      })}
      ?disabled=${disabled}
      @pointerdown=${(e: PointerEvent) =>
        this.handleLayerPointerDown(e, layerType)}
      @pointermove=${(e: PointerEvent) => this.handleLayerPointerMove(e)}
      @pointerup=${(e: PointerEvent) => this.handleLayerPointerEnd(e)}
      @pointercancel=${(e: PointerEvent) => this.handleLayerPointerEnd(e)}
      @lostpointercapture=${(e: PointerEvent) => this.handleLayerPointerEnd(e)}
      @contextmenu=${(e: Event) => e.preventDefault()}
      >${this.renderLayerContent(layerType)}</sl-button
    >`
  }

  private renderDragPreview(): TemplateResult<1> {
    const layerType = this.layerDragState?.layerType
    if (!layerType) return html``
    // the preview is positioned by runLayerDragFrame
    return html`<sl-button class="drag-preview"
      >${this.renderLayerContent(layerType)}</sl-button
    >`
  }

  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">${this.msg('Add layer')}</div>
        <div slot="content">
          <p>${this.msg('Drag a layer anywhere to place it on the canvas')}</p>
          <div class="tag-group">
            ${this.renderLayerButton('Input', this.editable)}
            ${this.editable || this.settings.allowDenseLayers
              ? this.renderLayerButton('Dense')
              : html``}
            ${this.layerConfs.every(
              (layerConf) => layerConf.LAYER_TYPE != 'Output'
            )
              ? this.renderLayerButton('Output')
              : html``}
          </div>
        </div>
      </c-card>
      ${this.renderDragPreview()}
    `
  }
}
