import { State, property } from "@lit-app/state";
import NeuralNet from "./network/net";
import Dataset from "@/dataset/dataset";
import Layer from "@/network/layer";
import Neuron from "@/network/neuron";

class myState extends State {
  @property({value: new NeuralNet()}) network: NeuralNet
  @property({value: null}) dataset: Dataset
  @property({value: null}) canvas
  @property({value: 'network'}) activeRightPanel: 'network' | 'dataset' | 'training' | 'predict' | 'layer' | 'neuron' | 'edge' | null
  @property({value: 'plots'}) activeBottomPanel: 'plots' | 'error rate' | null
  @property({value: null}) activeLayer: Layer | null
  @property({value: null}) activeNeuron: Neuron | null
  @property({value: null}) activeEdge: {
    sourceLayer: Layer,
    sourceNeuron: Neuron | null,
    targetLayer: Layer,
    targetNeuron: Neuron | null
  }
  @property({value: null}) selected: 'layer' | 'neuron' | 'edge' | null
}

const state = new myState()
export default state