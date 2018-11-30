import { System, Key, inputController } from 'src/core'
import { PlayableEntity } from 'src/entities/PlayableEntity'
import { Transform } from 'src/components'
import { Constants } from 'src/gameplay'

export class MovementSystem extends System {
  private entity: PlayableEntity

  constructor(e: PlayableEntity) {
    super()
    this.entity = e
  }

  update(dt: number) {
    const t = this.entity.getComponent<Transform>('transform')

    if (inputController.isAnyDown([Key.LEFT, Key.A])) {
      t.attributes.position.x -= Constants.PLAYER_SPEED * dt
    }
    if (inputController.isAnyDown([Key.RIGHT, Key.D])) {
      t.attributes.position.x += Constants.PLAYER_SPEED * dt
    }
    if (inputController.isAnyDown([Key.UP, Key.W])) {
      t.attributes.position.y -= Constants.PLAYER_SPEED * dt
    }
    if (inputController.isAnyDown([Key.DOWN, Key.S])) {
      t.attributes.position.y += Constants.PLAYER_SPEED * dt
    }
  }
}
