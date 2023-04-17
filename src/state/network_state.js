import { LitState } from 'lit-element-state';

import net from '../network/net'

class NetworkState extends LitState {

    static get stateVars() {
        return {
            net: net,
            selectedLayer: null,
            selectedNeuron: null
        }
    }

    deselect() {
        this.selectedLayer = null
        this.selectedNeuron = null
    }

    selectLayer(id) {
        this.selectedLayer = id
        this.selectedNeuron = null
    }

    selectNeuron(id) {
        this.selectedLayer = null
        this.selectedNeuron = id
    }
}

export const networkState = new NetworkState();