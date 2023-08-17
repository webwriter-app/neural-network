import { LitElement } from 'lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, queryAll, state } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import {
  SetupStatus,
  setupStatusContext,
} from '@/contexts/setup_status_context'
import { editableContext } from '@/contexts/editable_context'
import { settingsContext, Settings } from '@/contexts/settings_context'
import { canvasContext } from '@/contexts/canvas_context'
import { layerConfsContext } from '@/contexts/layer_confs_context'
import { layerConnectionConfsContext } from '@/contexts/layer_con_confs_context'
import { dataSetContext } from '@/contexts/data_set_context'
import { Selected, selectedContext } from '@/contexts/selected_context'

import type { DataSet } from '@/data_set/data_set'
import type { CCanvas } from '@/components/canvas'

import { CLayerConf } from '@/network/c_layer_conf'
import { CLayer } from '@/network/c_layer'
import { InputLayerConf } from '@/network/input_layer_conf'
import { InputLayer } from '@/network/input_layer'
import { OutputLayerConf } from '@/network/output_layer_conf'
import { OutputLayer } from '@/network/output_layer'
import { TensorConf } from '@/network/tensor_conf'
import { CLayerConnectionConf } from '@/network/c_layer_connection_conf'
import { CLayerConnection } from '@/network/c_layer_connection'

import { spawnAlert } from '@/utils/alerts'

import '@/network/input_layer'
import '@/network/dense_layer'
import '@/network/output_layer'
import '@/network/c_layer'
import '@/network/c_layer_connection'

import * as tf from '@tensorflow/tfjs'

@customElement('c-network')
export class Network extends LitElement {
  // FIELDS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> CONTEXT  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  @consume({ context: setupStatusContext, subscribe: true })
  setupStatus: SetupStatus

  @consume({ context: editableContext, subscribe: true })
  editable: boolean

  @consume({ context: settingsContext, subscribe: true })
  settings: Settings

  @consume({ context: canvasContext, subscribe: true })
  canvas: CCanvas

  @consume({ context: dataSetContext, subscribe: true })
  dataSet: DataSet

  @consume({ context: selectedContext, subscribe: true })
  selected: Selected

  @consume({ context: layerConfsContext, subscribe: true })
  layerConfs: CLayerConf[]

  @consume({ context: layerConnectionConfsContext, subscribe: true })
  layerConnectionConfs: CLayerConnectionConf[]

  // -> STATE  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  @state()
  tensorConfs: Map<number, TensorConf> = new Map()

  // -> QUERY  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  @queryAll('.layer')
  _layers: NodeListOf<CLayer>

  @queryAll('c-layer-connection')
  _layerConnections: NodeListOf<CLayerConnection>

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  connectedCallback(): void {
    super.connectedCallback()

    // listen to layer-conf-created events that layer emit after their static
    // factory method was called. now we can give the freshly created layer a
    // unique id and add it to the network. we have to listen on window since
    // this event can also be triggered by menu options
    window.addEventListener(
      'layer-conf-created',
      (e: CustomEvent<CLayerConf>) => this.handleLayerConfCreated(e.detail)
    )

    // listen to event neurons emit when they are rerendered, so we can force
    // the layer connections to also rerender
    this.renderRoot.addEventListener(
      'layer-updated',
      (e: CustomEvent<number>) => this.handleLayerUpdated(e.detail)
    )

    // a deletion of a layer can be queried by they layers themselves (e.g.
    // because no data was assigned to them) or by the UI.
    window.addEventListener('query-layer-deletion', (e: CustomEvent<CLayer>) =>
      this.removeLayer(e.detail)
    )
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> LAYERS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // ---> GETTING  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // get the input layers. important for everything related to training, testing
  // or predicting because the entrypoint is always in these layers
  getLayerById(layerId: number): CLayer {
    return Array.from(this._layers).find(
      (layer) => layer.conf.layerId == layerId
    )
  }

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

  // ---> ADDING - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // returns an id currently not in the layer. Since new layers are added in the
  // end of our layers array and always get higher ids than the previous layers,
  // it suffices to take the id of the last layer and add 1 to it to get an
  // unused id
  private getFreshId(): number {
    if (!this.layerConfs.length) {
      // if we do not have any layer yet, id 1 is not taken for sure
      return 1
    } else {
      // else we get the maximum id and add 1
      return (
        Math.max(...this.layerConfs.map((layerConf) => layerConf.layerId)) + 1
      )
    }
  }

  // ---> REMOVING - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // remove a layer from the network and thus triggers the disconnectedCallback
  // function of the layer which handles the removing of the layer itself
  removeLayer(layer: CLayer): void {
    // only perform action if allowed
    if (this.editable || this.settings.mayAddAndRemoveLayers) {
      // remove the connections from and to this layer
      for (const conConf of this.layerConnectionConfs) {
        if (
          conConf.sourceLayerId == layer.conf.layerId ||
          conConf.targetLayerId == layer.conf.layerId
        ) {
          this.dispatchEvent(
            new CustomEvent<{
              source: number
              target: number
            }>('remove-layer-connection', {
              detail: {
                source: conConf.sourceLayerId,
                target: conConf.targetLayerId,
              },
              bubbles: true,
              composed: true,
            })
          )
        }
      }

      // remove the reference to the layer in our layers array
      this.dispatchEvent(
        new CustomEvent<number>('remove-layer', {
          detail: layer.conf.layerId,
          bubbles: true,
          composed: true,
        })
      )

      // deselect the layer
      this.dispatchEvent(
        new Event('unselect', {
          bubbles: true,
          composed: true,
        })
      )

      spawnAlert({
        message: `'${layer.getName()}' has been deleted!`,
        variant: 'danger',
        icon: 'trash',
      })
    }
  }

  // -> CONNECTIONS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // ---> GETTING  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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

  getTargetsFor(source: CLayer): CLayer[] {
    return this.layerConnectionConfs
      .filter((conConf) => conConf.sourceLayerId == source.conf.layerId)
      .map((conConf) => this.getLayerById(conConf.targetLayerId))
  }

  getSourcesFor(target: CLayer): CLayer[] {
    return this.layerConnectionConfs
      .filter((conConf) => conConf.targetLayerId == target.conf.layerId)
      .map((conConf) => this.getLayerById(conConf.sourceLayerId))
  }

  // MODEL - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> RESET  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  handleResetModel() {
    // reset the tensors of all layer
    this.tensorConfs = new Map()
    this.dispatchEvent(
      new Event('update-layer-confs', {
        bubbles: true,
        composed: true,
      })
    )
  }

  // -> BUILD  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  buildModel(): tf.LayersModel {
    console.log('building network')

    // check if at least one input layer exists
    if (!this.getInputLayers().length) {
      spawnAlert({
        message: 'Your network must contain at least one input layer',
        variant: 'warning',
        icon: 'x-circle',
      })
      return null
    }

    // check if an output layer exists
    if (!this.getOutputLayer()) {
      spawnAlert({
        message: 'Your network must contain at least one output layer',
        variant: 'warning',
        icon: 'x-circle',
      })
      return null
    }

    // now we can start building the network iteratively using a queue of layers
    // that we initialize with the input layers since they dont need to fulfill
    // any preconditions in order to be built.
    const buildQueue: CLayer[] = this.getInputLayers()

    // iterate over the build queue but skip layers that have sources which are
    // not yet built. They will end up in the build queue later again.
    while (buildQueue.length) {
      const layer = buildQueue[0]
      // build the current layer in the build queue
      if (this.getSourcesFor(layer).every((layer) => layer.tensor)) {
        const tensor = layer.build(
          this.getSourcesFor(layer).map((layer) => layer.tensor)
        )
        this.tensorConfs.set(layer.conf.layerId, { tensor })
        layer.tensor = tensor
      }
      // add all layers the current layer connects to the the queue
      this.getTargetsFor(layer).forEach((layer) => buildQueue.push(layer))
      // we are done with the current layer, so we remove it from the queue
      buildQueue.shift()
    }

    this.tensorConfs = new Map(this.tensorConfs)

    console.log(this.tensorConfs)

    // check if there is a connected output layer, else abort (might lead to
    // some problems else)
    if (!this.getOutputLayer().tensor) {
      spawnAlert({
        message: 'Make sure to have an output layer connected to the network!',
        variant: 'warning',
        icon: 'x-circle',
      })
      return null
    }

    // get the inputs from the input layers
    const inputs: tf.SymbolicTensor[] = this.getInputLayers().map(
      (layer) => layer.tensor
    )

    // get the output from the output layer
    const output: tf.SymbolicTensor = this.getOutputLayer().tensor

    // with the inputs and the outputs available we can build the model
    const tfModel = tf.model({ inputs, outputs: output })

    console.log(tfModel)
    return tfModel
  }

  // -> UPDATE WEIGHTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  updateWeights(weights: tf.Tensor[]): void {
    console.log(weights)
    for (const weight of weights) {
      const layerIdAndWeightType: string[] = weight.name.split('/')
      console.log(weight)
      if (layerIdAndWeightType.length != 2) {
        console.error('malformed weight name string')
        return
      }
      const weightType: 'kernel' | 'bias' = <'kernel' | 'bias'>(
        layerIdAndWeightType[1].split('_')[0]
      )
      const layerId: number = parseInt(layerIdAndWeightType[0])
      switch (weightType) {
        case 'bias': {
          this.tensorConfs.get(layerId).bias = <Float32Array>weight.dataSync()
          this.dispatchEvent(
            new Event('update-layer-confs', {
              bubbles: true,
              composed: true,
            })
          )
          break
        }
        case 'kernel': {
          this.tensorConfs.get(layerId).weights = <Float32Array>(
            weight.dataSync()
          )
          this.dispatchEvent(
            new Event('update-layer-confs', {
              bubbles: true,
              composed: true,
            })
          )
          break
        }
        default:
          console.error('malformed weight name string: weightType')
      }
    }
    this.tensorConfs = new Map(this.tensorConfs)
  }

  // EVENT HANDLERS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  handleLayerConfCreated(layerConf: CLayerConf): void {
    // get the layer a fresh unused id
    layerConf['layerId'] = this.getFreshId()

    // assign all unassigned inputs to the layer in case it is an input layer
    if (layerConf.LAYER_TYPE == 'Input' && !layerConf.dataSetKeys) {
      ;(<InputLayerConf>layerConf).dataSetKeys = this.dataSet.inputs.map(
        (input) => input.key
      )
    }

    // assign the label to the layer in case it is an output layer
    else if (layerConf.LAYER_TYPE == 'Output') {
      ;(<OutputLayerConf>layerConf).dataSetLabel = this.dataSet.label
    }

    // get the layer a position if none was specified
    if (!layerConf['pos']) {
      layerConf['pos'] = this.canvas.generatePos()
    }

    // add the layer to the network
    this.dispatchEvent(
      new CustomEvent<CLayerConf>('add-layer', {
        detail: layerConf,
        bubbles: true,
        composed: true,
      })
    )
  }

  handleLayerUpdated(layerId: number): void {
    const affectedConnectionConfs = this.layerConnectionConfs.filter(
      (conConf) => {
        return (
          conConf.sourceLayerId == layerId || conConf.targetLayerId == layerId
        )
      }
    )
    for (const affectedConnectionConf of affectedConnectionConfs) {
      this.getLayerConnectionByLayerIds(
        affectedConnectionConf.sourceLayerId,
        affectedConnectionConf.targetLayerId
      ).requestUpdate()
    }
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = globalStyles

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
