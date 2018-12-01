import { System, Key, inputController } from 'src/core'
import { PlayableEntity, BulletEntity } from 'src/entities'
import { Transform, CircleShape, Bullet } from 'src/components'
import { Constants } from 'src/gameplay'
import { Vector2 } from 'src/core/math/Vector2'
import { throttle } from 'src/utils'

export class BulletSpreadSystem extends System {
  private entity: PlayableEntity
  private bullets: BulletEntity[] = []

  constructor(e: PlayableEntity) {
    super()
    this.entity = e

    // TODO: This shouldn't be a throttle, we should control the fire rate
    this.addSpread = throttle(this.addSpread, Constants.BULLET_THROTTLE_MS)
  }

  update(dt: number) {
    if (inputController.isDown(Key.SPACE)) {
      this.addSpread()
    }

    if (this.bullets.length > 0) {
      const newBullets: BulletEntity[] = []

      for (const bulletEntity of this.bullets) {
        const bullet = bulletEntity.getComponent<Bullet>('bullet')
        const transform = bulletEntity.getComponent<Transform>('transform')

        if (this.engine && bullet.exceedsMaxDistance(transform.attributes.position)) {
          this.engine.removeEntity(bulletEntity)
        } else {
          transform.attributes.position.x += Constants.BULLET_SPEED * dt
          newBullets.push(bulletEntity)
        }
      }
      this.bullets = newBullets
    }
  }

  addSpread = () => {
    // TODO: We should add 3 (or more) bullets here and animate them using position, velocity and direction
    if (this.engine) {
      this.engine.addEntity(this.createBullet())
    }
  }

  createBullet() {
    const entityTransform = this.entity.getComponent<Transform>('transform')

    const bulletEntity = new BulletEntity()

    const { position, scale } = entityTransform.attributes
    const initialPosition = new Vector2().copyFrom(position)

    // Center
    const x = position.x + scale.x / 2
    const y = position.y + scale.y / 2
    const rotation = Math.round(Math.random() * 180)

    bulletEntity.addComponent(
      new Transform({
        position: new Vector2(x, y),
        rotation,
        scale: new Vector2(20, 20)
      })
    )
    bulletEntity.addComponent(new Bullet({ initialPosition }))
    bulletEntity.addComponent(new CircleShape())

    this.bullets.push(bulletEntity)

    return bulletEntity
  }
}
