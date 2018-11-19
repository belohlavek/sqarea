import { System, InputController, Key } from 'src/core'
import { PlayableEntity } from 'src/entities/PlayableEntity'
import { Transform } from 'src/components'
import { Constants } from 'src/gameplay'

export class MovementSystem extends System {
  private entity: PlayableEntity
  private input: InputController = InputController.getInstance()

  constructor(e: PlayableEntity) {
    super()
    this.entity = e
  }

  update(dt: number) {
    const t = this.entity.getComponent<Transform>('transform')
    if (this.input.isAnyDown([Key.LEFT, Key.A])) {
      t.position.x -= Constants.PLAYER_SPEED * dt
    }
    if (this.input.isAnyDown([Key.RIGHT, Key.D])) {
      t.position.x += Constants.PLAYER_SPEED * dt
    }
    if (this.input.isAnyDown([Key.UP, Key.W])) {
      t.position.y -= Constants.PLAYER_SPEED * dt
    }
    if (this.input.isAnyDown([Key.DOWN, Key.S])) {
      t.position.y += Constants.PLAYER_SPEED * dt
    }
  }
}
