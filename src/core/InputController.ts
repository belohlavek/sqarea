export enum Key {
  W = 'W',
  A = 'A',
  S = 'S',
  D = 'D',
  LEFT = 'LEFT',
  DOWN = 'DOWN',
  RIGHT = 'RIGHT',
  UP = 'UP',
  SPACE = 'SPACE',
  NONE = 'NONE'
}
const KeyCode = {
  87: Key.W,
  65: Key.A,
  83: Key.S,
  68: Key.D,
  40: Key.DOWN,
  38: Key.UP,
  37: Key.LEFT,
  39: Key.RIGHT,
  32: Key.SPACE
}

export type KeyState = Record<Key, boolean>

export class InputController {
  private static Instance: InputController

  keyState: KeyState = Object.values(Key).reduce(
    (keyState, key) => ({
      ...keyState,
      [key]: false
    }),
    {}
  )
  isListening: boolean = false

  private constructor() {}

  static GetInstance() {
    if (!InputController.Instance) {
      InputController.Instance = new InputController()
    }
    return InputController.Instance
  }

  startListening() {
    if (this.isListening) return

    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)

    this.isListening = true
  }

  stopListening() {
    if (!this.isListening) return

    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)

    this.isListening = false
  }

  onKeyDown = evt => {
    const key = this.getKeyFromKeyCode(evt.which)
    this.keyState[key] = true
  }

  onKeyUp = evt => {
    const key = this.getKeyFromKeyCode(evt.which)
    this.keyState[key] = false
  }

  isAnyDown(keys: Key[]) {
    return keys.some(this.isDown)
  }

  isDown = (key: Key) => {
    return this.keyState[key]
  }

  getKeyFromKeyCode(keyCode: number) {
    return KeyCode[keyCode] || Key.NONE
  }
}
