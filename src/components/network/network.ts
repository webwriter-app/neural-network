import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html } from 'lit'
import { customElement, queryAll, property } from 'lit/decorators.js'
import { consume } from '@lit/context'

import type { CLayerConf } from '../../model/network-types'
import type { TensorConf } from '../../model/network-types'
import type { CLayerConnectionConf } from '../../model/network-types'
import { layerConfsContext } from '../contexts'
import { layerConnectionConfsContext } from '../contexts'
import { CLayer } from './c-layer'
import { InputLayer } from './input-layer'
import { OutputLayer } from './output-layer'
import { CLayerConnection } from './c-layer-connection'
import { DenseLayer } from './dense-layer'

import './input-layer'
import './dense-layer'
import './output-layer'
import './c-layer'
import './c-layer-connection'
import { CEdge } from './c-edge'
import { CNeuron } from './neuron'

export class CNetwork extends LitElementWw {

  static scopedElements = {
    "c-edge": CEdge,
    "c-layer-connection": CLayerConnection,
    "dense-layer": DenseLayer,
    "input-layer": InputLayer,
    "output-layer": OutputLayer,
    "c-neuron": CNeuron
  }

  @consume({ context: layerConfsContext, subscribe: true })
  accessor layerConfs: CLayerConf[]

  @consume({ context: layerConnectionConfsContext, subscribe: true })
  accessor layerConnectionConfs: CLayerConnectionConf[]

  @property({ attribute: false })
  accessor tensorConfs: Map<number, TensorConf> = new Map()

  @queryAll('.layer')
  accessor _layers: NodeListOf<CLayer>

  @queryAll('c-layer-connection')
  accessor _layerConnections: NodeListOf<CLayerConnection>

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties)
    // the canvas draws the weights and biases
    if (changedProperties.has('tensorConfs')) {
      this.dispatchEvent(
        new Event('tensor-confs-updated', { bubbles: true, composed: true })
      )
    }
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> GETTING  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // get a layer by its layerId
  getLayerById(layerId: number): CLayer | undefined {
    return Array.from(this._layers).find(
      (layer) => layer.conf.layerId == layerId
    )
  }

  // get the input layers
  getInputLayers(): InputLayer[] {
    return <InputLayer[]>(
      this.layerConfs
        .map((layerConf) => this.getLayerById(layerConf.layerId))
        .filter((layer) => layer instanceof InputLayer)
    )
  }

  // get the output layer
  getOutputLayer(): OutputLayer {
    return <OutputLayer>(
      this.layerConfs
        .map((layerConf) => this.getLayerById(layerConf.layerId))
        .find((layer) => layer instanceof OutputLayer)
    )
  }

  // get a layer connection by its id
  getLayerConnectionByLayerIds(
    sourceLayerId: number,
    targetLayerId: number
  ): CLayerConnection | undefined {
    return Array.from(this._layerConnections).find((layerConnection) => {
      return (
        layerConnection.conf.sourceLayerId == sourceLayerId &&
        layerConnection.conf.targetLayerId == targetLayerId
      )
    })
  }

  // get the target (subsequent) layers of a layer
  getTargetsFor(source: CLayer): CLayer[] {
    return this.layerConnectionConfs
      .filter((conConf) => conConf.sourceLayerId == source.conf.layerId)
      .map((conConf) => this.getLayerById(conConf.targetLayerId)!)
  }

  // tet the source (preceding) layers of a layer
  getSourcesFor(target: CLayer): CLayer[] {
    return this.layerConnectionConfs
      .filter((conConf) => conConf.targetLayerId == target.conf.layerId)
      .map((conConf) => this.getLayerById(conConf.sourceLayerId)!)
  }

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // creates an element from this component's scoped custom element registry
  private createScopedElement<T extends HTMLElement>(tag: string): T {
    return this.ownerDocument.createElement(tag, {
      customElementRegistry: this.registry,
    }) as T
  }

  getHTMLForLayerConf(layerConf: CLayerConf) {
    const layer = this.createScopedElement<CLayer>(layerConf.HTML_TAG)
    layer.conf = layerConf
    const tensorConf = this.tensorConfs?.get(layerConf.layerId)
    layer.tensor = tensorConf?.tensor
    layer.bias = tensorConf?.bias
    layer.weights = tensorConf?.weights
    layer.classList.add('layer')
    return layer
  }

  getHTMLForLayerConnectionConf(layerConnectionConf: CLayerConnectionConf) {
    const layerConnection = this.createScopedElement<CLayerConnection>('c-layer-connection')
    layerConnection.conf = layerConnectionConf
    return layerConnection
  }

  render(): TemplateResult<1> {
    return html`
      <div id="layers">
        ${this.layerConfs.map((layerConf) =>
          this.getHTMLForLayerConf(layerConf)
        )}
      </div>
      <div id="layerConnections">
        ${this.layerConnectionConfs.map((layerConnectionConf) =>
          this.getHTMLForLayerConnectionConf(layerConnectionConf)
        )}
      </div>
    `
  }
}
