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

  updateContainer(container: PIXI.Container, graphics: PIXI.Graphics) {
    graphics.beginFill(this.attributes.color, 1)
    graphics.drawCircle(0, 0, this.attributes.radius)
    graphics.endFill()
  }
}
