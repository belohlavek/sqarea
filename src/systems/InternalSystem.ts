import * as PIXI from 'pixi.js'
import { System, Entity } from 'src/core'
import { ShapeComponent, ComponentType } from 'src/components'

export abstract class InternalSystem extends System {
  protected app: PIXI.Application
  protected trackedEntities: Record<string, Entity> = {}

  protected abstract handleComponentAdded: (entity: Entity, componentType: ComponentType) => void
  protected abstract handleComponentRemoved: (entity: Entity, componentType: ComponentType) => void

  constructor(app: PIXI.Application) {
    super()
    this.app = app
  }

  systemDidMount() {
    this.engine.on('entity_added', this.addEntity)
    this.engine.on('entity_removed', this.removeEntity)
  }

  protected addEntity = (entity: Entity) => {
    if (this.trackedEntities[entity.uuid]) return

    const shape = entity.getComponent<ShapeComponent>('shape')

    // Only add qualified entities
    if (shape) {
      if (!this.app.stage.getChildByName(entity.uuid)) {
        const internal = new PIXI.Container()
        internal.name = entity.uuid
        this.app.stage.addChild(internal)
      }

      this.trackedEntities[entity.uuid] = entity
    }

    // Even if they have no Shape component now, they may have it in the future
    entity.on('component_added', this.handleComponentAdded)
    entity.on('component_removed', this.handleComponentRemoved)
  }

  protected removeEntity = (entity: Entity) => {
    const internal = this.app.stage.getChildByName(entity.uuid)

    if (internal) {
      // Race: the first system to run will be the first to clean up the internal reference
      this.app.stage.removeChild(internal)
    }

    if (delete this.trackedEntities[entity.uuid]) {
      entity.off('component_added', this.handleComponentAdded)
      entity.off('component_removed', this.handleComponentRemoved)
    }
  }
}
