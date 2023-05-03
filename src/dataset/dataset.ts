import Layer from "@/network/layer"
import DatasetInput from "@/types/dataset_input"
import DatasetRegressionOutput from "@/types/dataset_regression_output"
import DatasetClassificationOutput from "@/types/dataset_classification_output"

export default class Dataset {

    name: string
    description: string
    inputs: DatasetInput[]
    outputs: Array<DatasetRegressionOutput | DatasetClassificationOutput>
    data: Array<{inputData: any, outputData: any}>

    constructor({name, description, inputs, outputs}, data: Array<{inputData: any, outputData: any}>) {
        this.name = name
        this.description = description
        this.inputs = inputs
        this.outputs = outputs
        this.data = data
    }

    /*
    INPUTS
    */
    getNonAssignedInputKeys(): string[] {
        const nonAssignedInputs = this.inputs.filter(input => !input.layer)
        return nonAssignedInputs.map(input => input.key)
    }

    getInputByKey(key: string): DatasetInput {
        let input = this.inputs.find(input => input.key == key)
        return input
    }

    assignInputToLayer({key, layer}: {key: string, layer: Layer}): void {
        let input = this.getInputByKey(key)
        input.layer = layer
    }

    dismissInput({key}: {key: string}): void {
        let input = this.getInputByKey(key)
        input.layer = null
    }

    /*
    OUTPUTS
    */
    getNonAssignedOutputKeys(): string[] {
        const nonAssignedOutputs = this.outputs.filter(output => !output.layer)
        return nonAssignedOutputs.map(output => output.key)
    }

    getOutputByKey(key: string): DatasetRegressionOutput | DatasetClassificationOutput {
        let output = this.outputs.find(output => output.key == key)
        return output
    }

    assignOutputToLayer({key, layer}: {key: string, layer: Layer}): void {
        let output = this.getOutputByKey(key)
        output.layer = layer
    }

    dismissOutput({key}: {key: string}): void {
        let output = this.getOutputByKey(key)
        output.layer = null
    }

    /*
    DATA
    */
    getData() {
        return this.data
    }
}