import * as PIXI from 'pixi.js'
import { Entity } from 'src/core'
import { ShapeComponent, ComponentType, ShapeKind, RectShape, CircleShape } from 'src/components'
import { renderRect, renderCircle } from 'src/renderers/renderShape'
import { PixiSystem } from './PixiSystem'

export class RenderingSystem extends PixiSystem {
  constructor(app: PIXI.Application) {
    super(app)
  }

  protected shouldTrackEntity(entity: Entity) {
    const shape = entity.getComponent<ShapeComponent>('shape')

    if (shape) {
      return true
    }

    return false
  }

  protected handleEntityCandidate = (entity: Entity) => {
    // Even if they have no Shape component now, they may have it in the future
    entity.on('component_added', this.handleComponentAdded)
    entity.on('component_removed', this.handleComponentRemoved)
  }

  protected handleEntityRemoved = (entity: Entity) => {
    if (delete this.trackedEntities[entity.uuid]) {
      entity.off('component_added', this.handleComponentAdded)
      entity.off('component_removed', this.handleComponentRemoved)
    }
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

  update(_: number) {
    for (let i = 0; i < this.trackedEntities.length; i++) {
      const uuid = this.trackedEntities[i]
      const entity = this.getEntityById(uuid)

      // TODO: dani no seas forro
      const shape = entity.getComponent<ShapeComponent>('shape')

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
