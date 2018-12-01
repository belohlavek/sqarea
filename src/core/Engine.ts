import { System, Entity } from 'src/core'
import { EventManager, EventCallback } from './EventManager'

/**
 * The Engine keeps track of all ECS-related entities and systems.
 * @fires entity_added
 * @fires entity_removed
 * @fires system_added
 * @fires system_removed
 */
export class Engine {
  systems: System[] = []
  entities: Record<string, Entity> = {}

  private eventManager: EventManager = new EventManager()
  private pool: Entity[] = []

  constructor() {
    // stub
  }

  /**
   * Adds a new System to the engine's update loop.
   * @param system - an instance of a System
   * @param priority - Sets the order of execution for the given System
   */
  addSystem(system: System, priority: number = system.priority) {
    if (this.systems.indexOf(system) !== -1) {
      console.log(`Engine: System "${system.uuid}" (${system.constructor.name}) is already added. Skipping...`)
      return
    }

    system.engine = this

    // Priorities can be set both when calling this method and when instancing the system
    if (priority !== system.priority) {
      system.priority = priority
    }

    if (this.systems.length > 0) {
      for (let i = 0; i < this.systems.length; i++) {
        const candidate = this.systems[i]
        const isLast = i === this.systems.length - 1

        if (candidate.priority > priority) {
          this.systems.splice(i, 0, system)
          break
        } else if (isLast) {
          this.systems.splice(i + 1, 0, system)
          break
        }
      }
    } else {
      this.systems.splice(1, 0, system)
    }

    system.systemDidMount()

    this.emit('system_added', system)

    return this
  }

  removeSystem(system: System) {
    const index = this.systems.indexOf(system)
    this.systems = this.systems.splice(index, 1)
    this.emit('system_removed', system)
    return this
  }

  addEntity(entity: Entity) {
    if (!this.entities[entity.uuid]) {
      entity.engine = this
      entity.enabled = true
      this.entities[entity.uuid] = entity
      this.emit('entity_added', entity)

      if (entity.children) {
        for (let i = 0; i < entity.children.length; i++) {
          const child = entity.children[i]
          if (!child.engine) {
            this.addEntity(child)
          }
        }
      }
    }
    return this
  }

  removeEntity(entity: Entity) {
    if (delete this.entities[entity.uuid]) {
      entity.enabled = false

      for (let child of Object.values(entity.children)) {
        this.removeEntity(child)
      }

      this.pool.push(entity)

      this.emit('entity_removed', entity)
    }

    return this
  }

  on(evt: string, cb: EventCallback) {
    return this.eventManager.on(evt, cb)
  }

  off(evt: string, cb: EventCallback) {
    this.eventManager.off(evt, cb)
  }

  // @internal
  update(dt: number) {
    for (let i = 0; i < this.systems.length; i++) {
      const system = this.systems[i]
      system.update(dt)
    }
  }

  /**
   * Returns a free entity from the internal entity pool
   */
  getAvailableEntity(): Entity | null {
    const ent = this.pool.shift()
    if (ent) {
      this.addEntity(ent)
      return ent
    }
    return null
  }

  private emit(evt: string, ...args: any[]) {
    this.eventManager.emit(evt, args)
  }
}

export const engine = new Engine()
