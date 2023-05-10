import state from '@/state'

import spawnAlert from '@/alerts';

document.addEventListener("keyup", (e) => {
    
    // 'remove' event (triggerd by delete or backspace key)
    if (e.code == 'Delete' || e.code == 'Backspace') {
        
        // delete layer
        if (state.selected == 'layer') {
            state.activeLayer.delete()
        }

        // delete neuron
        else if (state.selected == 'neuron') {
            spawnAlert(`You can not delete a specific neuron by now! To adjust the number of neurons in the layer, select the layer and set the number of neurons in the right panel!`)
        }

        // delete edge (not possible, alert)
        else if (state.selected == 'edge') {
            spawnAlert(`Can not delete edges manually. If you wish to delete the connection between ${state.activeEdge.sourceLayer.getName()} and ${state.activeEdge.targetLayer.getName()} select one of the layers and remove the other layer as its input resp. output!`)
        }
    }
})

// 'move' events
document.addEventListener("keydown", (e) => {

    if (state.selected == 'layer') {

        // move according to pressed key
        const SPEED = 10

        if (e.code == 'KeyW' || e.code == 'ArrowUp') {
            state.canvas.cy.getElementById(state.activeLayer.getCyId()).shift('y', -SPEED)
        } else if (e.code == 'KeyA' || e.code == 'ArrowLeft') {
            state.canvas.cy.getElementById(state.activeLayer.getCyId()).shift('x', -SPEED)
        } else if (e.code == 'KeyS' || e.code == 'ArrowDown') {
            state.canvas.cy.getElementById(state.activeLayer.getCyId()).shift('y', SPEED)
        } else if (e.code == 'KeyD' || e.code == 'ArrowRight') {
            state.canvas.cy.getElementById(state.activeLayer.getCyId()).shift('x', SPEED)
        }

        // update the layer's internal position
        state.activeLayer.updatePos()
    }
})