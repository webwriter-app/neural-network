import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import { globalStyles } from '@/global_styles'

export @customElement('help-about-card') class HelpAboutCard extends LitElementWw {
  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult[] = [
    globalStyles,
    css`
      .developerSlDetails::part(content) {
        margin: 0;
        padding: 0;
        height: 700px;
      }

      iframe {
        width: 100%;
        height: 100%;
      }
    `,
  ]

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">About this app</div>
        <div slot="content">
          <p>
            This app was developed by Christian Koch, a student at RWTH Aachen
            University, with support of Frederic Salmen and the chair i9 at RWTH
            Aachen University.
          </p>
          <sl-details summary="About the developer" class="developerSlDetails">
            <iframe
              src="https://christian-koch.eu"
              title="Christian Koch"
              frameborder="0"
            ></iframe>
          </sl-details>
          <sl-details summary="License">
            <object style="width: 100%;" data="/assets/LICENSE.txt"></object>
          </sl-details>
          <sl-details summary="Third-party licenses">
            <object
              style="width: 100%;"
              data="/assets/THIRDPARTYLICENSES.txt"
            ></object>
          </sl-details>
          <sl-details summary="Third-party data sets">
            <p>
              All third-party data sets have been published under public domain
            </p>
          </sl-details>
        </div>
      </c-card>
    `
  }
}
