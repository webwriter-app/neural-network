import * as tf from '@tensorflow/tfjs';

export default class Activation {

    name: string
    identifier: string

    constructor({name, identifier}: {name: string, identifier: string}) {
        
        this.name = name
        this.identifier = identifier
    }

    static getActivationByName(name: string): Activation {
        switch (name) {
            case "None": return new Activation({name: 'None', identifier: null})
            case "ReLu": return new Activation({name: 'ReLu', identifier: 'relu'})
            case "Sigmoid": return new Activation({name: 'Sigmoid', identifier: 'sigmoid'})
            case "Softmax": return new Activation({name: 'Softmax', identifier: 'softmax'})
        }
    }

    static getOptions(): Array<string> {
        return ["None", "ReLu", "Sigmoid", "Softmax"]
    }
}