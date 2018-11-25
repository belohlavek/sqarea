import { System, InputController, Key } from 'src/core'
import { PlayableEntity, BulletEntity } from 'src/entities'
import { Transform, CircleShape, BoxShape, Bullet } from 'src/components'
import { Constants } from 'src/gameplay'
import { throttle } from 'src/utils'

export class BulletSpreadSystem extends System {
  private entity: PlayableEntity
  private bullets: BulletEntity[] = []
  private input: InputController = InputController.getInstance()

  constructor(e: PlayableEntity) {
    super()
    this.entity = e
    this.addSpread = throttle(this.addSpread, Constants.BULLET_THROTTLE_MS)
  }

  update(dt: number) {
    if (this.input.isDown(Key.SPACE)) {
      this.addSpread()
    }

    if (this.bullets.length > 0) {
      const newBullets: BulletEntity[] = []

      for (const bulletEntity of this.bullets) {
        const bullet = bulletEntity.getComponent<Bullet>('bullet')
        const transform = bulletEntity.getComponent<Transform>('transform')

        if (bullet.exceedsMaxDistance(transform.position)) {
          this.engine.removeEntity(bulletEntity)
        } else {
          transform.position.x += Constants.BULLET_SPEED * dt
          newBullets.push(bulletEntity)
        }
      }
      this.bullets = newBullets
    }
  }

  addSpread = () => {
    this.engine.addEntity(this.createBullet())
  }

  createBullet() {
    const entityTransform = this.entity.getComponent<Transform>('transform')
    const entityBoxShape = this.entity.getComponent<BoxShape>('shape')

    const bulletEntity = new BulletEntity()
    const transform = new Transform()

    const position = entityTransform.position.clone()

    // Right face
    transform.position.x = position.x + entityBoxShape.width
    transform.position.y = position.y + entityBoxShape.height / 2
    transform.rotation = Math.round(Math.random() * 180)

    bulletEntity.addComponent(transform)
    bulletEntity.addComponent(new Bullet({ initialPosition: position }))
    bulletEntity.addComponent(new CircleShape())

    this.bullets.push(bulletEntity)

    return bulletEntity
  }
}
