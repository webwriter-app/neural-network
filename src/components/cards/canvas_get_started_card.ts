import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'
import { FileConfig } from '@/types/file_config'
import { spawnAlert } from '@/utils/alerts'

@customElement('canvas-get-started-card')
export class GetStartedActions extends LitElementWw {
  async _handleImport() {
    const [handle] = await window.showOpenFilePicker({
      types: [
        {
          description: 'JSON',
          accept: { 'application/json': ['.json'] },
        },
      ],
    })
    const file = await handle.getFile()
    let config: FileConfig
    try {
      const text = await file.text()
      const fileConfig: FileConfig = await JSON.parse(text)
      switch (fileConfig.version) {
        case 1:
          if (
            !(
              Object.hasOwn(fileConfig, 'dataSet') &&
              Object.hasOwn(fileConfig, 'layerConfs') &&
              Object.hasOwn(fileConfig, 'layerConnectionConfs') &&
              Object.hasOwn(fileConfig, 'trainOptions')
            )
          ) {
            throw new Error(
              'The version of the config file is not compatible with the widget version you currently use!'
            )
          }
          config = {
            version: 1,
            dataSet: fileConfig.dataSet,
            layerConfs: fileConfig.layerConfs,
            layerConnectionConfs: fileConfig.layerConnectionConfs,
            trainOptions: fileConfig.trainOptions,
          }
          break
        default:
          throw new Error(
            'The version of the config file is not compatible with the widget version you currently use!'
          )
      }
    } catch (err: unknown) {
      const error = err as Error
      spawnAlert({
        message: error.message,
        variant: 'danger',
        icon: 'x-circle',
      })
    }
    if (config) {
      // notify the root element that the canvas was created
      this.dispatchEvent(
        new CustomEvent<FileConfig>('config-imported', {
          detail: config,
          bubbles: true,
          composed: true,
        })
      )
    }
  }

  static styles: CSSResult[] = [
    globalStyles,
    css`
      #getStartedGrid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 10px;
      }
    `,
  ]

  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Get started</div>
        <div slot="content">
          <sl-button
            @click="${(_e: MouseEvent) => {
              this._handleImport()
            }}"
          >
            <sl-icon slot="prefix" name="file-earmark-arrow-up"></sl-icon>
            Import
          </sl-button>
          <div id="getStartedGrid">
            <c-card>
              <div slot="title">Simple title</div>
              <div slot="content">
                <c-tag-group>
                  <sl-tag variant="success">Beginner</sl-tag>
                  <sl-tag variant="neutral">Regression</sl-tag>
                  <sl-tag variant="neutral">Feed Forward</sl-tag>
                </c-tag-group>
                <c-button-group>
                  <sl-button>Create</sl-button>
                </c-button-group>
              </div>
            </c-card>
            <c-card>
              <div slot="title">Pima Indians FF</div>
              <div slot="content">
                <c-tag-group>
                  <sl-tag variant="warning">Intermediate</sl-tag>
                  <sl-tag variant="neutral">Classification</sl-tag>
                  <sl-tag variant="neutral">Feed Forward</sl-tag>
                </c-tag-group>
                <c-button-group>
                  <sl-button>Create</sl-button>
                </c-button-group>
              </div>
            </c-card>
            <c-card>
              <div slot="title">Boston House Pricing FF</div>
              <div slot="content">
                <c-tag-group>
                  <sl-tag variant="danger">Expert</sl-tag>
                  <sl-tag variant="neutral">Regression</sl-tag>
                  <sl-tag variant="neutral">Feed Forward</sl-tag>
                </c-tag-group>
                <c-button-group>
                  <sl-button>Create</sl-button>
                </c-button-group>
              </div>
            </c-card>
          </div>
        </div>
      </c-card>
    `
  }
}
