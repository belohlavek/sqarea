import * as PIXI from 'pixi.js'
import { Entity } from 'src/core'
import { Transform, ComponentType } from 'src/components'
import { InternalSystem } from './InternalSystem'

export class TransformSystem extends InternalSystem {
  constructor(app: PIXI.Application) {
    super(app)
  }

  update(_: number) {
    for (let entity of Object.values(this.trackedEntities)) {
      const transform = entity.getComponent<Transform>('transform')

      if (transform.isDirty) {
        const container = this.app.stage.getChildByName(entity.uuid) as PIXI.Container
        transform.updateContainer(container, new PIXI.Graphics())
        transform.isDirty = false
      }
    }
  }

  protected handleComponentAdded = (entity: Entity, componentType: ComponentType) => {
    if (componentType === 'transform') {
      this.addEntity(entity)
    }
  }

  protected handleComponentRemoved = (entity: Entity, componentType: ComponentType) => {
    if (componentType === 'transform') {
      this.removeEntity(entity)
    }
  }
}
