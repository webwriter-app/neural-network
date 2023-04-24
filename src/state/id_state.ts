import { LitState } from 'lit-element-state'
import networkState from './network_state'

// every layer has an unique id which is only a number. The corresponding node in the cytoscape canvas also has this id (as a string). Items inside a layer (like neurons) have their id's that depend on the parent's (layer's) id. These are only important for cytoscape. For example we might have a layer with id 33 that contains neurons with id's "33-neuron1" and "33-neuron2". This id state therefore is only needed to make sure no two layers have the same id. Therefore it counts up after a new id has requested and after importing a graph makes sure we start with an id higher than all the id's currently in the imported graph.
class IdState extends LitState {

    currentId
        
    static get stateVars()
    {
        return {
            currentId: 0
        }
    }

        // @TODO as soon as we can import networks (that then of course have predefined id's we have to invoke this after import
        // this.currentId = networkState.net.getMaxId() + 1

    reset() {
        this.currentId = 0
    }

    getFreshId() {

        this.currentId += 1

        return this.currentId
    }
}

const idState = new IdState()

export default idState