import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { customElement, state, query } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import * as cytoscape from 'cytoscape'

import { consume } from '@lit-labs/context'
import { networkContext } from '@/contexts/network_context'
import { panelGroups } from '@/contexts/panels_context'

import type { Network } from '@/components/network/network'
import type { CLayer } from '@/components/network/c_layer'
import { NeuronLayer } from '@/components/network/neuron_layer'
import type { Neuron } from '@/components/network/neuron'
import type { Edge } from '@/components/network/edge'
import type { Position } from '@/types/position'

@customElement('c-canvas')
export class CCanvas extends LitElementWw {
  LAYER_WIDTH = 300
  LAYER_PADDING = 20
  LAYER_DISTANCE = 150
  NEURON_SIZE = 100
  NEURON_DISTANCE = 40

  @query('#canvasElm', true)
  _canvasElm: HTMLDivElement

  @consume({ context: networkContext, subscribe: true })
  network: Network

  @state()
  listenerActive: boolean = false

  @state()
  cy: cytoscape.Core

  async connectedCallback() {
    super.connectedCallback()
    await this.updateComplete
    if (!this.cy) {
      const MAIN_COLOR: string = '#2C3333'
      const CONTRAST_COLOR: string = 'white'
      const SECOND_COLOR: string = '#2E4F4F'
      const NEUTRAL_COLOR: string = '#2D033B'
      const ACCENT_COLOR: string = '#0183C7'
      const SELECTED_COLOR: string = 'black'
      const POSITIVE_COLOR: string = '#A3F7BF'
      const NEGATIVE_COLOR: string = '#F35588'

      // create cytoscape canvas
      this.cy = cytoscape({
        container: this._canvasElm, // container to render in

        elements: [
          // list of graph elements to start with
        ],

        style: [
          // the stylesheet for the graph
          {
            selector: 'node[type="layer"]',
            style: {
              shape: 'round-rectangle',
              'background-color': MAIN_COLOR,
              'border-color': SECOND_COLOR,
              'border-width': 5,
              padding: this.LAYER_PADDING,
              label: 'data(label)',
              'text-halign': 'left',
              'text-valign': 'center',
              'text-margin-x': -20,
              'z-index': function (ele: cytoscape.NodeSingular) {
                return ele.data('layer') * 3
              },
              'z-compound-depth': 'bottom',
            },
          },
          {
            selector: 'node[type="layer"]:selected',
            style: {
              'border-color': SELECTED_COLOR,
            },
          },
          {
            selector: 'node[type="neuron-wrapper"]',
            style: {
              shape: 'round-rectangle',
              'border-width': 5,
              'border-color': SECOND_COLOR,
              padding: 0,
              label: 'data(label)',
              color: CONTRAST_COLOR,
              'text-halign': 'center',
              'text-valign': function (ele: cytoscape.NodeSingular) {
                return <'bottom' | 'top'>ele.data('textPos')
              },
              'text-margin-y': function (ele: cytoscape.NodeSingular) {
                if (ele.data('textPos') == 'top') {
                  return -20
                } else {
                  return 20
                }
              },
              'z-index': function (ele: cytoscape.NodeSingular) {
                return ele.data('layer') * 3 + 1
              },
              'z-compound-depth': 'bottom',
            },
          },
          {
            selector: 'node[type="neuron"]',
            style: {
              shape: 'round-rectangle',
              'background-color': MAIN_COLOR,
              'border-width': 5,
              'border-color': ACCENT_COLOR,
              width: '95px',
              height: '95px',
              'text-halign': 'center',
              'text-valign': 'center',
              'z-index': function (ele: cytoscape.NodeSingular) {
                return ele.data('layer') * 3 + 2
              },
              'z-compound-depth': 'bottom',
            },
          },
          {
            selector: 'node[type="neuron"][label]',
            style: {
              color: CONTRAST_COLOR,
              label: 'data(label)',
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
              'border-color': SELECTED_COLOR,
            },
          },
          {
            selector: 'edge',
            style: {
              width: function (ele: cytoscape.EdgeSingular) {
                if (ele.data('weight')) {
                  return Math.min(15, Math.abs(<number>ele.data('weight')) * 6)
                } else {
                  return 3
                }
              },
              'curve-style': 'bezier',
              'line-cap': 'round',
              'line-color': function (ele: cytoscape.EdgeSingular) {
                if (ele.data('weight')) {
                  if (ele.data('weight') < 0) {
                    return NEGATIVE_COLOR
                  } else if (ele.data('weight') > 0) {
                    return POSITIVE_COLOR
                  }
                }
                return NEUTRAL_COLOR
              },
              'target-arrow-color': function (ele: cytoscape.EdgeSingular) {
                if (ele.data('weight')) {
                  if (ele.data('weight') < 0) {
                    return NEGATIVE_COLOR
                  } else if (ele.data('weight') > 0) {
                    return POSITIVE_COLOR
                  }
                }
                return NEUTRAL_COLOR
              },
              'target-arrow-shape': 'triangle',
            },
          },
          {
            selector: 'edge:selected',
            style: {
              'line-color': SELECTED_COLOR,
              'target-arrow-color': SELECTED_COLOR,
            },
          },
        ],
        wheelSensitivity: 0.2,
        boxSelectionEnabled: false,
        selectionType: 'single',
      })
    }

    // notify the root element that the canvas was created
    this.dispatchEvent(
      new CustomEvent<CCanvas>('canvas-created', {
        detail: this,
        bubbles: true,
        composed: true,
      })
    )
  }

  async updated(changedProperties: Map<string, unknown>): Promise<void> {
    super.updated(changedProperties)
    await this.updateComplete
    if (!this.listenerActive) {
      this.listenerActive = true
      // add an event listener that updates the layer position when layer position
      // changes
      // Add event listener: when tapped on canvas, remove the current selection
      // and close the panels as well
      this.cy.on('tap', (e) => {
        if (e.target === this.cy) {
          this.dispatchEvent(
            new CustomEvent<unknown>('select', {
              detail: {},
              bubbles: true,
              composed: true,
            })
          )
          this.dispatchEvent(
            new CustomEvent<string[]>('close-panels', {
              detail: panelGroups['right'],
              bubbles: true,
              composed: true,
            })
          )
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
          console.log(evtTarget.selected())
          const cyNode = evtTarget

          if (cyNode.data('type') == 'layer') {
            const layer: CLayer = this.network.getLayerById(
              <number>cyNode.data('layer')
            )
            this.dispatchEvent(
              new CustomEvent<unknown>('select', {
                detail: { layer },
                bubbles: true,
                composed: true,
              })
            )
          } else if (cyNode.data('type') == 'neuron') {
            const layer: NeuronLayer = <NeuronLayer>(
              this.network.getLayerById(<number>cyNode.data('layer'))
            )
            const neuron: Neuron =
              layer._neurons[<number>cyNode.data('neuron') - 1]
            this.dispatchEvent(
              new CustomEvent<unknown>('select', {
                detail: { layer, neuron },
                bubbles: true,
                composed: true,
              })
            )
          }
        } else if (evtTarget.isEdge()) {
          const cyEdge = evtTarget
          const sourceLayer: CLayer = this.network.getLayerById(
            <number>cyEdge.source().data('layer')
          )
          let sourceNeuron: Neuron = null
          if (sourceLayer instanceof NeuronLayer) {
            sourceNeuron = Array.from(sourceLayer._neurons)[
              cyEdge.source().data('neuron') - 1
            ]
          }
          const targetLayer: CLayer = this.network.getLayerById(
            <number>cyEdge.target().data('layer')
          )
          let targetNeuron: Neuron = null
          if (targetLayer instanceof NeuronLayer) {
            targetNeuron = Array.from(targetLayer._neurons)[
              cyEdge.target().data('neuron') - 1
            ]
          }

          const edge: Edge = {
            sourceLayer: sourceLayer,
            sourceNeuron: sourceNeuron,
            targetLayer: targetLayer,
            targetNeuron: targetNeuron,
          }
          this.dispatchEvent(
            new CustomEvent<unknown>('select', {
              detail: { edge },
              bubbles: true,
              composed: true,
            })
          )
        }
      })
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.listenerActive = false
  }

  // -> MANIPULATION - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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

  // -> POSITIONING  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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

  toModelPosition(renderedPos: Position) {
    const pan = this.cy.pan()
    const zoom = this.cy.zoom()
    return {
      x: (renderedPos.x - pan.x) / zoom,
      y: (renderedPos.y - pan.y) / zoom,
    }
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = [
    globalStyles,
    css`
      #canvasElm {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
      }
    `,
  ]

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html` <div id="canvasElm"></div>`
  }
}
