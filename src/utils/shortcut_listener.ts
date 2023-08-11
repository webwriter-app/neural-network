import { ReactiveController } from 'lit'
import { WwDeepLearning } from '@/app'

import { spawnAlert } from '@/utils/alerts'

export class ShortcutListener implements ReactiveController {
  host: WwDeepLearning

  constructor(host: WwDeepLearning) {
    this.host = host
    host.addController(this)
  }

  hostConnected() {
    window.addEventListener('keyup', (e: KeyboardEvent) =>
      this.removeListener(e)
    )
    window.addEventListener('keydown', (e: KeyboardEvent) =>
      this.moveListener(e)
    )
  }

  hostDisconnected() {
    window.removeEventListener('keyup', (e: KeyboardEvent) =>
      this.removeListener(e)
    )
    window.removeEventListener('keydown', (e: KeyboardEvent) =>
      this.moveListener(e)
    )
  }

  removeListener(e: KeyboardEvent) {
    // 'remove' event (triggerd by delete or backspace key)
    if (e.code == 'Delete') {
      // delete layer
      if (this.host.selected.layer) {
        const layer = this.host.network.getLayerById(this.host.selected.layer)
        this.host.network.removeLayer(layer)
      }

      // delete neuron
      else if (this.host.selected.neuron) {
        spawnAlert({
          message: `You can not delete neurons by now! To adjust the number of neurons in the layer, select the layer and set the number of neurons in the right panel!`,
          variant: 'warning',
          icon: 'x-circle',
        })
      }

      // delete edge (not possible, alert)
      else if (this.host.selected.edge) {
        spawnAlert({
          message: `Can not delete edges manually. If you wish to delete all connections between two layers, select one of the affected layers and change its input`,
          variant: 'warning',
          icon: 'x-circle',
        })
      }
    }
  }

  moveListener(e: KeyboardEvent) {
    if (this.host.selected.layer) {
      const layer = this.host.network.getLayerById(this.host.selected.layer)
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
