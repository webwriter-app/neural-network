import { LitState } from 'lit-element-state'
import Layer from '@/network/layer'

class CanvasState extends LitState {

    canvas

    LAYER_WIDTH: number
    LAYER_PADDING: number
    LAYER_DISTANCE: number
    NEURON_SIZE: number
    NEURON_DISTANCE: number

    static get stateVars()
    {
        return {
            canvas: null,

            LAYER_WIDTH: 300,
            LAYER_PADDING: 20,
            LAYER_DISTANCE: 50,
            NEURON_SIZE:  100,
            NEURON_DISTANCE: 30
        }
    }

    setCanvas(canvas) {
        this.canvas = canvas
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
        this.canvas.remove('node')
    }

    /*
    POSITIONING
    */
    // get the width of an element
    getWidth(id: number) {
        let elm = this.canvas.getElementById(id)
        return elm.outerWidth()
    }

    // generate a new position, currently just in the middle of the canvas
    // TODO: does not work as expected right now
    generatePos() {
        let viewport = this.canvas.extent()
        return {
            x: (viewport.x2 - viewport.x1) / 2,
            y: (viewport.y2 - viewport.y1) / 2
        }
    }
}

const canvasState = new CanvasState()

export default canvasState