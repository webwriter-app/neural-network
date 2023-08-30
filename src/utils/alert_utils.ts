function escapeHtml(html: string) {
  const div: HTMLDivElement = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}

// The AlertUtils class provides a static method to spawn alerts
export class AlertUtils {
  // spawns an alert with the specified options, most important the message
  static spawn({
    message,
    variant = 'primary',
    icon = 'info-circle',
    duration = 7000,
  }: {
    message: string
    variant?: 'primary' | 'success' | 'warning' | 'danger'
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

    void alert.toast()
  }
}
