import Layer from "@/network/layer"

type DatasetRegressionLabel = {
    type: "regression"
    key: string
    description: string
    layer?: Layer
}

export default DatasetRegressionLabel