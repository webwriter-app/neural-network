import * as tf from '@tensorflow/tfjs';

import state from '@/state'

import NeuralNet from './net';
import Activation from '@/network/activation'

export default abstract class Layer {

    // to not have any typescript errors when referencing static properthis via instance.constructor
    declare ['constructor']: typeof Layer;

    network: NeuralNet

    id: number
    inputFrom: Array<Layer>
    activation: Activation
    outputTo: Array<Layer>

    // position on canvas (middle of the node)
    pos: {
        x: number,
        y: number
    }

    // tensor
    tensor: tf.SymbolicTensor

    // a type and description that is displayed as an info for the layer
    static LAYER_TYPE: string
    static LAYER_NAME: string
    static DESCRIPTION: string

    constructor({network, inputFrom, activation, outputTo, pos}) {

        // set network and add layer to the network
        this.network = network

        // get a fresh id from the network
        this.id = network.getFreshId()

        // after we have received the id we can add the layer to the network
        network.addLayer(this)

        // set inputs, outputs and activation
        this.inputFrom = inputFrom
        this.outputTo = outputTo
        this.setActivation(activation)
    
        // notify all the inputs
        for (let input of this.inputFrom) {
            this.notifyToAddOutput(input)
        }

        // notify all the outputs
        for (let output of this.outputTo) {
            this.notifyToAddInput(output)
        }

        if (pos) {
            this.pos = pos // store position if specified

        } else {
            this.pos = state.canvas.generatePos() // if no position is specified, we let the canvas generate it
        }

        // since the model is only built on user request, we first set the tensor to null
        this.tensor = null
    }

    /*
    CANVAS
    */
    // return the id of the element in the canvas
    getCyId(): string {
        return `${this.id}`
    }

    // update the internal position by getting the current position in the graph
    updatePos(): void {

        const node = state.canvas.cy.getElementById(this.getCyId())
        this.pos.x = node.position().x
        this.pos.y = node.position().y
    }

    // add an event listener that updates the layer position when layer is dragged on the canvas
    addMoveListener(): void {

        state.canvas.cy.$(`#${this.id}`).on('drag', (e) => {
            this.updatePos()
        })
    }

    // each subclass should specify a function that returns an array of cytoscape node ids that should be connected to other allow to allow flexibility in whether connecting the layer as a whole, all neurons in the layer or anything other
    abstract getConnectionIds(): Array<string>

    // remove the previous built layer if exists. these are all nodes with its layer property being this.id or edges with either source or target being this.id
    removeFromCanvas(): void {
        let eles = state.canvas.cy.filter((element, i) => {
            return element.isNode() && element.data('layer') == this.id
        }, this)
        eles.remove()
    }

    // since the user is able to edit the layers that this layer connects to, we need to flexible in adding and removing connections to a specific layer
    abstract drawConnectionFrom(layer: Layer): void
    abstract drawConnectionTo(layer: Layer): void

    removeConnectionFrom(layer: Layer): void {
        let eles = state.canvas.cy.filter((element, i) => {
            return element.isEdge() && (element.data('sourceLayer') == layer.id && element.data('targetLayer') == this.id)
        }, this)
        eles.remove()
    }

    removeConnectionTo(layer: Layer): void {
        let eles = state.canvas.cy.filter((element, i) => {
            return element.isEdge() && (element.data('sourceLayer') == this.id && element.data('targetLayer') == layer.id)
        }, this)
        eles.remove()
    }

    /*
    LAYER
    */
    // get a readable name for this layer (should only be used for displaying purposes)
    getName(): string {
        return `${this.id} - ${this.constructor.LAYER_NAME} ${this.activation.name != 'None' ? `(${this.activation.name})` : ``}`
    }

    // set the activation function
    setActivation(name: string): void {
        this.activation = Activation.getActivationByName(name)

        // also update the label of the layer in the canvas
        state.canvas.cy.getElementById(`${this.id}`).data("label", this.getName())
    }

    // create and return a new layer based on this (except inputs and outputs)
    abstract duplicate(): Layer | void

    // delete the layer by notifying its input and output and removing the elements from canvas
    delete(): void {
        
        // notify all elements that this layer is connected to to remove it from their inputFrom or outputTo arrays
        for (let input of this.inputFrom) {
            this.notifyToDeleteOutput(input)
        }
        for (let output of this.outputTo) {
            this.notifyToDeleteInput(output)
        }

        // remove the layer from the network
        this.network.removeLayer(this)

        // remove all elements from canvas
        this.removeFromCanvas()
    }

    /*
    INPUTS AND OUTPUTS
    */
    // sets the input (res. output) (overrides existing)
    setInputFrom(layers: Layer[]) {

        this.network.resetBuild()

        // draw the connections to the newly added layers and notify them about it
        const addedLayers = layers.filter(layer => !this.inputFrom.includes(layer));
        for (let layer of addedLayers) {
            this.drawConnectionFrom(layer)
            this.notifyToAddOutput(layer)
        }

        // remove connections to layers that are not in the new layers array and notify the layer about it
        const removedLayers = this.inputFrom.filter(layer => !layers.includes(layer))
        for (let layer of removedLayers) {
            this.removeConnectionFrom(layer)
            this.notifyToDeleteOutput(layer)
        }

        // finally override the inputFrom
        this.inputFrom = layers
    }
    setOutputTo(layers: Layer[]) {

        this.network.resetBuild()
        
        // draw the connections to the newly added layers and notify them about it
        const addedLayers = layers.filter(layer => !this.outputTo.includes(layer));
        for (let layer of addedLayers) {
            this.drawConnectionTo(layer)
            this.notifyToAddInput(layer)
        }

        // remove connections from layers that are not in the new layers array and notify the layer about it
        const removedLayers = this.outputTo.filter(layer => !layers.includes(layer))
        for (let layer of removedLayers) {
            this.removeConnectionTo(layer)
            this.notifyToDeleteInput(layer)
        }

        // finally override the outputTo
        this.outputTo = layers
    }

    // when we add or remove inputFrom or outputTo properties to the layer, we need to notify the layer we are referencing that it also references us
    notifyToAddOutput(input: Layer): void {
        input.addOutput(this)
    }
    addOutput(output: Layer): void {
        this.outputTo.push(output)
    }
    notifyToAddInput(output: Layer): void {
        output.addInput(this)
    }
    addInput(input: Layer): void {
        this.inputFrom.push(input)
    }
    notifyToDeleteOutput(input: Layer): void {
        input.deleteOutput(this)
    }
    deleteOutput(output: Layer): void {
        this.outputTo = this.outputTo.filter(layer => layer != output)
    }
    notifyToDeleteInput(output: Layer): void {
        output.deleteInput(this)
    }
    deleteInput(input: Layer): void {
        this.inputFrom = this.inputFrom.filter(layer => layer != input)
    }

    /*
    BUILDING
    */
    abstract build(): void

    getTensorName(): string {
        return this.getName().replace(/\s+/g, '').replace(/[^\w ]/g, '')
    }
}