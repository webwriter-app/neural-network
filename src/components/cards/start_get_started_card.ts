import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import { editableContext } from '@/contexts/editable_context'
import { settingsContext, Settings } from '@/contexts/settings_context'

import { FileConfig } from '@/types/file_config'
import { FileConfigV1 } from '@/types/file_config_v1'
import { spawnAlert } from '@/utils/alerts'

@customElement('start-get-started-card')
export class GetStartedCard extends LitElementWw {
  @consume({ context: editableContext, subscribe: true })
  editable: boolean

  @consume({ context: settingsContext, subscribe: true })
  settings: Settings

  async handleImport() {
    const [handle] = await window.showOpenFilePicker({
      types: [
        {
          description: 'JSON',
          accept: { 'application/json': ['.json'] },
        },
      ],
    })
    const file = await handle.getFile()
    try {
      const text = await file.text()
      let fileConfig: FileConfig = await JSON.parse(text)
      switch (fileConfig.version) {
        case 1: {
          if (
            !(
              Object.hasOwn(fileConfig, 'settings') &&
              Object.hasOwn(fileConfig, 'help') &&
              Object.hasOwn(fileConfig, 'availableDataSets') &&
              Object.hasOwn(fileConfig, 'dataSet') &&
              Object.hasOwn(fileConfig, 'layerConfs') &&
              Object.hasOwn(fileConfig, 'layerConnectionConfs') &&
              Object.hasOwn(fileConfig, 'trainOptions')
            )
          ) {
            throw new Error('The config you imported seems to be broken :(')
          }
          const config: FileConfigV1 = {
            version: 1,
            settings: fileConfig.settings,
            help: fileConfig.help,
            availableDataSets: fileConfig.availableDataSets,
            dataSet: fileConfig.dataSet,
            layerConfs: fileConfig.layerConfs,
            layerConnectionConfs: fileConfig.layerConnectionConfs,
            trainOptions: fileConfig.trainOptions,
          }
          this.dispatchEvent(
            new CustomEvent<FileConfigV1>('import-config', {
              detail: config,
              bubbles: true,
              composed: true,
            })
          )
          break
        }
        default: {
          throw new Error(
            'The version of the config file is not compatible with the widget version you currently use!'
          )
        }
      }
    } catch (err: unknown) {
      const error = err as Error
      spawnAlert({
        message: error.message,
        variant: 'danger',
        icon: 'x-circle',
      })
    }
  }

  static styles: CSSResult[] = [
    ...globalStyles,
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
              void this.handleImport()
            }}"
          >
            <sl-icon slot="prefix" name="file-earmark-arrow-up"></sl-icon>
            Import
          </sl-button>
          ${this.editable || this.settings.showDefaultConfs
            ? html` <div id="getStartedGrid">
                <c-card>
                  <div slot="title">Simple title</div>
                  <div slot="content">
                    <div class="tag-group">
                      <sl-tag variant="success">Beginner</sl-tag>
                      <sl-tag variant="neutral">Regression</sl-tag>
                      <sl-tag variant="neutral">Feed Forward</sl-tag>
                    </div>
                    <div class="button-group">
                      <sl-button>Create</sl-button>
                    </div>
                  </div>
                </c-card>
                <c-card>
                  <div slot="title">Pima Indians FF</div>
                  <div slot="content">
                    <div class="tag-group">
                      <sl-tag variant="warning">Intermediate</sl-tag>
                      <sl-tag variant="neutral">Classification</sl-tag>
                      <sl-tag variant="neutral">Feed Forward</sl-tag>
                    </div>
                    <div class="button-group">
                      <sl-button>Create</sl-button>
                    </div>
                  </div>
                </c-card>
                <c-card>
                  <div slot="title">Boston House Pricing FF</div>
                  <div slot="content">
                    <div class="tag-group">
                      <sl-tag variant="danger">Expert</sl-tag>
                      <sl-tag variant="neutral">Regression</sl-tag>
                      <sl-tag variant="neutral">Feed Forward</sl-tag>
                    </div>
                    <div class="button-group">
                      <sl-button>Create</sl-button>
                    </div>
                  </div>
                </c-card>
              </div>`
            : html``}
        </div>
      </c-card>
    `
  }
}
