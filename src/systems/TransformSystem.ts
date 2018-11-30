import * as PIXI from 'pixi.js'
import { Entity } from 'src/core'
import { Transform, ComponentType } from 'src/components'
import { PixiSystem } from './PixiSystem'

export class TransformSystem extends PixiSystem {
  protected shouldTrackEntity(entity: Entity) {
    const transform = entity.getComponent<Transform>('transform')

    if (transform) {
      return true
    }

    return false
  }

  protected handleComponentAdded = (entity: Entity, componentType: ComponentType) => {
    if (componentType === 'transform') {
      this.trackEntity(entity)
    }
  }

  protected handleComponentRemoved = (entity: Entity, componentType: ComponentType) => {
    if (componentType === 'transform') {
      this.untrackEntity(entity)
    }
  }

  update(_: number) {
    for (let i = 0; i < this.trackedEntities.length; i++) {
      const uuid = this.trackedEntities[i]
      const entity = this.getEntityById(uuid)
      const transform = entity.getComponent<Transform>('transform')

      if (transform.isDirty) {
        const container = this.getPixiEntity(entity)

        if (container) {
          transform.updateContainer(container, new PIXI.Graphics())
          transform.isDirty = false
        }
      }
    }
  }
}
