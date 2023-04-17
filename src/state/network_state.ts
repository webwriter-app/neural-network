import { LitState } from 'lit-element-state';

import { net, NeuralNet } from '../network/net'

class NetworkState extends LitState {

    net: NeuralNet
    activeEntity: string | null
    activeLayer: 'input' | number | null
    activeNeuron: number | null
    selected: 'entity' | 'layer' | 'neuron' | 'activation' | null
        
    static get stateVars()
    {
        return {
            net: net,
            activeEntity: null,
            activeLayer: null,
            activeNeuron: null,
            selected: null
        }
    }

    deselect() {
        this.activeEntity = null
        this.activeLayer = null
        this.activeNeuron = null
        this.selected = null
    }

    selectEntity(entity) {
        this.deselect()
        this.activeEntity = entity
        this.selected = 'entity'
    }

    selectLayer(entity, layer) {
        this.deselect()
        this.activeEntity = entity
        this.activeLayer = layer
        this.selected = 'layer'
    }

    selectNeuron(entity, neuron, layer = null) {
        this.deselect()
        this.activeEntity = entity
        this.activeLayer = layer
        this.activeNeuron = neuron
        this.selected = 'neuron'
    }

    selectActivation(entity, neuron, layer = null) {
        this.deselect()
        this.activeEntity = entity
        this.activeLayer = layer
        this.activeNeuron = neuron
        this.selected = 'activation'
    }
}

const networkState = new NetworkState();

export default networkState