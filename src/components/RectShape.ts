import { ShapeComponent } from './ShapeComponent'
import { ShapeKind } from './types'

export type BoxShapeAttributes = {
  height: number
  width: number
  color: number
}

export class RectShape extends ShapeComponent<BoxShapeAttributes> {
  constructor(initAttributes: Partial<BoxShapeAttributes> = {}) {
    super('shape', {
      height: 1,
      width: 1,
      color: 0xf4007a,
      ...initAttributes
    })
  }

  getKind() {
    return ShapeKind.RECT_SHAPE
  }
}
