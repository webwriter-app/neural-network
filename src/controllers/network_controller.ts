import type { ReactiveController } from 'lit'
import type { WwDeepLearning } from '@/app'
import type { CLayerConf } from '@/types/c_layer_conf'
import type { CLayerConnectionConf } from '@/types/c_layer_connection_conf'
import { CLayer } from '@/components/network/c_layer'
import { AlertUtils } from '@/utils/alert_utils'

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
    this.host.renderRoot.addEventListener(
      'add-layer',
      (e: CustomEvent<CLayerConf>) => this.addLayer(e.detail)
    )
    this.host.renderRoot.addEventListener(
      'remove-layer',
      (e: CustomEvent<number>) => this.removeLayer(e.detail)
    )
    this.host.renderRoot.addEventListener(
      'add-layer-connection',
      (e: CustomEvent<{ source: number; target: number }>) =>
        this.addLayerConnection(e.detail.source, e.detail.target)
    )
    this.host.renderRoot.addEventListener(
      'update-layer-confs',
      (_e: Event) => (this.host.layerConfs = [...this.host.layerConfs])
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
  // reset the network by resetting the network conf
  clearNetwork() {
    // TODO replace with event?
    // deselect the currently selected element since it will be removed
    this.host.selectionController.unselect()

    // empty the network
    this.host.layerConnectionConfs = []
    this.host.layerConfs = []
  }

  // adds a layer to the layer configuration
  addLayer(layerConf: CLayerConf): void {
    this.host.layerConfs.push(layerConf)
    this.host.layerConfs = [...this.host.layerConfs]
  }

  // removes a layer from the layer configuration by its id
  removeLayer(layerId: number): void {
    const index = this.host.layerConfs.findIndex((layerConf) => {
      return layerConf.layerId == layerId
    })
    if (index > -1) {
      this.host.layerConfs.splice(index, 1)
      this.host.layerConfs = [...this.host.layerConfs]
    }
  }

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
        this.host.network.removeLayer(layer)
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
}
