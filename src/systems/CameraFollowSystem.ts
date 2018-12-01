import { Entity } from 'src/core'
import { Transform, ComponentType } from 'src/components'
import { Camera } from 'src/components/Camera'
import { renderCamera } from 'src/renderers/renderCamera'
import { PixiSystem } from './PixiSystem'
import { PixiCache } from 'src/utils/PixiCache'

export class CameraFollowSystem extends PixiSystem {
  cameraEntity: Entity
  world: Entity

  constructor(cache: PixiCache, camera: Entity, world: Entity) {
    super(cache)
    this.cameraEntity = camera
    this.world = world
  }

  update(dt: number) {
    const entity = this.cameraEntity
    const worldContainer = this.getPixiEntity(this.world)
    const cameraComponent = entity.getComponent<Camera>('camera')
    if (!cameraComponent) {
      console.log(`Camera System: missing camera component on entity "${entity.uuid}"`)
      return
    }

    let target: Transform | undefined

    if (this.engine && cameraComponent.attributes.target) {
      const targetEntity = this.getEntityById(cameraComponent.attributes.target)
      if (targetEntity) {
        target = targetEntity.getComponent<Transform>('transform')
      }
    }

    if (target) {
      const position = target.attributes.position
      const width = target.attributes.scale.x
      const height = target.attributes.scale.y

      // TODO: follow speed
      cameraComponent.attributes.pivot.x =
        (position.x + width / 2 - cameraComponent.attributes.pivot.x) * dt + cameraComponent.attributes.pivot.x
      cameraComponent.attributes.pivot.y =
        (position.y + height / 2 - cameraComponent.attributes.pivot.y) * dt + cameraComponent.attributes.pivot.y

      if (worldContainer) {
        renderCamera(worldContainer, cameraComponent)
      }
    }
  }

  protected shouldTrackEntity(entity: Entity) {
    return !!entity.getComponent<Camera>('camera')
  }

  protected handleComponentAdded = (entity: Entity, componentType: ComponentType) => {
    if (componentType === 'camera' && entity !== this.cameraEntity) {
      throw new Error(`Camera System: multiple camera instances are not supported`)
    }
  }
}
