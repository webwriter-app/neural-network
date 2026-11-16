import { widgetMsg } from '@webwriter/lit/localize'
import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { globalStyles } from '../global-styles'

import { editableContext } from '../contexts'
import type { Settings } from '../../model/app-types'
import { settingsContext } from '../contexts'

import { FileConfig } from '../../model/data-types'
import { CCard } from '../reusables/c-card'

import SlTag from '@shoelace-style/shoelace/dist/components/tag/tag.component.js'
import SlButton from '@shoelace-style/shoelace/dist/components/button/button.component.js'
import IconFileEarmarkArrowUp from '@tabler/icons/outline/file-upload.svg'

export class GetStartedCard extends LitElementWw {
  private readonly msg = widgetMsg(this);
  static scopedElements = {
    'c-card': CCard,
    'sl-button': SlButton,
    'sl-tag': SlTag,
  }

  @consume({ context: editableContext, subscribe: true })
  accessor editable: boolean = false

  @consume({ context: settingsContext, subscribe: true })
  accessor settings: Settings

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  handleCustomImport() {
    this.dispatchEvent(
      new Event('initiate-import', {
        bubbles: true,
        composed: true,
      }),
    )
  }

  async handleDefaultImport(key: string) {
    let config: FileConfig | undefined
    if (key === 'boston') {
      config = (await import('../../assets/boston-config.json')).default as FileConfig
    } else if (key === 'pima') {
      config = (await import('../../assets/pima-indians-config.json')).default as FileConfig
    }
    this.dispatchEvent(
      new CustomEvent('import-config', {
        detail: config,
        bubbles: true,
        composed: true,
      }),
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
        <div slot="title">${this.msg('Get started')}</div>
        <div slot="content">
          <sl-button
            @click="${(_e: MouseEvent) => {
              void this.handleCustomImport()
            }}"
          >
            <sl-icon slot="prefix" src=${IconFileEarmarkArrowUp}></sl-icon>
            ${this.msg('Import JSON configuration')}
          </sl-button>
          ${this.editable || this.settings.showDefaultConfs
            ? html` <div id="getStartedGrid">
                <c-card>
                  <div slot="title">${this.msg('Pima Indians Diabetes')}</div>
                  <div slot="content">
                    <div class="tag-group">
                      <sl-tag variant="warning">${this.msg('Intermediate')}</sl-tag>
                      <sl-tag variant="neutral"
                        >${this.msg('Classification')}</sl-tag
                      >
                      <sl-tag variant="neutral">${this.msg('Feed Forward')}</sl-tag>
                    </div>
                    <sl-button
                      @click=${(_e: MouseEvent) =>
                        this.handleDefaultImport('pima')}
                      >${this.msg('Create')}</sl-button
                    >
                  </div>
                </c-card>
                <c-card>
                  <div slot="title">${this.msg('Boston House Pricing')}</div>
                  <div slot="content">
                    <div class="tag-group">
                      <sl-tag variant="warning">${this.msg('Intermediate')}</sl-tag>
                      <sl-tag variant="neutral">${this.msg('Regression')}</sl-tag>
                      <sl-tag variant="neutral">${this.msg('Feed Forward')}</sl-tag>
                    </div>
                    <sl-button
                      @click=${(_e: MouseEvent) =>
                        this.handleDefaultImport('boston')}
                      >${this.msg('Create')}</sl-button
                    >
                  </div>
                </c-card>
              </div>`
            : html``}
          ${this.editable || this.settings.mayAddAndRemoveLayers
            ? html`<p>
                ${this.msg(
                  'You can create a custom configuration by using the options in the corresponding right panels.',
                )}
              </p>`
            : html``}
        </div>
      </c-card>
    `
  }
}
