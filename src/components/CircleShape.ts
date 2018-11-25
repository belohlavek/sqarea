import { ShapeComponent } from './ShapeComponent'
import { CIRCLE_SHAPE } from './types'

type CircleShapeAttributes = {
  radius: number
  color: number
}

export class CircleShape extends ShapeComponent<CircleShapeAttributes> {
  constructor(initAttributes: Partial<CircleShapeAttributes> = {}) {
    super('shape', {
      radius: 10,
      color: 0xf4007a,
      ...initAttributes
    })
  }

  getKind() {
    return CIRCLE_SHAPE
  }

  updateContainer(container: PIXI.Container) {
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

    graphics.beginFill(this.attributes.color, 1)
    graphics.drawCircle(0, 0, this.attributes.radius)
    graphics.endFill()
  }
}
