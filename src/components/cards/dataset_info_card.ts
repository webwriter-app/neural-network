import { LitElementWw } from "@webwriter/lit"
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('dataset-info-card')
class DatasetInfoCard extends LitElementWw {

    render(){
        return html`
            <c-card>
                <div slot="title">
                    Info
                </div>
                <div slot="content">
                    <span>Name: </span>
                    <span>Problem type: Classification</span>
                    <span>Sample data</span>
                    <span>some sample data</span>
                </div>
            </c-card>
        `;
    }
}