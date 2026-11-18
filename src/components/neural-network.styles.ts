import { css } from 'lit'

// Layout of the widget host: canvas area, menu area, divider and loading page.
export const neuralNetworkStyles = css`
  :host {
    position: relative;
    display: flex!important;
    overflow: hidden;
    box-sizing: border-box;
    background-color: var(--sl-color-neutral-0);
    color: var(--ww-text-color, inherit);
    font-family: var(--ww-font-family, var(--sl-font-sans));
    height: 500px;
    min-width: 300px;
    max-width: min(100%, 2100px);
    min-height: 420px;
    container-type: inline-size;
  }

  :host(:fullscreen), :host(.ww-fullscreen) {
    height: 100%;
    width: 100%;
    max-width: none;
  }

  :host(:not(:fullscreen):not(.ww-fullscreen)) {
    border: 1px solid var(--sl-color-neutral-300, #d4d4d8);
    border-radius: var(--sl-border-radius-medium, 0.375rem);
  }


  #shell {
    position: relative;
    display: flex;
    flex-direction: row;
    flex: 1 1 0;
    min-width: 0;
    height: 100%;
  }

  #loadingPage {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: var(--sl-color-neutral-0);
  }

  #loadingDiv {
    position: absolute;
    left: 50%;
    top: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  canvas-area {
    flex: 1 1 0;
    min-width: 0;
    height: 100%;
  }

  menu-area {
    flex: 0 1 435px;
    min-width: 0;
    overflow: hidden;
  }

  menu-area.right-collapsed {
    flex-basis: 0;
    visibility: hidden;
  }

  #divider {
    flex: 0 0 2px;
    align-self: stretch;
    margin: 10px 0;
    background-color: var(--sl-color-neutral-50);
  }

  #divider.hidden {
    display: none;
  }

  /* below this width the menu moves under the canvas */
  @container (max-width: 639px) {
    #shell {
      flex-direction: column;
    }

    canvas-area {
      flex: 1 1 0;
      min-height: 0;
      height: auto;
      width: 100%;
    }

    menu-area {
      flex: 0 0 55%;
      max-width: none;
      min-height: 0;
    }

    menu-area.right-collapsed {
      flex-basis: 0;
    }

    #divider {
      flex: 0 0 2px;
      margin: 0 10px;
    }
  }

  @media print {
    :host {
      min-height: 0;
      break-inside: avoid;
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }

    menu-area, #divider, #loadingPage {
      display: none;
    }
  }
`
