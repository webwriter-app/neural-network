import Dataset from "@/dataset/dataset"

export default abstract class DatasetFactory {

    constructor() {
    }

    static async openDataset(basepath: string): Promise<Dataset> {

        // parse JSON config
        const jsonFile = await fetch(`${basepath}/config.json`)
        const jsonObject = await jsonFile.json()
        const config = Object.create(jsonObject)
        delete config["type"]

        // load data
        const dataFile = await fetch(`${basepath}/data.txt`)
        const text = await dataFile.text()
        const lines = text.split("\n");
        const data = []
        for (const line of lines) {
            // remove spaces in the beginning and end with trim and use split to convert into array of the values
            const values = line.trim().split(/\s+/)

            // add keys to the values
            const inputData = {}
            let index = 0
            for (const input of config.inputs) {
                inputData[input.key] = values[index]
                index += 1
            }
            const outputData = {}
            for (const output of config.outputs) {
                outputData[output.key] = values[index]
                index += 1
            }
            

            // add parsed data from this line to the data array
            data.push({
                inputData: inputData,
                outputData: outputData
            })
        }

        return new Dataset(config, data)
    }

    static getDatasetByName(name: string): Promise<Dataset> {
        switch (name) {
            case "Boston House Pricing": return this.openDataset("/dataset/boston")
            case "Pima Indians Diabetes": return this.openDataset("/dataset/diabetes")
        }
    }

    static getOptions(): string[] {
        return ["Boston House Pricing", "Pima Indians Diabetes"] 
    }
}