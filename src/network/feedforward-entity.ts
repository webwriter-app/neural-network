import spawnAlert from '@/alerts'
import networkState from '@/state/network_state'

import NetworkItem from '@/types/network-item'
import Layer from '@/types/layer'
import Activation from '@/types/activation'

export default class FeedForwardEntity implements NetworkItem {
    name: string
    inputFrom: string | null
    outputTo: string | null
    inputSize: number
    layers: Array<Layer>

    constructor({name, inputFrom = null, outputTo = null, inputSize, layers}) {
        this.name = name
        this.inputFrom = inputFrom
        this.outputTo = outputTo
        this.inputSize = inputSize
        this.layers = layers
    }

    getMaxNumberOfNeuronsPerLayer(): number {
        let actSize = this.inputSize
        for (let layer of this.layers) {
            if (layer.units > actSize) actSize = layer.units
        }
        return actSize
    }

    /*
    EDITING LAYERS
    */
    // adds a layer after the specified layer index. note: the input layer is index 0, hidden layers start with index 1
    // copies the settings (units, activation, ...) of the 'after' layer
    insertLayerAfter(layerArg): void {
        let layer: Layer
        let position: number

        if (layerArg == 'input') {
            layer = {type: 'dense', units: this.inputSize, activation: Activation.ReLu}
            position = 0
        }
        else if(layerArg >= 1 && layerArg <= this.layers.length) {
            layer = {... this.layers[layerArg - 1]}
            position = layerArg - 1
        }

        if (position) {
            this.layers.splice(position, 0, layer)
            networkState.net.buildGraph()
            spawnAlert("Layer has been inserted!")
        }
    }

    deleteLayer(layerArg: number): void {
        if (layerArg >= 1 && layerArg <= this.layers.length) {
            this.layers.splice(layerArg - 1, 1)
            networkState.net.buildGraph()
            spawnAlert("Layer has been deleted!")
        }
    }

    addNeuronToLayer(layerArg): void {
        if (layerArg == 'input') this.inputSize++
        else if (layerArg >= 1 && layerArg <= this.layers.length) this.layers[layerArg - 1].units++
        networkState.net.buildGraph()
        spawnAlert("Neuron has been added!")
    }

    /*
    BUILDING ENTITY FOR CANVAS
    */
    buildGraph(canvas, XPOS_ADDENDUM): number {

        // add the entity itself
        canvas.add({
            group: 'nodes',
            grabbable: true,
            data: { 
                id: `entity:${this.name}`,
                type: 'entity',
                label: `${this.name}`,
                entity: `${this.name}`
            }
        })

        // set the initial positons. while the x position increases after each layer, the y position
        // increases with the nodes in the layer and is reseted/newly calculated with each layer
        let xPos: number = XPOS_ADDENDUM
        let yPos: number

        // constants
        const ROWS:number = this.getMaxNumberOfNeuronsPerLayer()
        const NODE_SIZE:number = 100
        const DISTANCE_FACTOR:number = 1.3
        
        /***********************************/
        /**********  INPUT LAYER  **********/
        /***********************************/

        // determine the y position to start with for the input layer.
        yPos = (ROWS - this.inputSize)*NODE_SIZE*DISTANCE_FACTOR

        // add the input layer
        canvas.add({
            group: 'nodes',
            grabbable: false,
            data: { 
                id: `entity:${this.name}-layer:input`, 
                parent: `entity:${this.name}`,
                type: 'layer',
                label: 'Input layer',
                entity: `${this.name}`,
                layer: `input`
            }
        })

        // add neurons to the input layer
        for (let neuron = 0; neuron < this.inputSize; neuron++) {
            canvas.add({
                group: 'nodes', 
                grabbable: false,
                data: { 
                    id: `entity:${this.name}-layer:input-neuron:${neuron}`, 
                    parent: `entity:${this.name}-layer:input`, 
                    type: 'neuron',
                    entity: `${this.name}`,
                    layer: `input`,
                    neuron: `${neuron}`
                }, 
                position: {
                    x: xPos,
                    y: yPos
                }
            })

            yPos += NODE_SIZE*DISTANCE_FACTOR*2
        }

        /***********************************/
        /**********  HIDDEN LAYERS *********/
        /***********************************/
        // loop through the layers
        for (let layer = 0; layer < this.layers.length; layer++) {
            
            // before adding each layer we move to the right...
            xPos += NODE_SIZE*3
            // .. and determine the new yPos starting position
            yPos = (ROWS - this.layers[layer].units)*NODE_SIZE*DISTANCE_FACTOR

            // add the layer itself
            canvas.add({
                group: 'nodes',
                grabbable: false,
                data: { 
                    id: `entity:${this.name}-layer:${layer+1}`, 
                    parent: `entity:${this.name}`,
                    type: 'layer',
                    label: `Layer ${layer + 1}`,
                    entity: `${this.name}`,
                    layer: `${layer+1}`
                }
            })

            // loop through the neurons in the layer
            for (let neuron = 0; neuron < this.layers[layer].units; neuron++) {

                // add the neuron
                canvas.add({
                    group: 'nodes', 
                    grabbable: false,
                    data: { 
                        id: `entity:${this.name}-layer:${layer + 1}-neuron:${neuron}`, 
                        parent: `entity:${this.name}-layer:${layer + 1}`, 
                        type: 'neuron',
                        entity: `${this.name}`,
                        layer: `${layer + 1}`,
                        neuron: `${neuron}`
                    }, 
                    position: {
                        x: xPos,
                        y: yPos
                    }
                })

                // move to the bottom for the next neuron
                yPos += NODE_SIZE*DISTANCE_FACTOR*2
            }

            // connect the freshly added neurons to the neurons of the previous layer
            // first, collect all the nodes in the previous layer that we want the connections to start at
            let previousLayerNodes
            if (layer == 0) {
                // if the current layer is layer 0, the previous layer is the input layer, so we get all neurons
                // in the input layer
                previousLayerNodes = canvas.nodes().filter((node) => {
                    return node.data('parent') == `entity:${this.name}-layer:input` && node.data('type') == 'neuron'
                })
            } else {
                // if the previous layer is not layer 0, we get all neurons from the previous hidden layer
                previousLayerNodes = canvas.nodes().filter((node) => {
                    return node.data('parent') == `entity:${this.name}-layer:${layer}` && node.data('type') == 'neuron'
                })
            }
            let currentLayerNodes = canvas.nodes().filter((node) => {
                return node.data('parent') == `entity:${this.name}-layer:${layer + 1}` && node.data('type') == 'neuron'
            })
            for (let previousLayerNode of previousLayerNodes) {
                for (let currentLayerNode of currentLayerNodes) {
                    canvas.add({
                        group: 'edges', 
                        data: {
                            id: `${previousLayerNode.data('id')}CONNECT${currentLayerNode.data('id')}`, 
                            source: previousLayerNode.data('id'), 
                            target: currentLayerNode.data('id')
                        }
                    })
                }
            }
        }

        // determine the width of the entity node and return it added to the XPOS_ADDENDUM
        const ENTITY_WIDTH = canvas.getElementById(`entity:${this.name}`).outerWidth()
        return XPOS_ADDENDUM + ENTITY_WIDTH
    }
}