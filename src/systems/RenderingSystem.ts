import { Entity } from 'src/core'
import { ShapeComponent, ComponentType, ShapeKind, RectShape, CircleShape } from 'src/components'
import { renderRect, renderCircle } from 'src/renderers/renderShape'
import { PixiSystem } from './PixiSystem'

export class RenderingSystem extends PixiSystem {
  update(_: number) {
    for (let i = 0; i < this.trackedEntities.length; i++) {
      const uuid = this.trackedEntities[i]
      const entity = this.getEntityById(uuid)
      let shape

      if (entity) {
        shape = entity.getComponent<ShapeComponent>('shape')

        if (shape.isDirty) {
          const container = this.getPixiEntity(entity) // TODO: check type, this can be null

          if (container) {
            const kind = shape.getKind()

            if (kind === ShapeKind.RECT_SHAPE) {
              renderRect(container, shape as RectShape)
            } else if (kind === ShapeKind.CIRCLE_SHAPE) {
              renderCircle(container, shape as CircleShape)
            }

            shape.isDirty = false
          }
        }
      }
    }
  }

  protected shouldTrackEntity(entity: Entity): boolean {
    return !!entity.getComponent<ShapeComponent>('shape')
  }

  protected handleEntityCandidate = (entity: Entity) => {
    // Even if they have no Shape component now, they may have it in the future
    entity.on('component_added', this.handleComponentAdded)
    entity.on('component_removed', this.handleComponentRemoved)
  }

  protected handleEntityRemoved = (entity: Entity) => {
    const index = this.trackedEntities.indexOf(entity.uuid)
    this.trackedEntities = this.trackedEntities.splice(index, 1)
    entity.off('component_added', this.handleComponentAdded)
    entity.off('component_removed', this.handleComponentRemoved)
  }

  protected handleComponentAdded = (entity: Entity, componentType: ComponentType) => {
    if (componentType === 'shape') {
      this.trackEntity(entity)
    }
  }

  protected handleComponentRemoved = (entity: Entity, componentType: ComponentType) => {
    if (componentType === 'shape') {
      this.untrackEntity(entity)
    }
  }
}
