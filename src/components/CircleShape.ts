import { DataObject } from 'src/core/DataObject'
import { ShapeComponent } from './ShapeComponent'
import { BOX_SHAPE } from './types'

type CircleShapeAttributes = {
  radius?: number
}

export class CircleShape extends ShapeComponent {
  @DataObject.field
  radius: number

  constructor({ radius = 10 }: CircleShapeAttributes = {}) {
    super('shape')

    this.radius = radius
  }

  getKind() {
    return BOX_SHAPE
  }
}
