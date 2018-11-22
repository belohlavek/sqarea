import { DataObject } from 'src/core/DataObject'
import { ShapeComponent } from './ShapeComponent'
import { CIRCLE_SHAPE } from './types'

type CircleShapeAttributes = {
  radius?: number
  color?: number
}

export class CircleShape extends ShapeComponent {
  @DataObject.field
  radius: number

  @DataObject.field
  color: number

  constructor({ radius = 10, color = 0xf4007a }: CircleShapeAttributes = {}) {
    super('shape')

    this.radius = radius
    this.color = color
  }

  getKind() {
    return CIRCLE_SHAPE
  }
}
