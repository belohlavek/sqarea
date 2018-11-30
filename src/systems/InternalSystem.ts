import { PixiSystem } from './PixiSystem'
import { Entity } from 'src/core'

export class InternalSystem extends PixiSystem {
  protected handleEntityAdded = (entity: Entity) => {
    const internal = new PIXI.Container()
    internal['uuid'] = entity.uuid
    internal.name = entity.debugName

    if (entity.parent) {
      const parent = this.getPixiEntity(entity.parent)
      parent.addChild(internal)
    } else {
      this.stage.addChild(internal)
    }
  }

  update() {}
}
