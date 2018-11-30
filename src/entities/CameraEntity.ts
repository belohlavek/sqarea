import { Entity } from 'src/core'
import { Camera } from 'src/components/Camera'
import { Vector2 } from 'src/core/math/Vector2'

export class CameraEntity extends Entity {
  component: Camera

  constructor(width: number, height: number) {
    super()
    this.component = new Camera({
      viewportWidth: width,
      viewportHeight: height
    })
    this.addComponent(this.component)
  }

  follow(entity: Entity) {
    this.component.attributes.target = entity.uuid
  }
}
