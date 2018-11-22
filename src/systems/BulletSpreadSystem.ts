import { System, InputController, Key } from 'src/core'
import { PlayableEntity, BulletEntity } from 'src/entities'
import { Transform, CircleShape, BoxShape } from 'src/components'
import { Constants } from 'src/gameplay'
import { throttle } from 'src/utils'

export class BulletSpreadSystem extends System {
  private entity: PlayableEntity
  private bullets: BulletEntity[] = []
  private input: InputController = InputController.getInstance()

  constructor(e: PlayableEntity) {
    super()
    this.entity = e
    this.addSpread = throttle(this.addSpread, 500)
  }

  update(dt: number) {
    if (this.input.isDown(Key.SPACE)) {
      this.addSpread()
    }

    if (this.bullets.length > 0) {
      const newBullets: BulletEntity[] = []

      for (const bullet of this.bullets) {
        if (bullet.exceededMaxDistance()) {
          this.engine.removeEntity(bullet)
        } else {
          const bulletTransform = bullet.getComponent<Transform>('transform')
          bulletTransform.position.x += Constants.BULLET_SPEED
          newBullets.push(bullet)
        }
      }
      this.bullets = newBullets
    }
  }

  addSpread = () => {
    this.engine.addEntity(this.createBullet())
    this.engine.addEntity(this.createBullet())
    this.engine.addEntity(this.createBullet())
  }

  createBullet() {
    const entityTransform = this.entity.getComponent<Transform>('transform')
    const entityBoxShape = this.entity.getComponent<BoxShape>('shape')

    const bulletEntity = new BulletEntity(this.entity)
    const transform = new Transform()

    // Right face
    transform.position.x = entityTransform.position.x + entityBoxShape.width
    transform.position.y = entityTransform.position.y + entityBoxShape.height / 2
    transform.rotation = Math.round(Math.random() * 180)

    bulletEntity.addComponent(transform)
    bulletEntity.addComponent(new CircleShape())

    this.bullets.push(bulletEntity)

    return bulletEntity
  }
}
