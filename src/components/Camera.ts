import { Vector2 } from 'src/core/math/Vector2'
import { InternalComponent } from './InternalComponent'

type CameraAttributes = {
  // Controls the camera focus
  pivot: Vector2

  // follow target entity uuid
  target: string | null

  viewportWidth: number
  viewportHeight: number
}

export class Camera extends InternalComponent<CameraAttributes> {
  constructor(initAttributes: Partial<CameraAttributes> = {}) {
    super('camera', {
      pivot: new Vector2(0, 0),
      target: null,
      viewportWidth: 0,
      viewportHeight: 0,
      ...initAttributes
    })
  }
}
