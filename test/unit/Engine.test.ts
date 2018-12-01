import { should } from 'fuse-test-runner'
import { Engine, Entity, System } from 'src/core'
import { future } from '../helpers'

export class EngineTest {
  engine: Engine = new Engine()

  beforeEach() {
    this.engine = new Engine()
  }

  'Should successfully create an Engine'() {
    should(this.engine).beInstanceOf(Engine)
  }

  async 'Should successfully add an entity'() {
    const ent = new Entity()
    const addEventFuture = future()
    this.engine.on('entity_added', e => addEventFuture.resolve(e))
    this.engine.addEntity(ent)
    should(this.engine.entities[ent.uuid]).beOkay()
    should(await addEventFuture).equal(ent)
  }

  async 'Should successfully add a system'() {
    class Sys extends System {
      update() {
        // Empty system
      }
    }
    const sys = new Sys()
    const addEventFuture = future()
    this.engine.on('system_added', e => addEventFuture.resolve(e))
    this.engine.addSystem(sys)
    should(this.engine.systems.find(s => s.uuid === sys.uuid)).beOkay()
    should(await addEventFuture).equal(sys)
  }

  async 'Should successfully remove an entity'() {
    const ent = new Entity()
    const removeEventFuture = future()
    this.engine.on('entity_removed', e => removeEventFuture.resolve(e))
    this.engine.addEntity(ent)
    this.engine.removeEntity(ent)

    should(this.engine.entities[ent.uuid]).equal(undefined)
    should(this.engine['pool'].some(e => e.uuid === ent.uuid)).beTrue()
    should(await removeEventFuture).equal(ent)
  }

  async 'Should recursively add/remove entities'() {
    const ent = new Entity()
    const ent2 = new Entity()
    const ent3 = new Entity()

    ent.addChild(ent2)
    ent2.addChild(ent3)

    this.engine.addEntity(ent)
    should(Object.keys(this.engine.entities)).deepEqual([ent.uuid, ent2.uuid, ent3.uuid])
    this.engine.removeEntity(ent)
    should(Object.keys(this.engine.entities).length).equal(0)
  }

  async 'Should successfully remove a system'() {
    class Sys extends System {
      update() {
        // Empty system
      }
    }
    const sys = new Sys()
    const removeEventFuture = future()
    this.engine.on('system_removed', e => removeEventFuture.resolve(e))
    this.engine.removeSystem(sys)
    should(this.engine.systems.find(s => s.uuid === sys.uuid)).equal(undefined)
    should(await removeEventFuture).equal(sys)
  }

  async 'Should successfully get available entity from pool'() {
    const ent = new Entity()
    this.engine.addEntity(ent)
    this.engine.removeEntity(ent)

    should(this.engine['pool'].length).equal(1)
    should(this.engine.getAvailableEntity()).equal(ent)
    should(this.engine['pool'].length).equal(0)
  }

  async 'Should update systems on engine update'() {
    const updateFuture = future()
    class Sys extends System {
      update(dt: number) {
        updateFuture.resolve(dt)
      }
    }
    this.engine.addSystem(new Sys())
    this.engine.update(1)

    should(await updateFuture).equal(1)
  }
}
