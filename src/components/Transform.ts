import { Vector2 } from 'src/core/math/Vector2'
import { InternalComponent } from './InternalComponent'

export type TransformAttributes = {
  position: Vector2
  rotation: number
  scale: Vector2
}

export class Transform extends InternalComponent<TransformAttributes> {
  constructor(initAttributes: Partial<TransformAttributes> = {}) {
    super('transform', {
      position: new Vector2(0, 0),
      rotation: 0,
      scale: new Vector2(100, 100),
      ...initAttributes
    })
  }
}
