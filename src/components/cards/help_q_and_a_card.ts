import { LitElementWw } from '@webwriter/lit'
import { CSSResult, TemplateResult, html } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import { consume } from '@lit/context'

import { globalStyles } from '@/global_styles'

import { editableContext } from '@/contexts/editable_context'
import type { QAndAEntry } from '@/types/q_and_a_entry'
import { qAndAContext } from '@/contexts/q_and_a_context'

import type { SlInput } from '@shoelace-style/shoelace'

export @customElement('help-q-and-a-card') class HelpQAndACard extends LitElementWw {
  @consume({ context: editableContext, subscribe: true })
  accessor editable: boolean

  @consume({ context: qAndAContext, subscribe: true })
  accessor qAndA: QAndAEntry[]

  @query('#newEntryTitle')
  accessor _newEntryTitle: SlInput

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  addEntry(e: MouseEvent): void {
    e.preventDefault()
    const entry: QAndAEntry = {
      title: this._newEntryTitle.value,
      description: '',
    }
    this.dispatchEvent(
      new CustomEvent<QAndAEntry>('add-new-help-entry', {
        detail: entry,
        bubbles: true,
        composed: true,
      })
    )
    this._newEntryTitle.value = ''
  }

  updateEntry(e: MouseEvent): void {
    const entry: QAndAEntry = {
      title: <string>e.target.title,
      description: <string>e.target.parentNode.previousElementSibling.value,
    }
    this.dispatchEvent(
      new CustomEvent<QAndAEntry>('update-help-entry', {
        detail: entry,
        bubbles: true,
        composed: true,
      })
    )
  }

  removeEntry(e: MouseEvent): void {
    this.dispatchEvent(
      new CustomEvent<string>('remove-help-entry', {
        detail: <string>e.target.title,
        bubbles: true,
        composed: true,
      })
    )
  }

  // STYLES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  static styles: CSSResult = globalStyles

  // RENDER  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  render(): TemplateResult<1> {
    return html`
      <c-card>
        <div slot="title">Q & A</div>
        <div slot="content">
          ${!this.qAndA.length && this.editable
            ? html`There are currently no help entries. If you publish the
              widget like this, the help section will be hidden.`
            : html``}
          ${this.qAndA.map(
            (entry) => html` <sl-details summary=${entry.title}>
              ${this.editable
                ? html` <sl-textarea value=${entry.description}></sl-textarea>
                    <div class="button-group">
                      <sl-button
                        variant="primary"
                        title=${entry.title}
                        @click="${(e: MouseEvent) => this.updateEntry(e)}"
                      >
                        Update entry
                      </sl-button>
                    </div>
                    <div class="button-group">
                      <sl-button
                        variant="danger"
                        title=${entry.title}
                        @click="${(e: MouseEvent) => this.removeEntry(e)}"
                      >
                        Remove entry
                      </sl-button>
                    </div>`
                : html`${entry.description}`}
            </sl-details>`
          )}
          ${this.editable
            ? html` <form
                @submit="${(e: MouseEvent) => this.addEntry(e)}"
                id="test"
              >
                <div class="button-group">
                  <sl-input
                    form="test"
                    placeholder="Title"
                    required
                    minlength="5"
                    id="newEntryTitle"
                  ></sl-input>
                  <sl-button variant="primary" type="submit">
                    Add entry
                  </sl-button>
                </div>
              </form>`
            : html``}
        </div>
      </c-card>
    `
  }
}
