import type { ReactiveController } from 'lit'
import type { WwDeepLearning } from '@/app'
import type { CLayerConf } from '@/types/c_layer_conf'
import type { CLayerConnectionConf } from '@/types/c_layer_connection_conf'
import { CLayer } from '@/components/network/c_layer'
import { AlertUtils } from '@/utils/alert_utils'
import { InputLayerConf } from '@/types/input_layer_conf'
import { OutputLayerConf } from '@/types/output_layer_conf'

import * as tf from '@tensorflow/tfjs'

export class NetworkController implements ReactiveController {
  host: WwDeepLearning

  constructor(host: WwDeepLearning) {
    this.host = host
    host.addController(this)
  }

  // HOST LIFECYCLE  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  hostConnected() {
    // add event listeners for network related events on host
    this.host.renderRoot.addEventListener('clear-network', (_e: Event) =>
      this.clearNetwork()
    )
    // listen to layer-conf-created events that layer emit after their static
    // factory method was called. now we can give the freshly created layer a
    // unique id and add it to the network. we have to listen on window since
    // this event can also be triggered by menu options
    window.addEventListener(
      'layer-conf-created',
      (e: CustomEvent<CLayerConf>) => this.addLayer(e.detail)
    )
    // neurons emit this event when they are rerendered, so we can force the
    // layer connections to also rerender
    this.host.renderRoot.addEventListener(
      'layer-updated',
      (e: CustomEvent<number>) => this.updateLayer(e.detail)
    )
    // a deletion of a layer can be queried by they layers themselves (e.g.
    // because no data was assigned to them) or by the UI.
    window.addEventListener('query-layer-deletion', (e: CustomEvent<CLayer>) =>
      this.removeLayer(e.detail)
    )
    this.host.renderRoot.addEventListener(
      'add-layer-connection',
      (e: CustomEvent<{ source: number; target: number }>) =>
        this.addLayerConnection(e.detail.source, e.detail.target)
    )
    this.host.renderRoot.addEventListener('update-layer-confs', (_e: Event) =>
      this.updateLayerConfs()
    )
    this.host.renderRoot.addEventListener(
      'remove-layer-connection',
      (e: CustomEvent<{ source: number; target: number }>) =>
        this.removeLayerConnection(e.detail.source, e.detail.target)
    )

    // add event listeners for network related keyboard events
    window.addEventListener('keyup', (e: KeyboardEvent) => {
      this.removeLayerListener(e)
      this.duplicateLayerListener(e)
    })
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      this.moveLayerListener(e)
    })
  }

  hostUpdated() {
    // as soon as the network component is rendered set the network property to
    // it, so that other components can access it
    if (!this.host.network && this.host.renderRoot.querySelector('c-network')) {
      this.host.network = this.host.renderRoot.querySelector('c-network')
    }
  }

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> ADDING - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // returns an id currently not in the layer. Since new layers are added in the
  // end of our layers array and always get higher ids than the previous layers,
  // it suffices to take the id of the last layer and add 1 to it to get an
  // unused id
  private getFreshId(): number {
    if (!this.host.layerConfs.length) {
      // if we do not have any layer yet, id 1 is not taken for sure
      return 1
    } else {
      // else we get the maximum id and add 1
      return (
        Math.max(
          ...this.host.layerConfs.map((layerConf) => layerConf.layerId)
        ) + 1
      )
    }
  }

  addLayer(layerConf: CLayerConf): void {
    // get the layer a fresh unused id
    layerConf['layerId'] = this.getFreshId()

    // assign all unassigned inputs to the layer in case it is an input layer
    if (
      layerConf.LAYER_TYPE == 'Input' &&
      !(<InputLayerConf>layerConf).featureKeys
    ) {
      ;(<InputLayerConf>layerConf).featureKeys =
        this.host.dataSet.featureDescs.map((featureDesc) => featureDesc.key)
    }

    // assign the label to the layer in case it is an output layer
    else if (layerConf.LAYER_TYPE == 'Output') {
      ;(<OutputLayerConf>layerConf).labelDesc = this.host.dataSet.labelDesc
    }

    // get the layer a position if none was specified
    if (!layerConf['pos']) {
      layerConf['pos'] = this.host.canvas.generatePos()
    }

    // add the layer to the network
    this.host.layerConfs.push(layerConf)
    this.host.layerConfs = [...this.host.layerConfs]
  }

  // checks on keyboard event whether the keyboard shortcut for duplicating a
  // layer was pressed and then handles the duplication
  duplicateLayerListener(e: KeyboardEvent) {
    // 'duplicate layer' event
    if (e.ctrlKey && e.code == 'KeyK') {
      if (this.host.selected.layer && this.host.selectedEle) {
        ;(<CLayer>this.host.selectedEle).duplicate()
      }
    }
  }

  // -> UPADTING - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // update (trigger an update/rerender of) the layer connections when a layer
  // has performed changes and thus been rerenderd
  updateLayer(layerId: number): void {
    const affectedConnectionConfs = this.host.layerConnectionConfs.filter(
      (conConf) => {
        return (
          conConf.sourceLayerId == layerId || conConf.targetLayerId == layerId
        )
      }
    )
    for (const affectedConnectionConf of affectedConnectionConfs) {
      this.host.network
        .getLayerConnectionByLayerIds(
          affectedConnectionConf.sourceLayerId,
          affectedConnectionConf.targetLayerId
        )
        .requestUpdate()
    }
  }

  updateLayerConfs(): void {
    this.host.layerConfs = [...this.host.layerConfs]
  }

  // checks on keyboard event whether the keyboard shortcut for moving a layer
  // was pressed and then handles the moving
  moveLayerListener(e: KeyboardEvent) {
    if (
      this.host.selected.layer &&
      e.ctrlKey &&
      e.shiftKey &&
      ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'].includes(e.code)
    ) {
      const layer = this.host.network.getLayerById(
        parseInt(this.host.selected.layer)
      )
      const layerCy = this.host.canvas.cy.getElementById(layer.getCyId())

      // move according to pressed key
      const SPEED = 10

      if (e.code == 'ArrowUp') {
        layerCy.shift('y', -SPEED)
      } else if (e.code == 'ArrowLeft') {
        layerCy.shift('x', -SPEED)
      } else if (e.code == 'ArrowDown') {
        layerCy.shift('y', SPEED)
      } else if (e.code == 'ArrowRight') {
        layerCy.shift('x', SPEED)
      }
    }
  }

  // -> REMOVING - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // reset the network by resetting the network conf
  clearNetwork() {
    // TODO replace with event?
    // deselect the currently selected element since it will be removed
    this.host.selectionController.unselect()

    // empty the network
    this.host.layerConnectionConfs = []
    this.host.layerConfs = []
  }

  // remove a layer from the network and thus triggers the disconnectedCallback
  // function of the layer which handles the removing of the layer itself
  removeLayer(layer: CLayer): void {
    // only perform action if allowed
    if (this.host.editable || this.host.settings.mayAddAndRemoveLayers) {
      // remove the connections from and to this layer
      for (let i = this.host.layerConnectionConfs.length - 1; i >= 0; i--) {
        const conConf = this.host.layerConnectionConfs[i]
        if (
          conConf.sourceLayerId == layer.conf.layerId ||
          conConf.targetLayerId == layer.conf.layerId
        ) {
          this.removeLayerConnection(
            conConf.sourceLayerId,
            conConf.targetLayerId
          )
        }
      }

      // remove the reference to the layer in our layers array
      const index = this.host.layerConfs.findIndex((layerConf) => {
        return layerConf.layerId == layer.conf.layerId
      })
      if (index > -1) {
        this.host.layerConfs.splice(index, 1)
        this.host.layerConfs = [...this.host.layerConfs]
      }

      // deselect the layer
      this.host.selectionController.unselect()

      AlertUtils.spawn({
        message: `'${layer.getName()}' has been deleted!`,
        variant: 'danger',
        icon: 'trash',
      })
    }
  }

  // checks on keyboard event whether the keyboard shortcut for removing a layer
  // was pressed and then handles the removal
  removeLayerListener(e: KeyboardEvent) {
    // 'remove layer' event
    if (e.ctrlKey && e.shiftKey && e.code == 'Backspace') {
      // delete layer
      if (this.host.selected.layer) {
        const layer = this.host.network.getLayerById(
          parseInt(this.host.selected.layer)
        )
        this.removeLayer(layer)
      }

      // spawn alert when instead a neuron are edge is selected
      else if (this.host.selected.neuron) {
        AlertUtils.spawn({
          message: `You can not delete neurons by now! To adjust the number of neurons in the layer, select the layer and set the number of neurons in the right panel!`,
          variant: 'warning',
          icon: 'x-circle',
        })
      } else if (this.host.selected.edge) {
        AlertUtils.spawn({
          message: `Can not delete edges manually. If you wish to delete all connections between two layers, select one of the affected layers and change its input`,
          variant: 'warning',
          icon: 'x-circle',
        })
      }
    }
  }

  // -> CONNECTING - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // adds a layer connection from the layer connections configuration by the ids
  // of the source and target layers
  addLayerConnection(source: number, target: number): void {
    const layerConnectionConf: CLayerConnectionConf = {
      sourceLayerId: source,
      targetLayerId: target,
    }
    this.host.layerConnectionConfs.push(layerConnectionConf)
    this.host.layerConnectionConfs = [...this.host.layerConnectionConfs]
  }

  // removes a layer connection from the layer connections configuration by the
  // ids of the source and target layers
  removeLayerConnection(source: number, target: number): void {
    const index = this.host.layerConnectionConfs.findIndex(
      (layerConnectionConf) => {
        return (
          layerConnectionConf.sourceLayerId == source &&
          layerConnectionConf.targetLayerId == target
        )
      }
    )
    if (index > -1) {
      this.host.layerConnectionConfs.splice(index, 1)
      this.host.layerConnectionConfs = [...this.host.layerConnectionConfs]
    }
  }

  // -> MODEL  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // ---> BUILD  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  buildModel(): tf.LayersModel {
    // check if at least one input layer exists
    if (!this.host.network.getInputLayers().length) {
      AlertUtils.spawn({
        message: 'Your network must contain at least one input layer',
        variant: 'warning',
        icon: 'x-circle',
      })
      return null
    }

    // check if an output layer exists
    if (!this.host.network.getOutputLayer()) {
      AlertUtils.spawn({
        message: 'Your network must contain at least one output layer',
        variant: 'warning',
        icon: 'x-circle',
      })
      return null
    }

    // now we can start building the network iteratively using a queue of layers
    // that we initialize with the input layers since they dont need to fulfill
    // any preconditions in order to be built.
    const buildQueue: CLayer[] = this.host.network.getInputLayers()

    // iterate over the build queue but skip layers that have sources which are
    // not yet built. They will end up in the build queue later again.
    while (buildQueue.length) {
      const layer = buildQueue[0]
      // skip the layer if not all preceeding layers have been build
      if (
        this.host.network.getSourcesFor(layer).every((layer) => layer.tensor)
      ) {
        // let the layer build its tensor and add it to its conf
        const tensor = layer.build(
          this.host.network.getSourcesFor(layer).map((layer) => layer.tensor)
        )
        this.host.network.tensorConfs.set(layer.conf.layerId, { tensor })
        // add all layers the current layer connects to the the queue
        this.host.network
          .getTargetsFor(layer)
          .forEach((layer) => buildQueue.push(layer))
      }
      // we are done with the current layer, so we remove it from the queue
      buildQueue.shift()
    }

    this.host.network.tensorConfs = new Map(this.host.network.tensorConfs)

    // check if there is a connected output layer, else abort (might lead to
    // some problems else)
    if (!this.host.network.getOutputLayer().tensor) {
      AlertUtils.spawn({
        message: 'Make sure to have an output layer connected to the network!',
        variant: 'warning',
        icon: 'x-circle',
      })
      return null
    }

    // get the input and output tensors from the resp. layers and create the
    // model
    const inputs: tf.SymbolicTensor[] = this.host.network
      .getInputLayers()
      .map((layer) => layer.tensor)
    const output: tf.SymbolicTensor = this.host.network.getOutputLayer().tensor
    const tfModel = tf.model({ inputs, outputs: output })

    console.log("tfModel", tfModel)
    console.log(tfModel.summary())
    return tfModel
  }

  // ---> UPDATE WEIGHTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  updateWeights(weights: tf.Tensor[]): void {
    console.log(weights)
    for (const weight of weights) {
      const layerIdAndWeightType: string[] = weight.name.split('/')
      if (layerIdAndWeightType.length != 2) {
        console.error('malformed weight name string: no "/"')
        return
      }
      const weightType: 'kernel' | 'bias' = <'kernel' | 'bias'>(
        layerIdAndWeightType[1].split('_')[0]
      )
      const layerId: number = parseInt(layerIdAndWeightType[0])
      switch (weightType) {
        case 'bias': {
          this.host.network.tensorConfs.get(layerId).bias = <Float32Array>(
            weight.dataSync()
          )
          break
        }
        case 'kernel': {
          this.host.network.tensorConfs.get(layerId).weights = <Float32Array>(
            weight.dataSync()
          )
          break
        }
        default:
          console.error('malformed weight name string: weightType')
      }
    }
    this.host.network.tensorConfs = new Map(this.host.network.tensorConfs)
  }
}
