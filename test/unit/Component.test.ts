import { should } from 'fuse-test-runner'
import { Component } from 'src/core'

export class ComponentTest {
  'Should successfully create a Component'() {
    class Compy extends Component {}
    should(new Compy('__test__', {})).beInstanceOf(Compy)
  }

  'Should successfully create a Component with scalar attributes'() {
    class Compy extends Component {}
    should(
      new Compy('__test__', {
        a: 1,
        b: 'a',
        c: null
      })
    ).beInstanceOf(Compy)
  }

  'Should create a Component with supported data structures'() {
    class Compy extends Component {}
    const instance = new Compy('__test__', {
      data: {
        calls: 0,
        getHash() {
          const v = this.calls === 0 ? 'foo' : 'bar'
          this.calls++
          return v
        }
      }
    })

    should(instance.isDirty).equal(true) // components are dirty when instanced
    instance.isDirty = false
    should(instance.isDirty).equal(false) // the first time the cache is clean
    should(instance['cache']['data']).equal('foo')
    should(instance.isDirty).equal(true) // now we can diff against the cache
    should(instance['cache']['data']).equal('bar')
  }

  'Should fail to create a Component with unsupported data structures'() {
    class Compy extends Component {}
    should().throwException(() => {
      const instance = new Compy('__test__', {
        invalid: {
          someOtherMethod() {
            return true
          }
        }
      })

      instance.isDirty = false
      console.log(instance.isDirty)
    })
  }
}
