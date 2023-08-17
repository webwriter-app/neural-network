import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { customElement, state, query } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

import * as cytoscape from 'cytoscape'

import { consume } from '@lit-labs/context'
import { networkContext } from '@/contexts/network_context'
import { panels } from '@/contexts/panels_context'

import type { Network } from '@/network/network'
import { InputLayer } from '@/network/input_layer'
import { DenseLayer } from '@/network/dense_layer'
import { OutputLayer } from '@/network/output_layer'
import type { Position } from '@/types/position'

import * as colorcolor from 'colorcolor'

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
      console.log(this.renderRoot)
      const MAIN_COLOR: string = <string>(
        colorcolor(
          getComputedStyle(this).getPropertyValue('--sl-color-primary-50')
        )
      )
      const TEXT_COLOR: string = <string>(
        colorcolor(
          getComputedStyle(this).getPropertyValue(
            '--sl-color-primary-950',
            'hex'
          )
        )
      )
      const ACCENT_COLOR: string = <string>(
        colorcolor(
          getComputedStyle(this).getPropertyValue('--sl-color-primary-500')
        )
      )
      const SELECTED_COLOR: string = <string>(
        colorcolor(
          getComputedStyle(this).getPropertyValue('--sl-color-primary-950')
        )
      )
      const POSITIVE_COLOR: string = <string>(
        colorcolor(
          getComputedStyle(this).getPropertyValue('--sl-color-success-200')
        )
      )
      const NEGATIVE_COLOR: string = <string>(
        colorcolor(
          getComputedStyle(this).getPropertyValue('--sl-color-danger-200')
        )
      )

      // create cytoscape canvas
      this.cy = cytoscape({
        container: this._canvasElm,
        elements: [],
        style: [
          {
            selector: 'node[type="layer"]',
            style: {
              shape: 'round-rectangle',
              'background-color': MAIN_COLOR,
              'border-color': ACCENT_COLOR,
              color: TEXT_COLOR,
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
              'border-width': 1,
              'background-opacity': 0,
              'border-color': MAIN_COLOR,
              padding: 0,
              label: 'data(label)',
              color: TEXT_COLOR,
              'text-halign': 'center',
              'text-valign': function (ele: cytoscape.NodeSingular) {
                return <'bottom' | 'top'>ele.data('textPos')
              },
              'text-margin-y': function (ele: cytoscape.NodeSingular) {
                if (ele.data('textPos') == 'top') {
                  return 30
                } else {
                  return -30
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
              'border-width': 5,
              'background-opacity': 0,
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
              color: TEXT_COLOR,
              label: 'data(label)',
            },
          },
          {
            selector: 'node[type="neuron"][wrapped="true"]',
            style: {
              width: '93px',
              height: '93px',
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
                if (
                  ele.data('weight') &&
                  isFinite(<number>ele.data('weight'))
                ) {
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
                return ACCENT_COLOR
              },
              'target-arrow-color': function (ele: cytoscape.EdgeSingular) {
                if (ele.data('weight')) {
                  if (ele.data('weight') < 0) {
                    return NEGATIVE_COLOR
                  } else if (ele.data('weight') > 0) {
                    return POSITIVE_COLOR
                  }
                }
                return ACCENT_COLOR
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
            new Event('unselect', {
              bubbles: true,
              composed: true,
            })
          )
          this.dispatchEvent(
            new CustomEvent<string[]>('close-panels', {
              detail: panels,
              bubbles: true,
              composed: true,
            })
          )
        }
      })

      // Add event listener for selection of layers or nodes
      this.cy.on('click', 'node, edge', (e: cytoscape.EventObject) => {
        const evtTarget = <cytoscape.SingularData>e.target

        // Prevent selection of multiple nodes by holding shift
        this.cy
          .elements()
          .not(<cytoscape.CollectionArgument>evtTarget)
          .unselect()

        if (evtTarget.isNode()) {
          const cyNode = evtTarget

          if (cyNode.data('type') == 'layer') {
            this.dispatchEvent(
              new CustomEvent<string>('select-layer', {
                detail: <string>cyNode.data('id'),
                bubbles: true,
                composed: true,
              })
            )
          } else if (cyNode.data('type') == 'neuron') {
            this.dispatchEvent(
              new CustomEvent<string>('select-neuron', {
                detail: <string>cyNode.data('id'),
                bubbles: true,
                composed: true,
              })
            )
          }
        } else if (evtTarget.isEdge()) {
          const cyEdge = evtTarget
          this.dispatchEvent(
            new CustomEvent<string>('select-edge', {
              detail: <string>cyEdge.data('id'),
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
  // fit the canvas to all elements with a specified padding
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

  // -> DROPPING LAYERS  - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  handleDrop(e: DragEvent) {
    this.dispatchEvent(
      new Event('drag-leaved', {
        bubbles: true,
        composed: true,
      })
    )
    const LAYER_TYPE: string = e.dataTransfer.getData('LAYER_TYPE')
    if (LAYER_TYPE && ['Input', 'Dense', 'Output'].includes(LAYER_TYPE)) {
      const renderedPos = {
        x: e.clientX,
        y: e.clientY,
      }
      const pos = this.toModelPosition(renderedPos)
      switch (LAYER_TYPE) {
        case 'Input':
          InputLayer.create({
            pos,
          })
          break
        case 'Dense':
          DenseLayer.create({
            pos,
          })
          break
        case 'Output':
          OutputLayer.create({
            pos,
          })
          break
      }
    }
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = [
    ...globalStyles,
    css`
      #canvasElm {
        height: 100%;
        width: 100%;
      }
    `,
  ]

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html` <div
      id="canvasElm"
      @dragenter="${(_e: DragEvent) =>
        this.dispatchEvent(
          new Event('drag-entered', {
            bubbles: true,
            composed: true,
          })
        )}"
      @dragover="${(e: DragEvent) => e.preventDefault()}"
      @dragleave="${(_e: DragEvent) =>
        this.dispatchEvent(
          new Event('drag-leaved', {
            bubbles: true,
            composed: true,
          })
        )}"
      @drop="${(e: DragEvent) => this.handleDrop(e)}"
    ></div>`
  }
}
