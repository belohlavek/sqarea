import { System, Entity } from 'src/core'
import { EventManager, EventCallback } from './EventManager'

/**
 * The Engine keeps track of all ECS-related entities and systems.
 * It a singleton and should only be lazily instanced via the GetInstance() method.
 * @fires entity_added
 * @fires entity_removed
 * @fires system_added
 * @fires system_removed
 */
export class Engine {
  systems: Record<string, System> = {}
  entities: Record<string, Entity> = {}
  engineObjects: Record<string, PIXI.Container> = {}
  app: PIXI.Application

  private static Instance: Engine
  private eventManager: EventManager = new EventManager()
  private pool: Entity[] = []

  static GetInstance(): Engine {
    if (!Engine.Instance) {
      Engine.Instance = new Engine()
    }
    return Engine.Instance
  }

  private constructor() {}

  addSystem(system: System) {
    if (!this.systems[system.uuid]) {
      system.engine = this
      this.systems[system.uuid] = system
      system.systemDidMount()
      this.emit('system_added', system)
    }
    return this
  }

  removeSystem(system: System) {
    if (delete this.systems[system.uuid]) {
      this.emit('system_removed', system)
    }

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
    for (let system of Object.values(this.systems)) {
      system.update(dt)
    }
  }

  /**
   * Returns a free entity from the internal entity pool
   */
  getAvailableEntity() {
    const ent = this.pool.pop()
    this.addEntity(ent)
    return ent
  }

  private emit(evt: string, ...args: any[]) {
    this.eventManager.emit(evt, args)
  }
}
