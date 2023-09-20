import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit-labs/context'

import { globalStyles } from '@/global_styles'

import { editableContext } from '@/contexts/editable_context'
import type { Settings } from '@/types/settings'
import { settingsContext } from '@/contexts/settings_context'

import { FileConfig } from '@/types/file_config'

@customElement('start-get-started-card')
export class GetStartedCard extends LitElementWw {
  @consume({ context: editableContext, subscribe: true })
  editable: boolean

  @consume({ context: settingsContext, subscribe: true })
  settings: Settings

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  handleCustomImport() {
    this.dispatchEvent(
      new Event('initiate-import', {
        bubbles: true,
        composed: true,
      })
    )
  }

  async handleDefaultImport(url: string) {
    let configJSON: Response
    try {
      configJSON = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      })
    } catch (err) {
      console.error(err)
    }
    const config = <FileConfig>await configJSON.json()
    this.dispatchEvent(
      new CustomEvent('import-config', {
        detail: config,
        bubbles: true,
        composed: true,
      })
    )
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Get started</div>
        <div slot="content">
          <sl-button
            @click="${(_e: MouseEvent) => {
              void this.handleCustomImport()
            }}"
          >
            <sl-icon slot="prefix" name="file-earmark-arrow-up"></sl-icon>
            Import
          </sl-button>
          ${this.editable || this.settings.showDefaultConfs
            ? html` <div id="getStartedGrid">
                <c-card>
                  <div slot="title">Pima Indians</div>
                  <div slot="content">
                    <div class="tag-group">
                      <sl-tag variant="warning">Intermediate</sl-tag>
                      <sl-tag variant="neutral">Classification</sl-tag>
                      <sl-tag variant="neutral">Feed Forward</sl-tag>
                    </div>
                    <sl-button
                      @click=${(_e: MouseEvent) =>
                        this.handleDefaultImport(
                          '/assets/pimaIndiansConfig.json'
                        )}
                      >Create</sl-button
                    >
                  </div>
                </c-card>
                <c-card>
                  <div slot="title">Boston House Pricing</div>
                  <div slot="content">
                    <div class="tag-group">
                      <sl-tag variant="warning">Intermediate</sl-tag>
                      <sl-tag variant="neutral">Regression</sl-tag>
                      <sl-tag variant="neutral">Feed Forward</sl-tag>
                    </div>
                    <sl-button
                      @click=${(_e: MouseEvent) =>
                        this.handleDefaultImport('/assets/bostonConfig.json')}
                      >Create</sl-button
                    >
                  </div>
                </c-card>
              </div>`
            : html``}
          ${this.editable || this.settings.mayAddAndRemoveLayers
            ? html`<p>
                You can create a custom configuration by using the options in
                the corresponding right panels.
              </p>`
            : html``}
        </div>
      </c-card>
    `
  }
}
