import { Entity, Engine } from 'src/core'
import { ComponentType } from 'src/components'
import { uuid } from 'src/utils'

function noop() {
  // This method allows the creation of protected, optional lamdba-property handlers
}

export abstract class System {
  /**
   * @internal
   */
  uuid: string = uuid()

  /**
   * @internal
   */
  engine: Engine | undefined

  /**
   * The order in which it will be executed by the engine
   */
  priority: number = Infinity

  /**
   * Array of ECS entity uuids
   */
  protected trackedEntities: string[] = []

  /**
   * Called before shouldAddEntity()
   */
  protected handleEntityCandidate: (entity: Entity) => void = noop

  /**
   * Called after an entity was tracked by the system
   */
  protected handleEntityAdded: (entity: Entity) => void = noop

  /**
   * Called after an entity was removed from the system
   */
  protected handleEntityRemoved: (entity: Entity) => void = noop

  /**
   * Called after a component was added to an engine entity
   */
  protected handleComponentAdded: (entity: Entity, componentType: ComponentType) => void = noop

  /**
   * Called after a component was removed from an engine entity
   */
  protected handleComponentRemoved: (entity: Entity, componentType: ComponentType) => void = noop

  /**
   * Called every engine tick.
   * @param dt - time elapsed since the previous update
   */
  abstract update(dt: number): void

  /**
   * @internal
   * Called after the System was added to the Engine
   */
  systemDidMount() {
    if (this.engine) {
      this.engine.on('entity_added', this.trackEntity)
      this.engine.on('entity_removed', this.untrackEntity)
    }
  }

  /**
   * Adds an entity to this system's tracking scope
   */
  trackEntity = (entity: Entity) => {
    if (this.trackedEntities.indexOf(entity.uuid) > -1) return

    this.handleEntityCandidate(entity)

    if (this.shouldTrackEntity(entity)) {
      this.trackedEntities.push(entity.uuid)
      this.handleEntityAdded(entity)
    }
  }

  /**
   * Removes an entity from this system's tracking scope
   */
  untrackEntity = (entity: Entity) => {
    this.handleEntityRemoved(entity)
  }

  /**
   * Returns a reference to an Entity stored in the Engine
   */
  protected getEntityById(uuid: string): Entity | null {
    // TODO: maybe get with <T> ?
    let entity: Entity | null = null
    if (this.engine) {
      entity = this.engine.entities[uuid] || null
    }
    return entity
  }

  /**
   * Overwrite this method to provide custom rules for tracking only necessary entities
   * @param entity - The candidate entity
   */
  protected shouldTrackEntity(_: Entity): boolean {
    return true
  }
}
