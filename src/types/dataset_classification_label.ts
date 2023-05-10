import Layer from "@/network/layer"

type DatasetClassificationLabel = {
    type: "classification"
    key: string
    description: string
    classes: Array<{
        key: string,
        description: string
    }>
    layer?: Layer
}

export default DatasetClassificationLabel