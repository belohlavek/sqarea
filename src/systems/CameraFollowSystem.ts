import { Entity, engine } from 'src/core'
import { Transform, ComponentType } from 'src/components'
import { Camera } from 'src/components/Camera'
import { Vector2 } from 'src/core/math/Vector2'
import { renderCamera } from 'src/renderers/renderCamera'
import { PixiSystem } from './PixiSystem'

export class CameraFollowSystem extends PixiSystem {
  cameraEntity: Entity
  container: Entity
  // TODO do something with this ^

  constructor(app: PIXI.Application, camera: Entity, container: Entity) {
    super(app)
    this.cameraEntity = camera
    this.container = container
  }

  protected shouldTrackEntity(entity: Entity) {
    const shape = entity.getComponent<Camera>('camera')

    if (shape) {
      return true
    }

    return false
  }

  protected handleComponentAdded = (entity: Entity, componentType: ComponentType) => {
    if (componentType === 'camera' && entity !== this.cameraEntity) {
      throw new Error(`Camera System: multiple camera instances are not supported`)
    }
  }

  update(dt: number) {
    const entity = this.cameraEntity
    const camera = entity.getComponent<Camera>('camera')
    const target = engine.entities[camera.attributes.target]
    const targetTransform = target ? target.getComponent<Transform>('transform') : null
    const targetPosition = targetTransform ? targetTransform.attributes.position : new Vector2(0, 0)
    const container = this.getPixiEntity(entity)
    // TODO: cache engine lookups ^^^^^^

    if (!camera) {
      console.log(`Camera System: missing camera component on entity "${entity.uuid}"`)
      return
    }

    // TODO: follow speed
    camera.attributes.pivot.x = (targetPosition.x - camera.attributes.pivot.x) * dt + camera.attributes.pivot.x
    camera.attributes.pivot.y = (targetPosition.y - camera.attributes.pivot.y) * dt + camera.attributes.pivot.y

    if (container) {
      renderCamera(container, camera)
    }
  }
}
