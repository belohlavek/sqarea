import * as PIXI from 'pixi.js'
import { Engine, InputController } from 'src/core'
import { BoxShape, Transform, CircleShape } from 'src/components'
import { MovementSystem, BulletSpreadSystem } from 'src/systems'
import { PlayableEntity, BulletEntity } from 'src/entities'
import { RenderingSystem } from './systems/RenderingSystem'
import { TransformSystem } from './systems/TransformSystem'

declare const process

const view = document.getElementById('game') as HTMLCanvasElement
const app = new PIXI.Application({ view })
const engine = Engine.GetInstance()

if (process.env.NODE_ENV === 'dev') {
  window['engine'] = engine
}

InputController.GetInstance().startListening()

function init() {
  app.ticker.add(dt => {
    engine.update(dt)
  })
}

const playableEntity = new PlayableEntity()
playableEntity.addComponent(new BoxShape())
playableEntity.addComponent(new Transform())

engine.addSystem(new RenderingSystem(app))
engine.addSystem(new TransformSystem(app))
engine.addSystem(new MovementSystem(playableEntity))
engine.addSystem(new BulletSpreadSystem(playableEntity))

engine.addEntity(playableEntity)

init()
