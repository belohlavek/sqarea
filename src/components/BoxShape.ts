import * as PIXI from 'pixi.js'
import { ShapeComponent } from './ShapeComponent'
import { BOX_SHAPE } from './types'

export type BoxShapeAttributes = {
  height: number
  width: number
  color: number
}

export class BoxShape extends ShapeComponent<BoxShapeAttributes> {
  constructor(initAttributes: Partial<BoxShapeAttributes> = {}) {
    super('shape', {
      height: 1,
      width: 1,
      color: 0xf4007a,
      ...initAttributes
    })
  }

  getKind() {
    return BOX_SHAPE
  }

  updateContainer(container: PIXI.Container, graphics: PIXI.Graphics) {
    graphics.beginFill(this.attributes.color, 1)
    graphics.drawRect(0, 0, this.attributes.height, this.attributes.width)
    graphics.endFill()
  }
}
