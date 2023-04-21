import { LitState } from 'lit-element-state';

import NeuralNet from '../network/net'

class NetworkState extends LitState {

    net: NeuralNet
    activeEntity: string | null
    activeLayer: string | null
    activeNeuron: string | null
    activeEdge: {
        type: 'entity' | 'layer',
        source: string,
        target: string
    }
    selected: 'entity' | 'layer' | 'neuron' | 'edge' | null
    // no extra entry for activeActivation because the string would be the same as for activeNeuron. Instead, we can
    // differentiate between neuron and activation by 'selected'
        
    static get stateVars()
    {
        return {
            net: new NeuralNet({layers: []}),
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
        this.activeEdge = null
        this.selected = null
    }

    selectEntity({entity}) {
        this.deselect()
        this.activeEntity = entity
        this.selected = 'entity'
    }

    selectLayer({entity, layer}) {
        this.deselect()
        this.activeEntity = entity
        this.activeLayer = layer
        this.selected = 'layer'
    }

    selectNeuron({entity, layer = null, neuron}) {
        this.deselect()
        this.activeEntity = entity
        this.activeLayer = layer
        this.activeNeuron = neuron
        this.selected = 'neuron'
    }

    selectEdge({type, source, target}) {
        this.deselect()
        this.activeEdge = {
            type: type,
            source: source,
            target: target
        }
        this.selected = 'edge'
    }
}

const networkState = new NetworkState();

export default networkState