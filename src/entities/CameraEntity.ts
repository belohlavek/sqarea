import { Entity } from 'src/core'
import { Camera } from 'src/components/Camera'

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
