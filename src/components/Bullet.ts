import * as PIXI from 'pixi.js'
import { Component } from 'src/core/Component'
import { DataObject } from 'src/core/DataObject'
import { Constants } from 'src/gameplay'

type BulletAttributes = {
  initialPosition?: PIXI.Point
}

export class Bullet extends Component {
  // @internal
  initialPosition: PIXI.Point

  constructor({ initialPosition = new PIXI.Point(0, 0) }: BulletAttributes = {}) {
    super('bullet')

    this.initialPosition = initialPosition
  }

  exceedsMaxDistance(position: PIXI.Point) {
    return (
      Math.abs(this.initialPosition.x - position.x) > Constants.MAX_BULLET_DISTANCE ||
      Math.abs(this.initialPosition.y - position.y) > Constants.MAX_BULLET_DISTANCE
    )
  }
}
