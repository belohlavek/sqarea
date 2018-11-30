import * as PIXI from 'pixi.js'
import { Entity } from 'src/core'

export class PixiCache {
  private cache: Record<string, PIXI.Container> = {}
  private app: PIXI.Application

  constructor(app: PIXI.Application) {
    this.app = app
  }

  getPixiEntity(entity: Entity): PIXI.Container | null {
    if (!this.cache[entity.uuid]) {
      const rootPath = this.getRootPath(entity)
      const child = this.getNestedPixiChild(rootPath)

      if (child) {
        this.cache[entity.uuid] = child
      }
    }

    return this.cache[entity.uuid] || null
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

    path.push(entity.uuid)

    return path
  }

  /**
   * Returns the child obtained from the provided uuid path.
   */
  private getNestedPixiChild(path: string[]): PIXI.Container | null {
    let child: PIXI.Container = this.getStage()

    for (let i = 0; i < path.length; i++) {
      const uuid = path[i]
      const pixiChild = this.getPixiChildByUuid(uuid, child)

      if (!pixiChild) {
        throw new Error(`Pixi Cache: Unable to find a valid pixi entity with uuid "${uuid}" and path ${path}`)
      }

      child = pixiChild
    }

    return child
  }

  private getPixiChildByUuid(uuid: string, ctx: PIXI.Container): PIXI.Container | null {
    for (let i = 0; i < ctx.children.length; i++) {
      const child = ctx.children[i]
      if ((child as any)['uuid'] === uuid) {
        // TODO: is really everything a container?
        return child as PIXI.Container
      }
    }
    return null
  }
}
