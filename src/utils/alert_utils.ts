
// The AlertUtils class provides a static method to spawn alerts
export class AlertUtils {
  // spawns an alert with the specified options, most important the message
  static spawn({
    message,
    variant = 'primary'
  }: {
    message: string
    variant?: 'primary' | 'success' | 'warning' | 'danger'
    icon?: string
    duration?: number
  }) {
    if(variant === "primary") {
      console.info(message)
    }
    else if(variant === "success") {
      console.info(message)
    }
    else if(variant === "warning") {
      console.warn(message)
    }
    else if(variant === "danger") {
      console.error(message)
    }
  }
}
