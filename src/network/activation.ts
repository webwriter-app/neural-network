export default class Activation {

    name: string
    activate: Function

    constructor({name, activate}: {name: string, activate: Function}) {
        
        this.name = name
        this.activate = activate
    }

    static getActivationByName(name: string): Activation {
        switch (name) {
            case "None": return new Activation({name: 'None', activate: (i) => {return i}})
            case "ReLu": return new Activation({name: 'ReLu', activate: (i) => {return i}})
            case "Sigmoid": return new Activation({name: 'Sigmoid', activate: (i) => {return i}})
            case "Softmax": return new Activation({name: 'Softmax', activate: (i) => {return i}})
        }
    }

    static getOptions(): Array<string> {
        return ["None", "ReLu", "Sigmoid", "Softmax"]
    }
}