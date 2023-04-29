import Layer from "@/network/layer"

type DatasetClassificationOutput = {
    type: "classification"
    key: string
    description: string
    classes: Array<{
        key: string,
        description: string
    }>
    layer?: Layer
}

export default DatasetClassificationOutput