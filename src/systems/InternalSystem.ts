import { PixiSystem } from './PixiSystem'
import { Entity } from 'src/core'

export class InternalSystem extends PixiSystem {
  update() {
    // stub
  }

  protected handleEntityAdded = (entity: Entity) => {
    const internal = new PIXI.Container()
    ;(internal as any)['uuid'] = entity.uuid
    internal.name = entity.debugName

    if (entity.parent) {
      const parent = this.getPixiEntity(entity.parent)
      if (parent) {
        parent.addChild(internal)
      } else {
        console.log(`Internal System: Unable to append child "${entity.uuid}" to parent (parent not found).`, entity)
      }
    } else {
      this.stage.addChild(internal)
    }
  }
}
