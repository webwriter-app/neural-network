// Adds a listener for a CustomEvent with a typed detail.
export function listen<Detail = undefined>(
  target: EventTarget,
  type: string,
  handler: (event: CustomEvent<Detail>) => void,
  signal?: AbortSignal
) {
  target.addEventListener(type, handler as EventListener, { signal })
}
