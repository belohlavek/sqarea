import * as PIXI from 'pixi.js'
import { Vector2 } from 'src/core/math/Vector2'
import { InternalComponent } from './InternalComponent'

export type TransformAttributes = {
  position: Vector2
  rotation: number
  scale: Vector2
}

export class Transform extends InternalComponent<TransformAttributes> {
  constructor(initAttributes: Partial<TransformAttributes> = {}) {
    super('transform', {
      position: new Vector2(0, 0),
      rotation: 0,
      scale: new Vector2(100, 100),
      ...initAttributes
    })
  }

  updateContainer(container: PIXI.Container, graphics: PIXI.Graphics) {
    container.x = this.attributes.position.x
    container.y = this.attributes.position.y

    container.rotation = this.attributes.rotation

    container.width = this.attributes.scale.x
    container.height = this.attributes.scale.y
  }
}
