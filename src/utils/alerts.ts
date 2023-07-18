// Always escape HTML for text arguments!
function escapeHtml(html: string) {
  const div: HTMLDivElement = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}

// Custom function to emit toast notifications
export function spawnAlert({
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
