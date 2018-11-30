import { Component } from 'src/core/Component'
import { Constants } from 'src/gameplay'
import { Vector2 } from 'src/core/math/Vector2'

type BulletAttributes = {
  initialPosition: Vector2
}

// TODO: we should add position, velocity and direction to the bullet to animate it
export class Bullet extends Component<BulletAttributes> {
  constructor(initAttributes: Partial<BulletAttributes> = {}) {
    super('bullet', {
      initialPosition: new Vector2(0, 0),
      ...initAttributes
    })
  }

  exceedsMaxDistance(position: Vector2) {
    const { initialPosition } = this.attributes
    return (
      Math.abs(initialPosition.x - position.x) > Constants.MAX_BULLET_DISTANCE ||
      Math.abs(initialPosition.y - position.y) > Constants.MAX_BULLET_DISTANCE
    )
  }
}
