// layer/neuron/edge represent the cyId of the element (only one property is set
// as a time since no multi-selection is allowed)
export interface Selected {
  layer?: string
  neuron?: string
  edge?: string
}
