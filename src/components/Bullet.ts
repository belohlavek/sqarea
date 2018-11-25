import * as PIXI from 'pixi.js'
import { Component } from 'src/core/Component'
import { Constants } from 'src/gameplay'

type BulletAttributes = {
  initialPosition: PIXI.Point
}

// TODO: we should add position, velocity and direction to the bullet to animate it
export class Bullet extends Component<BulletAttributes> {
  constructor(initAttributes: Partial<BulletAttributes> = {}) {
    super('bullet', {
      initialPosition: new PIXI.Point(0, 0),
      ...initAttributes
    })
  }

  exceedsMaxDistance(position: PIXI.Point) {
    const { initialPosition } = this.attributes
    return (
      Math.abs(initialPosition.x - position.x) > Constants.MAX_BULLET_DISTANCE ||
      Math.abs(initialPosition.y - position.y) > Constants.MAX_BULLET_DISTANCE
    )
  }
}
