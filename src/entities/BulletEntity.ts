import { Entity } from 'src/core'
import { Transform } from 'src/components'
import { Constants } from 'src/gameplay'

export class BulletEntity extends Entity {
  owner: Entity

  // @internal
  initialPosition: PIXI.Point

  // @internal
  maxTravelDistance: number = Constants.MAX_BULLET_DISTANCE

  constructor(owner: Entity) {
    super()
    this.owner = owner

    const ownerTransform = owner.getComponent<Transform>('transform')
    this.initialPosition = ownerTransform.position.clone()
  }

  exceededMaxDistance() {
    const { position } = this.getComponent<Transform>('transform')
    return (
      Math.abs(position.x - this.initialPosition.x) > this.maxTravelDistance ||
      Math.abs(position.y - this.initialPosition.y) > this.maxTravelDistance
    )
  }
}
