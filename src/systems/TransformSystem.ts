import { Entity } from 'src/core'
import { Transform, ComponentType } from 'src/components'
import { PixiSystem } from './PixiSystem'
import { renderTransform } from 'src/renderers/renderTransform'

export class TransformSystem extends PixiSystem {
  update(_: number) {
    for (let i = 0; i < this.trackedEntities.length; i++) {
      const uuid = this.trackedEntities[i]
      const entity = this.getEntityById(uuid)

      if (entity) {
        const transform = entity.getComponent<Transform>('transform')

        if (transform.isDirty) {
          const container = this.getPixiEntity(entity)

          if (container) {
            renderTransform(container, transform)
            transform.isDirty = false
          }
        }
      }
    }
  }

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
}
