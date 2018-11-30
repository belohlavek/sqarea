import * as PIXI from 'pixi.js'
import { System, Entity } from 'src/core'

/**
 * Helper class to create systems that depend or modify PIXI's scene tree.
 * This system is constructed with and provides a reference to the root PIXI.Application.
 */
export abstract class PixiSystem extends System {
  /**
   * PIXI application instance
   */
  protected app: PIXI.Application

  /**
   * The world container, should be used for anything other than HUDs
   */
  protected world: PIXI.Container

  constructor(app: PIXI.Application, world?: Entity) {
    super()
    this.app = app

    if (world) {
      this.trackEntity(world)
      const cont = this.getPixiEntity(world)
      this.world = cont
    }
  }

  /**
   * Returns the internal engine container for the given entity
   * @param entity
   */
  protected getPixiEntity(entity: Entity): PIXI.Container | null {
    // TODO: find upwards path to root parent as array
    // while(array) go down pixi's tree and remove items from the array

    const ctx = this.world || this.app.stage

    for (let i = 0; i < ctx.children.length; i++) {
      const child = ctx.children[i]

      if (child['uuid'] === entity.uuid) {
        return child as PIXI.Container
      }
    }

    return null
  }

  protected appendPixiEntity() {
    //
  }
}
