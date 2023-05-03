import Layer from './layer'

// Abstract class NeuronLayer acts as a bridge between the general Layer class and specific classes such as Dense layer. It stores the number of neurons and acts as a type checker for some methods that only exists for these layers. Important as a differentation to other possible layer that to not consist of just neurons.
export default class Neuron {

    // reference to the layer id
    layer: Layer

    // the id of the neuron in this layer. first neuron added gets id 1; not to be confused with the id of the corresponding node in the cytoscape canvas which is `${this.layer}n${this.id}`
    id: number

    // labels (keys) of the corresponding dataset input or outputs
    inputData: string | null
    outputData: string | null

    value: number

    constructor({layer, id, inputData = null, outputData = null}: {layer: Layer, id:number, inputData: string, outputData: string}) {
        
        this.layer = layer
        this.id = id
        this.inputData = inputData
        this.outputData = outputData
        this.value = Math.random()
    }

    /*
    CANVAS
    */
    // return the id of the element in the canvas
    getCyId(): string {
        return `${this.layer.getCyId()}n${this.id}`
    }    
    
    // draw the neuron itself (without the connections)
    draw({cy, cypos}: {cy, cypos: {x: number, y: number}}) {

        console.log(`neuron ${this.getCyId()} has been drawn`)

        // remove the previously built neuron if exists
        this.remove({cy})

        // for the input and output layers we add a wrapper around the neuron that indicates that this node is input/output and in order to display an additional label
        let neuronParent: string = this.layer.getCyId()
        let wrapperLabel: string = null
        if (this.inputData) wrapperLabel = this.inputData
        if (this.outputData) wrapperLabel = this.outputData
        if (wrapperLabel) {
            cy.add({
                group: 'nodes', 
                grabbable: false,
                selectable: false,
                data: { 
                    id: `${this.getCyId()}w`, 
                    parent: `${this.layer.id}`, 
                    type: 'neuron-wrapper',
                    layer: this.layer.id,
                    neuron: this.id,
                    label: wrapperLabel
                }
            })

            neuronParent = `${this.getCyId()}w`
        }

        /// add the neuron to the canvas
        cy.add({
            group: 'nodes', 
            grabbable: false,
            data: { 
                id: this.getCyId(), 
                parent: neuronParent, 
                type: 'neuron',
                layer: this.layer.id,
                neuron: this.id,
                label: `${this.value}`.substring(0, 3)
            }, 
            position: {
                x: cypos.x,
                y: cypos.y
            }
        })

        // connect the neuron to the previous layers
        for (let previousLayer of this.layer.inputFrom) {
            let source = {layer: previousLayer.id, nodes: previousLayer.getConnectionIds()}
            this.drawConnectionFrom({cy, source})
        }

        // connect the neuron to the outgoing layers
        for (let nextLayer of this.layer.outputTo) {
            let target = {layer: nextLayer.id, nodes: nextLayer.getConnectionIds()}
            this.drawConnectionTo({cy, target})
        }
    }

    drawConnectionFrom({cy, source}: {cy, source: {layer: number, nodes: Array<string>}}) {

        for (let node of source.nodes) {
            cy.add({
                group: 'edges', 
                data: {
                    id: `${node}e${this.getCyId()}`, 
                    source: node, 
                    target: this.getCyId(),
                    sourceLayer: source.layer,
                    targetLayer: this.layer.id
                }
            })
        }
    }

    drawConnectionTo({cy, target}: {cy, target:{layer: number, nodes: Array<string>}}) {

        for (let node of target.nodes) {
            cy.add({
                group: 'edges', 
                data: {
                    id: `${this.getCyId()}e${node}`, 
                    source: this.getCyId(), 
                    target: node,
                    sourceLayer: this.layer.id,
                    targetLayer: target.layer
                }
            })
        }
    }

    remove({cy}) {
        let eles = cy.filter((element, i) => {
            return element.isNode() && element.data('layer') == this.layer.id && element.data('neuron') == this.id
        }, this)
        eles.remove()
    }
}