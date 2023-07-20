import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import { consume } from '@lit-labs/context'
import { Canvas, canvasContext } from '@/contexts/canvas_context'
import {
  NetworkConf,
  networkConfContext,
} from '@/contexts/network_conf_context'
import { dataSetContext } from '@/contexts/data_set_context'
import { DataSet } from '@/data_set/data_set'
import { Selected, selectedContext } from '@/contexts/selected_context'

import { CLayer } from '@/components/network/c_layer'
import { InputLayer } from '@/components/network/input_layer'
import { OutputLayer } from '@/components/network/output_layer'
import { CLayerConnection } from '@/components/network/c_layer_connection'

import { spawnAlert } from '@/utils/alerts'

import '@/components/network/input_layer'
import '@/components/network/dense_layer'
import '@/components/network/output_layer'
import '@/components/network/neuron_layer'
import '@/components/network/c_layer'
import '@/components/network/c_layer_connection'

import * as tf from '@tensorflow/tfjs'

@customElement('c-network')
export class Network extends LitElementWw {
  // FIELDS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> CONTEXT  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  @consume({ context: canvasContext, subscribe: true })
  canvas: Canvas

  @consume({ context: networkConfContext, subscribe: true })
  networkConf: NetworkConf

  @consume({ context: dataSetContext, subscribe: true })
  dataSet: DataSet

  @consume({ context: selectedContext, subscribe: true })
  selected: Selected

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  connectedCallback(): void {
    super.connectedCallback()
    // emit an event to notify the root component about the creation of the
    // network, so it can store it inside the network conf for other components
    // to reference this
    const event = new CustomEvent<Network>('network-created', {
      detail: this,
      bubbles: true,
      composed: true,
    })
    this.dispatchEvent(event)

    // listen to layer-created events that layer emit after their static factory
    // method was called. now we can give the freshly created layer a unique id
    // and add it to the network
    window.addEventListener('layer-created', (e: CustomEvent<CLayer>) =>
      this.handleLayerCreated(e.detail)
    )

    // listen to event neurons emit when they are rerendered, so we can force
    // the layer connections to also rerender
    this.renderRoot.addEventListener(
      'layer-updated',
      (e: CustomEvent<number>) => this.handleLayerUpdated(e.detail)
    )
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> LAYERS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // ---> GETTING  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // get the input layers. important for everything related to training, testing
  // or predicting because the entrypoint is always in these layers
  getInputLayers(): InputLayer[] {
    return <InputLayer[]>(
      Array.from(this.networkConf.layers.values()).filter(
        (layer) => layer instanceof InputLayer
      )
    )
  }

  // get the output layer
  getOutputLayer(): OutputLayer {
    return <OutputLayer>(
      Array.from(this.networkConf.layers.values()).find(
        (layer) => layer instanceof OutputLayer
      )
    )
  }

  // ---> ADDING - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // returns an id currently not in the layer. Since new layers are added in the
  // end of our layers array and always get higher ids than the previous layers,
  // it suffices to take the id of the last layer and add 1 to it to get an
  // unused id
  private getFreshId(): number {
    if (!this.networkConf.layers.size) {
      // if we do not have any layer yet, id 1 is not taken for sure
      return 1
    } else {
      // else we get the maximum id and add 1
      return Math.max(...this.networkConf.layers.keys()) + 1
    }
  }

  // ---> REMOVING - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // remove a layer from the network. does not delete the layer itself (therfore
  // call the layers delete method which should call this method)
  removeLayer(layerArg: CLayer): void {
    // remove the connections from and to this layer
    for (const [key, con] of this.networkConf.layerConnections.entries()) {
      if (con.sourceLayer == layerArg || con.targetLayer == layerArg) {
        console.log(`removing connection`)
        console.log(key)
        this.networkConf.removeLayerConnection(key)
        console.log(this.networkConf.layerConnections)
      }
    }

    // check if dataset keys were assigned to layer and notify the dataset to
    // remove the association
    if (layerArg instanceof InputLayer) {
      for (const dataSetKey of layerArg.dataSetKeys) {
        this.dataSet.unassignKey(dataSetKey)
      }
    }
    if (layerArg instanceof OutputLayer) {
      this.dataSet.unassignKey(layerArg.dataSetLabel.key)
    }

    // remove the reference to the layer in our layers array
    this.networkConf.removeLayer(layerArg.layerId)

    // deselect the layer
    this.selected.select()
  }

  // -> CONNECTIONS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // ---> GETTING  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  getTargetsFor(source: CLayer): CLayer[] {
    return Array.from(this.networkConf.layerConnections.keys())
      .filter(([sourceId, _targetId]) => sourceId == source.layerId)
      .map(([_sourceId, targetId]) => this.networkConf.layers.get(targetId))
  }

  getSourcesFor(target: CLayer): CLayer[] {
    return Array.from(this.networkConf.layerConnections.keys())
      .filter(([_sourceId, targetId]) => targetId == target.layerId)
      .map(([sourceId, _targetId]) => this.networkConf.layers.get(sourceId))
  }

  // ---> ADDING - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  addLayerConnection(source: CLayer, target: CLayer): void {
    const layerConnection: CLayerConnection = <CLayerConnection>(
      document.createElement('c-layer-connection')
    )
    layerConnection.sourceLayer = source
    layerConnection.targetLayer = target
    this.networkConf.addLayerConnection(layerConnection)
  }

  removeLayerConnection(source: CLayer, target: CLayer): void {
    this.networkConf.removeLayerConnection([source.layerId, target.layerId])
  }

  // BUILD MODEL - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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

    // reset the tensors of all layer
    Array.from(this.networkConf.layers.values()).forEach((layer) => {
      layer.tensor = null
    })
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
        layer.build(this.getSourcesFor(layer).map((layer) => layer.tensor))
      }
      // add all layers the current layer connects to the the queue
      this.getTargetsFor(layer).forEach((layer) => buildQueue.push(layer))
      // we are done with the current layer, so we remove it from the queue
      buildQueue.shift()
    }

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

  // EVENT HANDLERS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  handleLayerCreated(layer: CLayer): void {
    // get the layer a fresh unused id
    layer['layerId'] = this.getFreshId()

    // assign all unassigned inputs to the layer in case it is an input layer
    if (layer instanceof InputLayer) {
      layer.dataSetKeys = this.dataSet.getNonAssignedInputKeys()
    }

    // assign the label to the layer in case it is an output layer
    else if (layer instanceof OutputLayer) {
      layer.dataSetLabel = this.dataSet.getLabelByKey(
        this.dataSet.getNonAssignedLabelKey()
      )
    }

    // add the layer to the network
    this.networkConf.addLayer(layer)
  }

  handleLayerUpdated(layerId: number): void {
    const affectedConnectionKeys = Array.from(
      this.networkConf.layerConnections.keys()
    ).filter(([sourceId, targetId]) => {
      return sourceId == layerId || targetId == layerId
    })
    for (const affectedConnectionKey of affectedConnectionKeys) {
      this.networkConf.layerConnections
        .get(affectedConnectionKey)
        .requestUpdate()
    }
  }

  handleDataSetChange(): void {
    if (this.dataSet) {
      // spawn an alert
      let msg = `The data set has been set to '${this.dataSet.name}'!`
      if (this.getInputLayers().length >= 2)
        msg +=
          ' All inputs of this dataSet were assigned to the first input layer - all other input layers were deleted!'
      spawnAlert({ message: msg, variant: 'success', icon: 'check-circle' })

      // assign all inputs to the first input layer and remove the others
      for (let i = 0; i < this.getInputLayers().length; i++) {
        if (i == 0) {
          this.getInputLayers()[i].dataSetKeys =
            this.dataSet.getNonAssignedInputKeys()
        } else {
          this.removeLayer(this.getInputLayers()[i])
        }
      }

      // assign the new label to the output layer
      const outputLayer = this.getOutputLayer()
      if (outputLayer) {
        outputLayer.dataSetLabel = this.dataSet.getLabelByKey(
          this.dataSet.getNonAssignedLabelKey()
        )
      }
    }
  }

  handleQueryLayerDeletion(layer: CLayer): void {
    this.removeLayer(layer)
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = [globalStyles]

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html` ${Array.from(this.networkConf.layers.values())}
    ${Array.from(this.networkConf.layerConnections.values())}`
  }
}
