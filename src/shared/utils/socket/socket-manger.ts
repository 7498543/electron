import { useEventListener } from 'vueuse'

interface Options {
  emitField?: string
  emitDataField?: string
  onField?: string
  onDataField?: string
  heart?: boolean
  heartInterval?: number
  errorHandler?: (error: Event) => void
}

interface onOptions {
  onField?: string
  onDataField?: string
  mixin?: boolean
  errorHandler?: (error: Event) => void
}
interface emitOptions {
  emitField?: string
  emitDataField?: string
  errorHandler?: (error: Event) => void
}

const defaultOptions: Options = {
  emitField: 'type',
  emitDataField: 'data',
  onField: 'type',
  onDataField: 'data',
  heart: false,
  heartInterval: 30_000,
  errorHandler: (error: Event) => {}
}

class SocketManager {
  private socket: WebSocket | null = null
  private eventListeners: Map<string, Set<(...args: any[]) => void>> = new Map()
  private options: Options
  private errorHandler: (error: Event) => void

  constructor(url: string, options: Options) {
    this.options = { ...defaultOptions, ...options }
    this.errorHandler = this.options.errorHandler || (() => {})

    this.initSocket(url)
  }

  private initSocket(url: string) {
    this.socket = new WebSocket(url)

    this.socket.addEventListener('error', error => {
      this.errorHandler(error)
    })
  }

  public emit(event: string, options: emitOptions = {}, ...args: any[]) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const { emitField, emitDataField } = this.options
      const { emitField: emitFieldOption = emitField, emitDataField: emitDataFieldOption = emitDataField } = options

      this.socket.send(JSON.stringify({ [emitFieldOption as string]: event, [emitDataFieldOption as string]: args }))
    }
  }

  public on(event: string, callback: (...args: any[]) => void, options: onOptions = {}) {
    const { onField, onDataField } = this.options
    const {
      onField: onFieldOption = onField,
      onDataField: onDataFieldOption = onDataField,
      mixin = false
    } = { onField, onDataField, ...options }

    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set())
    }
    this.eventListeners.get(event)!.add(this.onWrapHandler(event, callback))
  }

  private onWrapHandler(event: string, callback: (...args: any[]) => void) {
    return (...args: any[]) => {
      callback(...args)
    }
  }

  destroy() {
    if (this.socket) this.socket?.close()
    this.eventListeners.clear()
  }
}

export { SocketManager }
