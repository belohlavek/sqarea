import { Entity } from 'src/core'

export class PixiCache {
  getPixiEntity(entity: Entity) {
    // get upwards path
    let parent = entity.parent
    while (parent) {
      // if it's a root, itsa mario
      if (!parent.parent) {
      }
    }
  }
}
