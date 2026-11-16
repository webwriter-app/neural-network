import { LitElementWw } from '@webwriter/lit'
import { widgetMsg } from '@webwriter/lit/localize'
import { SceneController } from '@webwriter/lit/scene'
import { Viewport } from '@webwriter/lit/viewport'
import {
  Scene,
  sceneElements,
  webglAvailable,
  type ActivateDetail,
  type MoveDetail,
  type SelectDetail,
} from '@webwriter/widget/scene'
import { PixiScene } from '@webwriter/widget/scene/pixi'
import { CSSResult, TemplateResult, css, html, nothing } from 'lit'
import { state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { consume } from '@lit/context'

import type { DataSet } from '../model/data-types'
import type { Selected } from '../model/app-types'
import type {
  CLayerConf,
  CLayerConnectionConf,
  LayerType,
  Position,
} from '../model/network-types'
import {
  NEURON_RADIUS,
  NEURON_SIZE,
  LAYER_RADIUS,
  edgeSign,
  edgeWidth,
  layoutNetwork,
  type LayerLayout,
  type NeuronLayout,
} from '../model/network-layout'
import { ModelUtils } from '../model/model-utils'
import {
  dataSetContext,
  layerConfsContext,
  layerConnectionConfsContext,
  networkContext,
  selectedContext,
} from './contexts'
import type { CNetwork } from './network/network'
import { layerName } from './network/layer-name'
import { InputLayer } from './network/input-layer'
import { DenseLayer } from './network/dense-layer'
import { OutputLayer } from './network/output-layer'

// the keys of the scene items
const layerKey = (id: string) => `layer-${id}`
const neuronKey = (id: string) => `neuron-${id}`
const edgeKey = (id: string) => `edge-${id}`

const ZOOM_STEP = 0.1

// The drawing of the network: layers with their neurons, and the edges between
// the neurons, on a Scene that the reader can pan and zoom.
export class CCanvas extends LitElementWw {
  static scopedElements = {
    ...sceneElements,
    'ww-scene': webglAvailable() ? PixiScene : Scene,
  }

  private readonly msg = widgetMsg(this)

  @consume({ context: layerConfsContext, subscribe: true })
  accessor layerConfs: CLayerConf[] = []

  @consume({ context: layerConnectionConfsContext, subscribe: true })
  accessor layerConnectionConfs: CLayerConnectionConf[] = []

  @consume({ context: dataSetContext, subscribe: true })
  accessor dataSet: DataSet

  @consume({ context: selectedContext, subscribe: true })
  accessor selected: Selected = {}

  @consume({ context: networkContext, subscribe: true })
  accessor network: CNetwork | undefined

  @state()
  accessor dragOver = false

  readonly viewport: Viewport = new Viewport(this, {
    bounds: () => this.scene.extent(),
    // the reader can pan the network far out of the window
    margin: 5000,
  })
  readonly scene: SceneController = new SceneController(this, {
    viewport: this.viewport.core,
  })

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async connectedCallback() {
    super.connectedCallback()
    await this.updateComplete

    // notify the root element that the canvas was created
    this.dispatchEvent(
      new CustomEvent<CCanvas>('canvas-created', {
        detail: this,
        bubbles: true,
        composed: true,
      })
    )

    // notify the root element that the setup for the canvas is completed
    this.dispatchEvent(
      new CustomEvent<string>('setup-completed', {
        detail: 'canvas',
        bubbles: true,
        composed: true,
      })
    )
  }

  // the first fit waits until the scene has measured its texts and nodes
  protected firstUpdated(): void {
    this.scene.ready.then(() => this.fit())
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> VIEW - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  zoomIn(): void {
    this.viewport.zoomTo(this.viewport.scale + ZOOM_STEP)
  }

  zoomOut(): void {
    this.viewport.zoomTo(this.viewport.scale - ZOOM_STEP)
  }

  // fit the canvas to all layers. The view stays where it is when layers are
  // moved or added (data-ww-viewport-follow="none")
  fit(): void {
    this.viewport.fit()
  }

  // the position in the middle of what the canvas currently shows
  generatePos(): Position {
    const rect = this.getBoundingClientRect()
    return this.viewport.toWorld(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2
    )
  }

  // -> DRAGGING LAYERS FROM THE PALETTE - - - - - - - - - - - - - - - - - - - -
  dragLayerOver(clientX: number, clientY: number): boolean {
    const dragOver = this.isClientPointInside(clientX, clientY)
    const didPan = dragOver && this.viewport.autoPan(clientX, clientY)
    this.setDragOver(dragOver)
    return didPan
  }

  // end a layer drag and add the dropped layer if it was dropped on the canvas
  endLayerDrag(drop?: {
    layerType: LayerType
    clientX: number
    clientY: number
  }): void {
    this.setDragOver(false)
    if (!drop) return
    if (!this.isClientPointInside(drop.clientX, drop.clientY)) return

    const pos = this.viewport.toWorld(drop.clientX, drop.clientY)
    const layerClasses = {
      Input: InputLayer,
      Dense: DenseLayer,
      Output: OutputLayer,
    }
    layerClasses[drop.layerType].create({ pos })
  }

  private isClientPointInside(clientX: number, clientY: number): boolean {
    return !!this.shadowRoot
      ?.elementFromPoint(clientX, clientY)
      ?.closest('#canvasElm')
  }

  private setDragOver(dragOver: boolean): void {
    if (dragOver === this.dragOver) return
    this.dragOver = dragOver
    this.dispatchEvent(
      new Event(dragOver ? 'drag-entered' : 'drag-leaved', {
        bubbles: true,
        composed: true,
      })
    )
  }

  // -> EVENTS FROM THE SCENE  - - - - - - - - - - - - - - - - - - - - - - - - -
  private emit<Detail>(type: string, detail?: Detail): void {
    this.dispatchEvent(
      new CustomEvent<Detail | undefined>(type, {
        detail,
        bubbles: true,
        composed: true,
      })
    )
  }

  // tells the widget what the reader selected. Nothing selected is a tap on
  // the background: close the panels
  private select(key: string | undefined): void {
    if (key?.startsWith('layer-')) {
      this.emit('select-layer', key.slice('layer-'.length))
    } else if (key?.startsWith('neuron-')) {
      this.emit('select-neuron', key.slice('neuron-'.length))
    } else if (key?.startsWith('edge-')) {
      this.emit('select-edge', key.slice('edge-'.length))
    } else {
      this.emit('unselect')
      this.emit('close-all-panels')
    }
  }

  private onSelect(event: CustomEvent<SelectDetail>): void {
    if (event.defaultPrevented) return
    this.select(event.detail.keys[0])
  }

  // every click, also on an item that is selected already, which reopens its
  // panel. A click on a neuron or an edge inside a layer is meant for that
  // neuron or edge, a drag on it moves the layer
  private onActivate(event: CustomEvent<ActivateDetail>): void {
    if (event.defaultPrevented) return
    const hit = event.detail.hit?.getAttribute('data-ww-key') ?? ''
    this.select(/^(neuron|edge)-/.test(hit) ? hit : event.detail.key)
  }

  private onMove(event: CustomEvent<MoveDetail>): void {
    let moved = false
    for (const { key, x, y } of event.detail.items) {
      const conf = this.layerConfs.find((layerConf) => layerKey(`${layerConf.layerId}`) === key)
      if (!conf) continue
      conf.pos = { x, y }
      moved = true
    }
    if (moved) this.emit('update-layer-confs')
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult = css`
    :host {
      display: block;
      --main: var(--sl-color-primary-200);
      --text: var(--sl-color-primary-900);
      --accent: var(--sl-color-primary-500);
      --selected: var(--sl-color-primary-900);
      --positive: var(--sl-color-success-500);
      --negative: var(--sl-color-danger-500);
    }

    #canvasElm {
      position: relative;
      height: 100%;
      width: 100%;
    }

    #canvasElm.drag-over::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 10;
      border: 2px dashed var(--sl-color-primary-500);
      pointer-events: none;
    }

    ww-scene {
      display: block;
      width: 100%;
      height: 100%;
      color: var(--text);
      font-family: var(--sl-font-sans);
      font-size: 16px;
    }

    ww-shape.body {
      fill: var(--main);
      stroke: var(--accent);
      stroke-width: 5px;
    }

    ww-group[selected] > ww-shape.body {
      stroke: var(--selected);
    }

    ww-text.label {
      fill: var(--text);
      font-size: 16px;
      text-anchor: end;
    }

    ww-path {
      stroke: var(--accent);
      stroke-width: var(--width, 3px);
      stroke-linecap: round;
    }

    ww-path.positive {
      stroke: var(--positive);
    }

    ww-path.negative {
      stroke: var(--negative);
    }

    ww-path[selected] {
      stroke: var(--selected);
    }

    ww-node.neuron {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 5px solid var(--accent);
      border-radius: 10px;
      background: var(--main);
      outline: none;
      user-select: none;
    }

    ww-node.neuron[selected] {
      border-color: var(--selected);
    }

    ww-node.neuron .key {
      position: absolute;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 12px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    ww-node.neuron .key.top {
      top: 4px;
    }

    ww-node.neuron .key.bottom {
      bottom: 4px;
    }
  `

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  private renderNeuron(layer: LayerLayout, neuron: NeuronLayout): TemplateResult<1> {
    const half = NEURON_SIZE / 2
    return html`
      <ww-node
        class="neuron"
        data-ww-key=${neuronKey(neuron.id)}
        x=${neuron.x - layer.x - half}
        y=${neuron.y - layer.y - half}
        width=${NEURON_SIZE}
        height=${NEURON_SIZE}
        outline="rounded"
        radius=${NEURON_RADIUS}
        ?selected=${this.selected?.neuron === neuron.id}
      >
        ${ModelUtils.formatWeight(neuron.bias as number)}
        ${neuron.key
          ? html`<span class="key ${neuron.keyPos}">${neuron.key}</span>`
          : nothing}
      </ww-node>
    `
  }

  private renderLayer(layer: LayerLayout): TemplateResult<1> {
    const { conf } = layer
    return html`
      <ww-group
        data-ww-key=${layerKey(layer.id)}
        aria-label=${layerName(conf, this.msg)}
        x=${layer.x}
        y=${layer.y}
        selectable
        movable
        ?selected=${this.selected?.layer === layer.id}
      >
        <ww-shape
          class="body"
          kind="rect"
          x=${-layer.width / 2}
          y=${-layer.height / 2}
          width=${layer.width}
          height=${layer.height}
          radius=${LAYER_RADIUS}
        ></ww-shape>
        <ww-text class="label" x=${-layer.width / 2 - 20} y="-9"
          >${layerName(conf, this.msg)}</ww-text
        >
        ${layer.neurons.map((neuron) => this.renderNeuron(layer, neuron))}
      </ww-group>
    `
  }

  render(): TemplateResult<1> {
    const { layers, edges } = layoutNetwork(
      this.layerConfs,
      this.layerConnectionConfs,
      this.dataSet,
      this.network?.tensorConfs
    )
    return html`
      <div id="canvasElm" class=${this.dragOver ? 'drag-over' : ''}>
        <ww-scene
          select="single"
          data-ww-viewport="canvas"
          data-ww-viewport-zoom="0.1 3"
          data-ww-viewport-wheel="zoom"
          data-ww-viewport-fit-padding="30"
          data-ww-viewport-follow="none"
          @ww-select=${this.onSelect}
          @ww-activate=${this.onActivate}
          @ww-move=${this.onMove}
        >
          ${repeat(
            layers,
            (layer) => layer.id,
            (layer) => this.renderLayer(layer)
          )}
          ${repeat(
            edges,
            (edge) => edge.id,
            (edge) => html`
              <ww-path
                class=${edgeSign(edge.weight)}
                data-ww-key=${edgeKey(edge.id)}
                marker-end="arrow"
                from=${neuronKey(edge.source.id)}
                to=${neuronKey(edge.target.id)}
                style="--width: ${edgeWidth(edge.weight)}px"
                selectable
                ?selected=${this.selected?.edge === edge.id}
              ></ww-path>
            `
          )}
        </ww-scene>
      </div>
    `
  }
}
