import { Entity, engine } from 'src/core'
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
   * The order in which it will be executed by the engine
   */
  priority: number = Infinity

  /**
   * Array of ECS entity uuids
   */
  protected trackedEntities: string[] = []

  /**
   * Called every engine tick.
   * @param dt - time elapsed since the previous update
   */
  abstract update(dt: number)

  /**
   * @internal
   * Called after the System was added to the Engine
   */
  systemDidMount() {
    engine.on('entity_added', this.trackEntity)
    engine.on('entity_removed', this.untrackEntity)
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
    return engine.entities[uuid] || null
  }

  /**
   * Overwrite this method to provide custom rules for tracking only necessary entities
   * @param entity - The candidate entity
   */
  protected shouldTrackEntity(_: Entity): boolean {
    return true
  }

  // /**
  //  * Called after a child is added to a tracked entity
  //  * @param parent
  //  * @param child
  //  */
  // protected handleEntityChildAdded(parent: Entity, child: Entity) {
  //   const parentContainer = this.getEngineObject(parent)
  //   const childContainer = this.getEngineObject(child)
  //   parentContainer.addChild(childContainer)
  // }

  // /**
  //  * Called after a child is removed from a tracked entity
  //  * @param parent
  //  * @param child
  //  */
  // protected handleEntityChildRemoved(parent: Entity, child: Entity) {
  //   const parentContainer = this.getEngineObject(child)
  //   const childContainer = this.getEngineObject(parent)
  //   parentContainer.removeChild(childContainer)
  // }

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
}
