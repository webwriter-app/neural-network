import { LitState } from 'lit-element-state'
import Layer from '@/network/layer'

class CanvasState extends LitState {

    canvas
    isEmpty: boolean

    LAYER_WIDTH: number
    LAYER_PADDING: number
    DISTANCE: number

    layerPos: Array<{x: number, y: number}>
        
    static get stateVars()
    {
        return {
            canvas: null,
            isEmpty: true,

            LAYER_WIDTH: 300,
            LAYER_PADDING: 20,
            DISTANCE: 50,

            // start coordinates for the first layer in the first level
            layerPos: [{x: 0, y: 0}],
        }
    }

    /*
    CANVAS MANIPULATION
    */
    zoomOut() {
        if(this.canvas) {
            this.canvas.zoom(this.canvas.zoom() - 0.1)
        }
    }
    fit() {
        if(this.canvas) {
            this.canvas.fit(this.canvas.$(), 30) // fit the graph to all elements with a padding of 50 pixels
        }
    }
    zoomIn() {
        if(this.canvas) {
            this.canvas.zoom(this.canvas.zoom() + 0.1)
        }
    }

    clear() {
        this.isEmpty = true
        this.canvas.remove('node')
        this.layerPos = [{x: 0, y: 0}]
    }

    /*
    POSITIONING ELEMENTS
    */
    // get the coordinates for a layer at a level
    // important: return online a copy of the positions, not a reference!
    getLayerPos(level: number) {
        console.log(`GETTING layer pos for level ${level}:`)
        console.log(this.layerPos[level])
        return Object.create(this.layerPos[level])
    }

    // at the end of the layers build function we call this function
    addedLayer({level, id}: {level: number, id: number}) {

        const node = this.canvas.getElementById(`${id}`)

        console.log(`ADDED layer at level ${level}`)
        console.log("height: " + node.outerHeight())
        console.log("width: " + node.outerWidth())

        // make sure that new layers at the same level are inserted under the current
        console.log(this.layerPos[level])
        this.layerPos[level].y += (node.outerHeight() + this.DISTANCE)
        console.log(this.layerPos[level])

        // make sure that new layers at the next level are inserted right of the current
        if (this.layerPos[level + 1]) {
            console.log(`updating layer pos at level ${level + 1}, existed`)
            this.layerPos[level + 1].x = Math.max(this.layerPos[level + 1].x, this.layerPos[level].x + node.outerWidth() + this.DISTANCE)
        } else {
            console.log(`updating layer pos at level ${level + 1} because it doesnt exist`)
            this.layerPos[level + 1] = {
                x: this.layerPos[level].x + node.outerWidth() + this.DISTANCE,
                y: 0
            }
        }
    }
}

const canvasState = new CanvasState()

export default canvasState