import * as PIXI from 'pixi.js'
import { Entity, engine, inputController } from 'src/core'
import { RectShape, Transform } from 'src/components'
import { MovementSystem, BulletSpreadSystem } from 'src/systems'
import { PlayableEntity } from 'src/entities'
import { RenderingSystem } from './systems/RenderingSystem'
import { TransformSystem } from './systems/TransformSystem'
import { CameraFollowSystem } from './systems/CameraFollowSystem'
import { Vector2 } from './core/math/Vector2'
import { CameraEntity } from './entities/CameraEntity'
import { InternalSystem } from './systems/InternalSystem'
import { PixiCache } from './utils/PixiCache'

declare const process: any
declare const window: any

const view = document.getElementById('game') as HTMLCanvasElement
const app = new PIXI.Application({ view })

if (process.env.NODE_ENV === 'dev') {
  window['engine'] = engine
}

inputController.startListening()

function initCamera() {
  const camera = new CameraEntity(800, 600)
  camera.debugName = 'Camera Entity'
  engine.addEntity(camera)

  return camera
}

function init() {
  const cache = new PixiCache(app)
  engine.addSystem(new InternalSystem(cache), 0)

  const worldContainer = new Entity()
  worldContainer.debugName = 'World Container'

  const camera = initCamera()

  const playableEntity = new PlayableEntity()
  playableEntity.debugName = 'Player Entity'
  playableEntity.addComponent(new RectShape())
  playableEntity.addComponent(new Transform())

  const otherEntity = new Entity()
  otherEntity.debugName = 'Other Entity'
  otherEntity.addComponent(new RectShape())
  otherEntity.addComponent(
    new Transform({
      position: new Vector2(500, 500),
      scale: new Vector2(10, 10)
    })
  )

  engine.addSystem(new RenderingSystem(cache))
  engine.addSystem(new TransformSystem(cache))
  engine.addSystem(new MovementSystem(playableEntity))
  engine.addSystem(new BulletSpreadSystem(playableEntity))

  worldContainer.addChild(playableEntity)
  worldContainer.addChild(otherEntity)
  engine.addEntity(worldContainer)

  camera.follow(playableEntity)

  engine.addSystem(new CameraFollowSystem(cache, camera, worldContainer))

  app.ticker.add(dt => engine.update(dt))
}

init()
