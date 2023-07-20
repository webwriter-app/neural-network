import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import { ShortcutListener } from '@/utils/shortcut_listener'

import { provide } from '@lit-labs/context'
import { Canvas, canvasContext } from '@/contexts/canvas_context'
import {
  NetworkConf,
  networkConfContext,
} from '@/contexts/network_conf_context'
import { dataSetContext } from '@/contexts/data_set_context'
import {
  TrainOptions,
  trainOptionsContext,
} from '@/contexts/train_options_context'
import { Model, modelContext } from '@/contexts/model_context'
import { Selected, selectedContext } from '@/contexts/selected_context'
import { panelGroups, Panels, panelsContext } from '@/contexts/panels_context'

import { DataSet } from '@/data_set/data_set'
import { DataSetFactory } from '@/data_set/data_set_factory'

import { Network } from '@/components/network/network'
import { CLayer } from '@/components/network/c_layer'
import { CLayerConnection } from '@/components/network/c_layer_connection'
import { Neuron } from '@/components/network/neuron'
import { Edge } from '@/components/network/edge'

import { spawnAlert } from '@/utils/alerts'

import '@/components/network/network'
import '@/components/canvas_area'
import '@/components/menu_area'

import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'

@customElement('ww-deeplearning')
export class WwDeepLearning extends LitElementWw {
  // FIELDS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // keyboard shortcuts listener
  private shortcutListener = new ShortcutListener(this)

  // -> CONTEXT  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // the only way lit detects changes and notifies the consumers about them is
  // if the whole context object was reassigned. thus, context functions do not
  // just assign values to some object properties but reassign the whole object
  // by either creating a new one or changing the current and reassigning it
  // with Object.create() (similar but not according to the immutable pattern)

  // canvas context: provides the canvas (currently a reactive controller) and
  // its corresponding actions
  @provide({ context: canvasContext })
  @property({ attribute: true, reflect: true })
  canvas: Canvas

  // network context: provides the network (currently a reactive controller
  // containing other reactive controller) and its corresponding actions
  @provide({ context: networkConfContext })
  @property({ attribute: true, reflect: true })
  networkConf: NetworkConf

  // dataSet context: provides the dataSet (currently a simple class instance)
  // and its corresponding actions
  @provide({ context: dataSetContext })
  @property({ attribute: true, reflect: true })
  dataSet: DataSet

  // trainOptions context: provides the dataSet (currently a simple class instance)
  // and its corresponding actions
  @provide({ context: trainOptionsContext })
  @property({ attribute: true, reflect: true })
  trainOptions: TrainOptions = {
    learningRate: '0.01',
    dropoutRate: '0',
    epochs: '7',
    batchSize: '50',
    lossFunction: 'meanSquaredError',
    optimizer: 'sgd',
    setOption: (attribute: string, value: string) => {
      this.trainOptions[attribute] = value
      this.trainOptions = <TrainOptions>Object.create(this.trainOptions)
    },
  }

  // HTML container where metrics like accuracy and loss are plotted into
  @state()
  trainMetricsContainer: HTMLDivElement

  // model context: provides the tensorflow.js model based on the network and
  // corresponding actions like training
  @provide({ context: modelContext })
  @property({ attribute: true, reflect: true })
  model: Model = {
    model: null,
    reset: () => {
      if (this.model.model) {
        // set stopRequested to true because we want to be able to call reset()
        // also to abort a current running training session. Will not have any
        // complications because the train method itself sets it to false before
        // it is used
        this.model.stopRequested = true

        // set the model to null
        this.model.model = null
        this.model = <Model>Object.create(this.model)

        // empty the container for the metrics. if we did not do this, it would
        // also show the metrics from the previous training
        this.trainMetricsContainer.innerHTML = ''
      }
    },
    build: () => {
      this.model.reset()
      const model = this.networkConf.network.buildModel()
      if (model && this.dataSet) {
        const optimizer = tf.train.sgd(
          parseFloat(this.trainOptions.learningRate)
        )
        const metrics: string[] = []
        let loss: string
        if (this.dataSet.type == 'regression') {
          loss = 'meanSquaredError'
          metrics.push('mse')
        } else if (this.dataSet.type == 'classification') {
          loss = 'softmaxCrossEntropy'
          metrics.push('acc')
        } else {
          return
        }
        model.compile({
          optimizer,
          loss,
          metrics,
        })
        this.model.model = model
        console.log(model.summary())
        spawnAlert({
          message: `The model was successfully compiled! All hyperparameter and network architecture changes were taken into account!`,
          variant: 'success',
          icon: 'check-circle',
        })
        this.model = <Model>Object.create(this.model)
      }
    },
    isTraining: false,
    actBatch: null,
    actEpoch: null,
    train: () => {
      if (!this.model.model) {
        this.model.build()
      }

      if (this.model.model) {
        // a manual stop can be requested by setting this variable to true (is
        // periodically checked)
        this.model.stopRequested = false

        // set the isTraining boolean variable that is used in the ui do
        // determine what to display
        this.model.actEpoch = 0
        this.model.actBatch = 0
        this.model.isTraining = true
        this.model = <Model>Object.create(this.model)

        // inputs
        const inputs: number[][] = []
        for (const inputLayer of this.networkConf.network.getInputLayers()) {
          inputs.push(...this.dataSet.getInputDataForLayer(inputLayer))
        }
        console.log(tf.tensor(inputs).shape)

        // labels
        const labels: number[] = this.dataSet.getLabelData()

        // desired metrics
        const metrics: string[] = ['loss']
        if (this.dataSet.type == 'regression') {
          metrics.push('mse')
        } else if (this.dataSet.type == 'classification') {
          metrics.push('acc')
        } else {
          return
        }

        // start the training itself
        void this.model.model
          .fit(tf.tensor(inputs), tf.tensor(labels), {
            epochs: parseInt(this.trainOptions.epochs),
            batchSize: parseInt(this.trainOptions.batchSize),
            callbacks: [
              tfvis.show.fitCallbacks(this.trainMetricsContainer, metrics, {
                height: 100,
              }),
              {
                onBatchEnd: (batch: number, _logs) => {
                  // after each batch check if a stop was requested
                  if (this.model.stopRequested) {
                    this.model.model.stopTraining = true
                  }
                  this.model.actBatch = batch + 1
                  this.model = <Model>Object.create(this.model)
                },
                onEpochEnd: (epoch: number, _logs) => {
                  this.model.actEpoch = epoch + 1
                  this.model = <Model>Object.create(this.model)
                },
              },
            ],
          })
          .then((info) => {
            console.log('Final MSE', info.history.mse)
            console.log(info)
          })
          .catch((err) => {
            console.error(err)
          })
          .finally(() => {
            setTimeout(() => {
              this.model.isTraining = false
              this.model = <Model>Object.create(this.model)
            }, 500)
          })
      }
    },
    stopRequested: false,
    predict: () => {
      return
    },
  }

  // selected context: provides info about what item in the canvas (layer,
  // neuron, edge) is currently selected and a function to change that
  @provide({ context: selectedContext })
  @property({ attribute: true, reflect: true })
  selected: Selected = {
    select: ({
      layer = null,
      neuron = null,
      edge = null,
    }: { layer?: CLayer; neuron?: Neuron; edge?: Edge } = {}) => {
      const newSelected = {
        select: this.selected.select,
      }
      if (neuron && layer) {
        newSelected['neuron'] = neuron
        newSelected['layer'] = layer
        this.panels.open('neuron', 'right')
      } else if (layer) {
        newSelected['layer'] = layer
        this.panels.open('layer', 'right')
      } else if (edge) {
        /* if(elm instanceof Edge) */
        newSelected['edge'] = edge
        this.panels.open('edge', 'right')
      }
      this.selected = newSelected
    },
  }

  // panels context: provide the open panels and functions to change them
  @provide({ context: panelsContext })
  @property({ attribute: true, reflect: true, type: Object })
  panels: Panels = {
    openPanels: [],
    open: (panel: string, group?: string) => {
      if (group) {
        this.panels.close(...panelGroups[group])
      }
      this.panels.openPanels.push(panel)
      this.panels = <Panels>Object.create(this.panels)
    },
    close: (...panels: string[]) => {
      this.panels.openPanels = this.panels.openPanels.filter((openPanel) => {
        return !panels.includes(openPanel)
      })
      this.panels = <Panels>Object.create(this.panels)
    },
    containsSome: (...panels: string[]) => {
      return this.panels.openPanels.some((openPanel) => {
        return panels.includes(openPanel)
      })
    },
  }

  // LIFECYCLE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async connectedCallback() {
    super.connectedCallback()

    // create the standard network conf
    this.createNetworkConf()

    // load the standard dataSet
    const dataSet = await DataSetFactory.getDataSetByName(
      'Boston House Pricing'
    )
    this.setDataSet(dataSet)
  }

  // OWN METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // initialize the canvas
  createCanvas(container: HTMLDivElement) {
    this.canvas = new Canvas(this, container)
  }

  // create network conf
  createNetworkConf() {
    this.networkConf = {
      layers: new Map<number, CLayer>(),
      addLayer: (layer: CLayer) => {
        this.networkConf.layers.set(layer.layerId, layer)
        this.networkConf = <NetworkConf>Object.create(this.networkConf)
      },
      removeLayer: (layerId: number) => {
        this.networkConf.layers.delete(layerId)
        this.networkConf = <NetworkConf>Object.create(this.networkConf)
      },
      layerConnections: new Map<[number, number], CLayerConnection>(),
      addLayerConnection: (layerConnection: CLayerConnection) => {
        this.networkConf.layerConnections.set(
          [
            layerConnection.sourceLayer.layerId,
            layerConnection.targetLayer.layerId,
          ],
          layerConnection
        )
        this.networkConf = <NetworkConf>Object.create(this.networkConf)
      },
      removeLayerConnection: (key: [number, number]) => {
        this.networkConf.layerConnections.delete(key)
        this.networkConf = <NetworkConf>Object.create(this.networkConf)
      },
      network: null,
    }
  }

  // initialize the network
  createNetwork(network: Network) {
    console.log('created network')
    this.networkConf.network = network
    this.networkConf = <NetworkConf>Object.create(this.networkConf)
  }

  // reset the network by resetting the network conf
  clearNetwork() {
    const network = this.networkConf.network
    this.createNetworkConf()
    this.networkConf.network = network
    console.log('cleared network')
  }

  // set the dataset and handles everything that needs to be done on a dataset
  // change
  setDataSet(dataSet: DataSet) {
    this.dataSet = dataSet
    // reset the model
    this.model.reset()
    // notify the network to update its layers
    if (this.networkConf.network) this.networkConf.network.handleDataSetChange()
  }

  // set error rate container
  setTrainMetricsContainer(container: HTMLDivElement) {
    this.trainMetricsContainer = container
    console.log('setting train metrics container to ')
    console.log(container)
    console.log(this.trainMetricsContainer)
  }

  // stop training
  stopTraining() {
    this.model.stopRequested = true
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = [
    globalStyles,
    css`
      #app {
        height: 100vh;
        display: flex;
        flex-direction: row;
        overflow: hidden;
        background-color: #f7f7f7;
      }

      #loadingDiv {
        position: absolute;
        left: 50%;
        top: 50%;
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      canvas-area {
        width: calc(100% - 450px);
        height: 100%;
      }

      canvas-area.right-collapsed {
        width: 100%;
      }

      menu-area {
        width: 450px;
      }

      menu-area.right-collapsed {
        width: 0;
      }

      #divider {
        position: absolute;
        right: 449px;
        width: 2px;
        top: 10px;
        bottom: 10px;
        background-color: #efefef;
      }
    `,
  ]

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <div id="app">
        ${this.dataSet
          ? html`
            <canvas-area
              class="${
                !this.panels.containsSome(...panelGroups['right'])
                  ? 'right-collapsed'
                  : ''
              }"
              @canvas-created="${(e: CustomEvent<HTMLDivElement>) =>
                this.createCanvas(e.detail)}"
            ></canvas-area>

            <div
              id="divider"
              class="${
                !this.panels.containsSome(...panelGroups['right'])
                  ? 'hidden'
                  : ''
              }"
            ></div>

            <menu-area
              class="${
                !this.panels.containsSome(...panelGroups['right'])
                  ? 'right-collapsed'
                  : ''
              }"
              @change-data-set="${(e: CustomEvent<DataSet>) =>
                this.setDataSet(e.detail)}"
              @clear-network="${(_e: Event) => this.clearNetwork()}"
              @set-train-metrics-container="${(
                e: CustomEvent<HTMLDivElement>
              ) => this.setTrainMetricsContainer(e.detail)}"
              @stop-training="${(_e: Event) => this.stopTraining()}"
            ></menu-area>
          </div>
        `
          : html`
              <div id="loadingDiv">
                <h1>Loading</h1>
                <sl-spinner style="font-size: 3rem;"></sl-spinner>
              </div>
            `}
        ${this.networkConf
          ? html` <c-network
              @network-created="${(e: CustomEvent<Network>) =>
                this.createNetwork(e.detail)}"
            ></c-network>`
          : html``}
      </div>
    `
  }
}
