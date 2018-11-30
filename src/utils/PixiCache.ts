import * as PIXI from 'pixi.js'
import { Entity } from 'src/core'

export class PixiCache {
  private cache: Record<string, PIXI.Container> = {}
  private app: PIXI.Application

  constructor(app: PIXI.Application) {
    this.app = app
  }

  getPixiEntity(entity: Entity): PIXI.Container {
    if (!this.cache[entity.uuid]) {
      const rootPath = this.getRootPath(entity)
      this.cache[entity.uuid] = this.getNestedPixiChild(rootPath)
    }
    return this.cache[entity.uuid]
  }

  getStage(): PIXI.Container {
    return this.app.stage
  }

  /**
   * Returns an array containing the uuids of all the entities
   * starting from the given entity up until the root entity.
   * @param entity - The given entity starting point
   */
  private getRootPath(entity: Entity): string[] {
    let parent = entity.parent
    let path: string[] = []

    while (parent) {
      path.push(parent.uuid)

      if (parent.parent) {
        parent = parent.parent
      } else {
        break
      }
    }
    debugger
    return path
  }

  private getNestedPixiChild(path: string[]): PIXI.Container {
    let child: PIXI.Container = this.getStage()

    for (let i = 0; i < path.length; i++) {
      const uuid = path[i]
      child = this.getPixiChildByUuid(uuid, child)
    }

    return child
  }

  private getPixiChildByUuid(uuid: string, ctx: PIXI.Container): PIXI.Container | null {
    for (let i = 0; i < ctx.children.length; i++) {
      const child = ctx.children[i]
      if (child['uuid'] === uuid) {
        // TODO: is really everything a container?
        return child as PIXI.Container
      }
    }
    return null
  }
}
