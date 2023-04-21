import Layer from '@/network/layer'
import Activation from '@/types/activation'

export default class InputLayer extends Layer {
    
    id: number
    inputFrom: []
    units: number
    activation: Activation.None
    outputTo: Array<Layer>

    built: boolean 

    static description: string = "An input layer is a layer..."

    constructor({units = 1, activation = Activation.ReLu}) {
        
        super({inputFrom: [], activation: activation})
        this.units = units
    }

    /*
    BUILDING ENTITY FOR CANVAS
    */
    buildGraph(canvas, XPOS_ADDENDUM) {
        
        let xPos = XPOS_ADDENDUM
        let yPos = 0
        canvas.add({
            group: 'nodes',
            grabbable: true,
            data: { 
                id: `entity:${this.name}`, 
                type: 'entity',
                label: `${this.name}`,
                entity: `${this.name}`,
            },
            position: {
                x: xPos,
                y: yPos
            },
            style: {
                backgroundImage: "https://img.icons8.com/ios/100/null/database--v1.png"
            }
        })

        // determine the width of the entity node and return it added to the XPOS_ADDENDUM
        const ENTITY_WIDTH = canvas.getElementById(`entity:${this.name}`).outerWidth()
        return XPOS_ADDENDUM + ENTITY_WIDTH
    }
}