import { ReactiveController } from 'lit'
import { WwApp } from '@/app'

import { spawnAlert } from '@/utils/alerts'

export class ShortcutListener implements ReactiveController {
  host: WwApp

  constructor(host: WwApp) {
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
    if (e.code == 'Delete' || e.code == 'Backspace') {
      // delete layer
      if (this.host.selected.layer) {
        const layer = this.host.selected.layer
        spawnAlert({
          message: `'${layer.getName()}' has been deleted!`,
          variant: 'danger',
          icon: 'trash',
        })
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
        const edge = this.host.selected.edge
        spawnAlert({
          message: `Can not delete edges manually. If you wish to delete the connection between '${edge.sourceLayer.getName()}' and '${edge.targetLayer.getName()}' select one of the layers and remove the other layer as its input resp. output!`,
          variant: 'warning',
          icon: 'x-circle',
        })
      }
    }
  }

  moveListener(e: KeyboardEvent) {
    if (this.host.selected.layer) {
      const layer = this.host.selected.layer
      const layerCy = this.host.canvas.cy.getElementById(layer.getCyId())

      // move according to pressed key
      const SPEED = 10

      if (e.code == 'KeyW' || e.code == 'ArrowUp') {
        layerCy.shift('y', -SPEED)
      } else if (e.code == 'KeyA' || e.code == 'ArrowLeft') {
        layerCy.shift('x', -SPEED)
      } else if (e.code == 'KeyS' || e.code == 'ArrowDown') {
        layerCy.shift('y', SPEED)
      } else if (e.code == 'KeyD' || e.code == 'ArrowRight') {
        layerCy.shift('x', SPEED)
      }
    }
  }
}
