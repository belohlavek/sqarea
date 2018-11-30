import { ComponentType } from 'src/components'
import { uuid } from 'src/utils'

const GET_HASH_METHOD = 'getHash'

export type HashableObject = { [GET_HASH_METHOD](): string }

export type ComponentAttributeEntry = string | number | null | HashableObject

export type ComponentAttributes = Record<string, ComponentAttributeEntry>

export abstract class Component<T extends ComponentAttributes = any> {
  attributes: T

  // @internal
  uuid: string = uuid()

  // @internal
  readonly type: ComponentType

  // @internal
  protected readonly _attributes: T = {} as any

  // @internal
  private _isDirty: boolean = true

  // @internal
  private cache: Record<string, string> = {}

  constructor(type: ComponentType, attributes: T) {
    const self = this
    this.type = type
    this._attributes = attributes
    this.attributes = new Proxy(this._attributes, {
      get(target: T, prop: string) {
        return target[prop]
      },
      set(target: T, prop: keyof T, value: T[keyof T]) {
        target[prop] = value
        self.isDirty = true
        return true
      }
    })
  }

  set isDirty(flag: boolean) {
    // TODO (telemetry): track dirty flags
    this._isDirty = flag
  }

  get isDirty(): boolean {
    // Dirty until set otherwise
    if (this._isDirty) return true

    // Lazy: check nested structures
    for (let key in this._attributes) {
      const field = this._attributes[key] as ComponentAttributeEntry

      // Scalar types will mark the component as dirty when individually set
      if (typeof field !== 'number' && typeof field !== 'string' && field !== null) {
        if (GET_HASH_METHOD in field) {
          // TODO: are strings the best serialization solution?
          const val = field.getHash()
          const oldCache = this.cache[key]

          // Track changes in cache
          this.cache[key] = val

          // Fast return once a dirty member is found
          if (oldCache && oldCache !== val) {
            this._isDirty = true
            return true
          }
        } else {
          throw new Error(
            `Component "${this.uuid}" (${this.type}) contains an unsupported data structure of type "${
              field.constructor ? field.constructor.name : typeof field
            }"`
          )
        }
      }
    }

    return false
  }

  reset() {
    this.isDirty = false
    this.cache = {}
  }
}
