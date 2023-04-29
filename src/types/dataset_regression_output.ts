import Layer from "@/network/layer"

type DatasetRegressionOutput = {
    type: "regression"
    key: string
    description: string
    layer?: Layer
}

export default DatasetRegressionOutput