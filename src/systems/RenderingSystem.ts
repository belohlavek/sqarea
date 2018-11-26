import * as PIXI from 'pixi.js'
import { Entity } from 'src/core'
import { ShapeComponent, ComponentType } from 'src/components'
import { InternalSystem } from './InternalSystem'

export class RenderingSystem extends InternalSystem {
  constructor(app: PIXI.Application) {
    super(app)
  }

  update(_: number) {
    for (let entity of Object.values(this.trackedEntities)) {
      const shape = entity.getComponent<ShapeComponent>('shape')

      if (shape.isDirty) {
        const container = this.app.stage.getChildByName(entity.uuid) as PIXI.Container
        const graphics = this.getContainerGraphics(container)
        shape.updateContainer(container, graphics)
        shape.isDirty = false
      }
    }
  }

  protected handleComponentAdded = (entity: Entity, componentType: ComponentType) => {
    if (componentType === 'shape') {
      this.addEntity(entity)
    }
  }

  protected handleComponentRemoved = (entity: Entity, componentType: ComponentType) => {
    if (componentType === 'shape') {
      this.removeEntity(entity)
    }
  }

  private getContainerGraphics(container: PIXI.Container): PIXI.Graphics {
    let ref: PIXI.DisplayObject = container.children[0]
    let graphics: PIXI.Graphics

    if (!ref || (ref && !ref['isGraphic'])) {
      graphics = new PIXI.Graphics()
      graphics['isGraphic'] = true // faster than instanceof

      if (ref) {
        container.removeChildAt(0)
      }

      container.addChild(graphics)
    } else {
      // reuse graphics instance
      graphics = ref as PIXI.Graphics
      graphics.clear()
    }
    return graphics
  }
}
