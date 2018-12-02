import { System, Entity } from 'src/core'
import { PixiCache } from 'src/utils/PixiCache'

/**
 * Helper class to create systems that depend or modify PIXI's scene tree.
 * This system is constructed with and provides a reference to the root PIXI.Application.
 */
export abstract class PixiSystem extends System {
  protected cache: PixiCache

  constructor(cache: PixiCache) {
    super()
    this.cache = cache
  }

  get stage() {
    return this.cache.getStage()
  }

  getPixiEntity(entity: Entity) {
    return this.cache.getPixiEntity(entity)
  }

  removePixiEntity(entity: Entity) {
    return this.cache.removePixiEntity(entity)
  }
}
