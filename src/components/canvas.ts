import { ReactiveController } from 'lit'
import { CReactiveControllerHost } from '@/types/c_reactive_controller_host'

import * as cytoscape from 'cytoscape'

/* import { CLayer } from '@/components/network/c_layer'
import { NeuronLayer } from '@/components/network/neuron_layer'
import { Neuron } from '@/components/network/neuron'
import { Edge } from '@/components/network/edge' */

import { Position } from '@/types/position'

import { panelGroups } from '@/contexts/panels_context'

export class Canvas implements ReactiveController {
  host: CReactiveControllerHost

  cy: cytoscape.Core

  LAYER_WIDTH: number
  LAYER_PADDING: number
  LAYER_DISTANCE: number
  NEURON_SIZE: number
  NEURON_DISTANCE: number

  constructor(host: CReactiveControllerHost, ref: HTMLDivElement) {
    this.host = host
    host.addController(this)
    this.LAYER_WIDTH = 300
    this.LAYER_PADDING = 20
    this.LAYER_DISTANCE = 150
    this.NEURON_SIZE = 100
    this.NEURON_DISTANCE = 40

    // create cytoscape canvas
    this.cy = cytoscape({
      container: ref, // container to render in

      elements: [
        // list of graph elements to start with
      ],

      style: [
        // the stylesheet for the graph
        {
          selector: 'node[type="layer"]',
          style: {
            shape: 'round-rectangle',
            'background-color': '#ffffff',
            'border-color': '#efefef',
            'border-width': 5,
            padding: this.LAYER_PADDING,
            label: 'data(label)',
            'text-halign': 'left',
            'text-valign': 'center',
            'text-margin-x': -20,
            'z-compound-depth': 'bottom',
          },
        },
        {
          selector: 'node[type="layer"]:selected',
          style: {
            'border-color': '#26A269',
          },
        },
        {
          selector: 'node[type="neuron-wrapper"]',
          style: {
            shape: 'round-rectangle',
            'border-width': 5,
            'border-color': 'black',
            padding: 0,
            label: 'data(label)',
            'text-halign': 'center',
            'text-valign': 'bottom',
            'text-margin-y': 20,
            'z-compound-depth': 'bottom',
          },
        },
        {
          selector: 'node[type="neuron"]',
          style: {
            shape: 'round-rectangle',
            'background-color': 'white',
            'border-width': 5,
            'border-color': '#0183C7',
            width: '95px',
            height: '95px',
            label: 'data(label)',
            'text-halign': 'center',
            'text-valign': 'center',
            'z-compound-depth': 'bottom',
          },
        },
        {
          selector: 'node[type="neuron"][wrapped="true"]',
          style: {
            width: '90px',
            height: '90px',
          },
        },
        {
          selector: 'node[type="neuron"]:selected',
          style: {
            'border-color': '#26A269',
          },
        },
        {
          selector: 'edge',
          style: {
            width: 3,
            'line-color': 'lightgray',
            'target-arrow-color': 'gray',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
          },
        },
        {
          selector: 'edge:selected',
          style: {
            'line-color': '#26A269',
            'target-arrow-color': '#26A269',
          },
        },
      ],
      wheelSensitivity: 0.2,
      boxSelectionEnabled: false,
      selectionType: 'single',
    })

    // Add event listener: when tapped on canvas, remove the current selection
    // and close the panels as well
    this.cy.on('tap', (e) => {
      if (e.target === this.cy) {
        this.host.selected.select()
        this.host.panels.close(...panelGroups['right'])
      }
    })

    // Add event listener for selection of layers or nodes
    this.cy.on('select', 'node, edge', (e: cytoscape.EventObject) => {
      const evtTarget = <cytoscape.SingularData>e.target

      // Prevent selection of multiple nodes by holding shift
      this.cy
        .elements()
        .not(<cytoscape.CollectionArgument>evtTarget)
        .unselect()

      if (evtTarget.isNode()) {
        const cyNode = evtTarget

        if (cyNode.data('type') == 'layer') {
          const layer /* : CLayer */ =
            this.host.networkConf.network.getLayerById(
              <number>cyNode.data('layer')
            )
          this.host.selected.select({ layer })
        } else if (cyNode.data('type') == 'neuron') {
          const layer /* : NeuronLayer */ =
            /* <NeuronLayer> */ this.host.networkConf.network.getLayerById(
              <number>cyNode.data('layer')
            )
          const neuron /* : Neuron */ =
            layer.neurons[<number>cyNode.data('neuron') - 1]
          this.host.selected.select({ layer, neuron })
        }
      } else if (evtTarget.isEdge()) {
        const cyEdge = evtTarget
        const sourceLayer /* : CLayer */ =
          this.host.networkConf.network.getLayerById(
            <number>cyEdge.source().data('layer')
          )
        let sourceNeuron /* : Neuron */ = null
        /* if (sourceLayer instanceof NeuronLayer) { */
        sourceNeuron = sourceLayer.neurons[cyEdge.source().data('neuron') - 1]
        /* } */
        const targetLayer /* : CLayer */ =
          this.host.networkConf.network.getLayerById(
            <number>cyEdge.target().data('layer')
          )
        let targetNeuron /* : Neuron */ = null
        /* if (targetLayer instanceof NeuronLayer) { */
        targetNeuron = targetLayer.neurons[cyEdge.target().data('neuron') - 1]
        /* } */

        const edge /* : Edge */ = {
          sourceLayer: sourceLayer,
          sourceNeuron: sourceNeuron,
          targetLayer: targetLayer,
          targetNeuron: targetNeuron,
        }
        this.host.selected.select({ edge })
      }
    })
  }

  hostConnected(): void {
    console.log('canvas controller connected')
  }

  hostDisconnected(): void {
    console.log('canvas controller disconnected')
  }

  /*
  CANVAS MANIPULATION
  */
  zoomOut(): void {
    if (this.cy) {
      this.cy.zoom(this.cy.zoom() - 0.1)
    }
  }
  // fit the graph to all elements with a specified padding
  fit(): void {
    if (this.cy) {
      this.cy.fit(this.cy.$(''), 30)
    }
  }
  zoomIn(): void {
    if (this.cy) {
      this.cy.zoom(this.cy.zoom() + 0.1)
    }
  }

  /*
  POSITIONING
  */
  // get the width of an element
  getHeight(id: string): number {
    const elm = this.cy.getElementById(id)
    return elm.outerHeight()
  }

  // generate a new position, currently just in the middle of the canvas
  generatePos(): Position {
    const viewport = this.cy.extent()
    return {
      x: viewport.x1 + (viewport.x2 - viewport.x1) / 2,
      y: viewport.y1 + (viewport.y2 - viewport.y1) / 2,
    }
  }
}
