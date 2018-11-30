import { ShapeComponent } from './ShapeComponent'
import { ShapeKind } from './types'

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
    return ShapeKind.CIRCLE_SHAPE
  }
}
