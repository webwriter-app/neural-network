import Layer from "@/network/layer"
import DatasetInput from "@/types/dataset_input"
import DatasetRegressionLabel from "@/types/dataset_regression_label"
import DatasetClassificationLabel from "@/types/dataset_classification_label"

export default class Dataset {

    // information about the dataset
    name: string
    description: string

    // formal description of input and labels, not the data
    inputs: DatasetInput[]
    label: DatasetRegressionLabel | DatasetClassificationLabel

    // data
    data: Array<{inputs: number[], label: number}>

    constructor({name, description, inputs, label}, data: Array<{inputs: number[], label: number}>) {
        this.name = name
        this.description = description
        this.inputs = inputs
        this.label = label
        this.data = data
    }

    /*
    INPUTS
    */
    getNonAssignedInputKeys(): string[] {
        const nonAssignedInputs = this.inputs.filter(input => !input.layer)
        return nonAssignedInputs.map(input => input.key)
    }

    getAssignedInputsFor(layer: Layer): DatasetInput[] {
        return this.inputs.filter(input => input.layer == layer)
    }

    getInputByKey(key: string): DatasetInput {
        const input = this.inputs.find(input => input.key == key)
        return input
    }

    assignInputToLayer({key, layer}: {key: string, layer: Layer}): void {
        const input = this.getInputByKey(key)
        input.layer = layer
    }

    dismissInput({key}: {key: string}): void {
        const input = this.getInputByKey(key)
        input.layer = null
    }

    getInputDataForLayer(layer: Layer) {

        // get the indizes for the data that belongs to the layer
        const desiredIndizes = []
        for (const [index, input] of this.inputs.entries()) {
            if (input.layer == layer) desiredIndizes.push(index)
        }

        // filter the data
        const inputData = this.data.map(({inputs, label}) => inputs.filter((input, index) => desiredIndizes.includes(index)))
        return inputData
    }

    /*
    LABEL
    */
    // returns our label key, only if it is not assigned
    getNonAssignedLabelKey(): string {
        if (!this.getLabel().layer) return this.getLabel().key
        return null
    }

    // returns our label
    getLabel(): DatasetRegressionLabel | DatasetClassificationLabel {
        return this.label
    }

    // assign our label to a layer
    assignLabelToLayer({layer}: {layer: Layer}): void {
        const label = this.getLabel()
        label.layer = layer
    }

    dismissLabel(): void {
        this.getLabel().layer = null
    }

    getLabelData() {
        return this.data.map(({inputs, label}) => label)
    }

    /*
    DATA
    */
    getData() {
        return this.data
    }
}