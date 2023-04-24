import { LitState } from 'lit-element-state';

import NeuralNet from '../network/net'

class NetworkState extends LitState {

    net: NeuralNet | null
    activeLayer: number | null
    activeNeuron: number | null
    activeEdge: {
        sourceLayer: number,
        sourceNeuron: number | null,
        targetLayer: number,
        targetNeuron: number | null
    } | null
    selected: 'layer' | 'neuron' | 'edge' | null
    // no extra entry for activeActivation because the string would be the same as for activeNeuron. Instead, we can
    // differentiate between neuron and activation by 'selected'
        
    static get stateVars()
    {
        return {
            net: null,
            activeLayer: null,
            activeNeuron: null,
            activeEdge: null,
            selected: null
        }
    }

    /*
    NETWORK
    */
    getNet() {
        if (!this.net) {
            this.net = new NeuralNet({})
        }
        return this.net
    }
    setNet(net) {
        this.net = net
    }

    /*
    SELECTION
    */
    deselect() {
        this.selected = null
        this.activeLayer = null
        this.activeNeuron = null
        this.activeEdge = null
    }

    selectLayer({layer}) {
        this.deselect()
        this.activeLayer = layer
        this.selected = 'layer'
    }

    selectNeuron({layer = null, neuron}) {
        this.deselect()
        this.activeLayer = layer
        this.activeNeuron = neuron
        this.selected = 'neuron'
    }

    selectEdge({sourceLayer, sourceNeuron = null, targetLayer, targetNeuron = null}) {
        this.deselect()
        this.activeEdge = {
            sourceLayer: sourceLayer,
            sourceNeuron: sourceNeuron,
            targetLayer: targetLayer,
            targetNeuron: targetNeuron
        }
        this.selected = 'edge'
    }
}

const networkState = new NetworkState();

export default networkState