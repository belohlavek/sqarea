import { Entity } from 'src/core'
import { Transform, ComponentType } from 'src/components'
import { Camera } from 'src/components/Camera'
import { Vector2 } from 'src/core/math/Vector2'
import { renderCamera } from 'src/renderers/renderCamera'
import { PixiSystem } from './PixiSystem'
import { PixiCache } from 'src/utils/PixiCache'

export class CameraFollowSystem extends PixiSystem {
  cameraEntity: Entity
  container: Entity

  constructor(cache: PixiCache, camera: Entity, container: Entity) {
    super(cache)
    this.cameraEntity = camera
    this.container = container
  }

  protected shouldTrackEntity(entity: Entity) {
    return !!entity.getComponent<Camera>('camera')
  }

  protected handleComponentAdded = (entity: Entity, componentType: ComponentType) => {
    if (componentType === 'camera' && entity !== this.cameraEntity) {
      throw new Error(`Camera System: multiple camera instances are not supported`)
    }
  }

  update(dt: number) {
    const entity = this.cameraEntity
    const camera = entity.getComponent<Camera>('camera')
    if (!camera) {
      console.log(`Camera System: missing camera component on entity "${entity.uuid}"`)
      return
    }

    const target = this.engine && camera.attributes.target ? this.engine.entities[camera.attributes.target] : null
    const targetTransform = target ? target.getComponent<Transform>('transform') : null
    const targetPosition = targetTransform ? targetTransform.attributes.position : new Vector2(0, 0)
    const container = this.getPixiEntity(entity)
    // TODO: cache engine lookups ^^^^^^
    // Also simplify ternary operations

    // TODO: follow speed
    camera.attributes.pivot.x = (targetPosition.x - camera.attributes.pivot.x) * dt + camera.attributes.pivot.x
    camera.attributes.pivot.y = (targetPosition.y - camera.attributes.pivot.y) * dt + camera.attributes.pivot.y

    if (container) {
      renderCamera(container, camera)
    }
  }
}
