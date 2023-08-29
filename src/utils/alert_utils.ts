function escapeHtml(html: string) {
  const div: HTMLDivElement = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}

export class AlertUtils {
  static spawn({
    message,
    variant = 'primary',
    icon = 'info-circle',
    duration = 7000,
  }: {
    message: string
    variant?: string
    icon?: string
    duration?: number
  }) {
    const alert = Object.assign(document.createElement('sl-alert'), {
      variant,
      closable: true,
      duration: duration,
      innerHTML: `
        <sl-icon name="${icon}" slot="icon"></sl-icon>
        ${escapeHtml(message)}
    `,
    })

    document.body.append(alert)
    void alert.toast()
  }
}
