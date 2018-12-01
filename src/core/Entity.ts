import { Component } from './Component'
import { EventManager, EventCallback } from './EventManager'
import { ComponentType } from 'src/components/types'
import { uuid } from 'src/utils'
import { Engine } from './Engine'

/**
 * @fires component_added
 * @fires component_removed
 * @fires child_added
 * @fires child_removed
 */
export class Entity {
  // @internal
  readonly uuid: string = uuid()

  // @internal
  debugName: string = 'Unamed Entity'

  // @internal
  components: Record<string, Component> = {}

  // @internal
  engine: Engine | undefined

  enabled: boolean = false

  children: Entity[] = []

  private _parent: Entity | null = null

  private eventManager: EventManager = new EventManager()

  set parent(entity: Entity | null) {
    // TODO: prevent circular relationships
    if (entity === null) {
      this._parent = null
    } else {
      entity.addChild(this)
    }
  }

  get parent() {
    return this._parent
  }

  addComponent(component: Component) {
    this.components[component.type] = component
    this.emit('component_added', this, component.type)
    return this
  }

  removeComponent(type: ComponentType) {
    if (delete this.components[type]) {
      this.emit('component_removed', this, type)
    }
    return this
  }

  hasComponent(type: ComponentType) {
    return !!this.components[type]
  }

  getComponent<T extends Component>(type: ComponentType): T {
    return this.components[type] as T
  }

  addChild(entity: Entity) {
    // TODO: prevent circular relationships
    this.children.push(entity)
    entity._parent = this

    this.emit('child_added', this, entity)
  }

  removeChild(entity: Entity) {
    const index = this.children.indexOf(entity)

    if (index) {
      this.children.splice(index, 1)
      entity._parent = null

      this.emit('child_removed', this, entity)
    }
  }

  reset() {
    for (let component of Object.values(this.components)) {
      this.removeComponent(component.type)
    }

    for (let i = 0; i < this.children.length; i++) {
      this.removeChild(this.children[i])
    }
  }

  on(evt: string, cb: EventCallback) {
    return this.eventManager.on(evt, cb)
  }

  off(evt: string, cb: EventCallback) {
    this.eventManager.off(evt, cb)
  }

  private emit(evt: string, ...args: any[]) {
    this.eventManager.emit(evt, args)
  }
}
