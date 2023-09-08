import { LitElementWw } from '@webwriter/lit'
import { TemplateResult, html } from 'lit'
import { customElement, queryAll, property } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import type { CLayerConf } from '@/types/c_layer_conf'
import type { TensorConf } from '@/types/tensor_conf'
import type { CLayerConnectionConf } from '@/types/c_layer_connection_conf'
import { layerConfsContext } from '@/contexts/layer_confs_context'
import { layerConnectionConfsContext } from '@/contexts/layer_con_confs_context'
import { CLayer } from '@/components/network/c_layer'
import { InputLayer } from '@/components/network/input_layer'
import { OutputLayer } from '@/components/network/output_layer'
import { CLayerConnection } from '@/components/network/c_layer_connection'

import '@/components/network/input_layer'
import '@/components/network/dense_layer'
import '@/components/network/output_layer'
import '@/components/network/c_layer'
import '@/components/network/c_layer_connection'

@customElement('c-network')
export class CNetwork extends LitElementWw {
  @consume({ context: layerConfsContext, subscribe: true })
  layerConfs: CLayerConf[]

  @consume({ context: layerConnectionConfsContext, subscribe: true })
  layerConnectionConfs: CLayerConnectionConf[]

  @property()
  tensorConfs: Map<number, TensorConf> = new Map()

  @queryAll('.layer')
  _layers: NodeListOf<CLayer>

  @queryAll('c-layer-connection')
  _layerConnections: NodeListOf<CLayerConnection>

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> GETTING  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // get a layer by its layerId
  getLayerById(layerId: number): CLayer {
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
  ): CLayerConnection {
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
      .map((conConf) => this.getLayerById(conConf.targetLayerId))
  }

  // tet the source (preceding) layers of a layer
  getSourcesFor(target: CLayer): CLayer[] {
    return this.layerConnectionConfs
      .filter((conConf) => conConf.targetLayerId == target.conf.layerId)
      .map((conConf) => this.getLayerById(conConf.sourceLayerId))
  }

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  getHTMLForLayerConf(layerConf: CLayerConf) {
    const layer = <CLayer>document.createElement(layerConf.HTML_TAG)
    layer.conf = layerConf
    const tensorConf = this.tensorConfs?.get(layerConf.layerId)
    layer.tensor = tensorConf?.tensor
    layer.bias = tensorConf?.bias
    layer.weights = tensorConf?.weights
    layer.classList.add('layer')
    return layer
  }

  getHTMLForLayerConnectionConf(layerConnectionConf: CLayerConnectionConf) {
    const layerConnection = <CLayerConnection>(
      document.createElement('c-layer-connection')
    )
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
