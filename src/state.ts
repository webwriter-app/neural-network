import { State, property } from "@lit-app/state";
import NeuralNet from "./network/net";
import Dataset from "@/dataset/dataset";
import DatasetFactory from "@/dataset/dataset_factory";

class myState extends State {
  @property({value: new NeuralNet()}) network: NeuralNet
  @property({value: null}) canvas
  @property({value: null}) activeLayer: number | null
  @property({value: null}) activeNeuron: number | null
  @property({value: null}) activeEdge: {
    sourceLayer: number,
    sourceNeuron: number | null,
    targetLayer: number,
    targetNeuron: number | null
  }
  @property({value: null}) selected: 'layer' | 'neuron' | 'edge' | null
  @property({value: null}) dataset: Dataset
}

const state = new myState()
export default state