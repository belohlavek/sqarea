import * as PIXI from 'pixi.js'
import { System, Entity } from 'src/core'
import { PixiCache } from 'src/utils'

/**
 * Helper class to create systems that depend or modify PIXI's scene tree.
 * This system is constructed with and provides a reference to the root PIXI.Application.
 */
export abstract class PixiSystem extends System {
  protected cache: PixiCache

  /**
   * The world container, should be used for anything other than HUDs
   */
  protected world: PIXI.Container

  constructor(cache: PixiCache, world?: Entity) {
    super()
    this.cache = cache

    if (world) {
      this.trackEntity(world)
      const cont = this.getPixiEntity(world)
      this.world = cont
    }
  }

  get stage() {
    return this.cache.getStage()
  }

  getPixiEntity(entity: Entity) {
    return this.cache.getPixiEntity(entity)
  }
}
