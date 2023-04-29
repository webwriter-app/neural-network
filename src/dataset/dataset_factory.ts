import Dataset from "@/dataset/dataset"

export default abstract class DatasetFactory {

    constructor() {
    }

    static async openDataset(path: string): Promise<Dataset> {
        // parse JSON here, determine if type is regression or classification and create class by calling the corresponding constructor
        const jsonFile = await fetch(path)
        const jsonObject = await jsonFile.json()
        const config = Object.create(jsonObject)
        delete config["type"]

        return new Dataset(config)
    }

    static getDatasetByName(name: string): Promise<Dataset> {
        switch (name) {
            case "Boston House Pricing": return this.openDataset("/dataset/boston.json")
        }
    }

    static getOptions(): Array<{
        name: string,
        path: string
    }> 
    {
        return [
            {
                name: "Boston House Pricing",
                path: "/dataset/boston"
            }
        ] 
    }
}