import { RectShape, CircleShape } from 'src/components'
import { getContainerGraphics } from './utils'

export function renderRect(container: PIXI.Container, component: RectShape) {
  const { color, width, height } = component.attributes
  const graphics = getContainerGraphics(container)

  graphics.beginFill(color, 1)
  graphics.drawRect(0, 0, height, width)
  graphics.endFill()
}

export function renderCircle(container: PIXI.Container, component: CircleShape) {
  const { color, radius } = component.attributes
  const graphics = getContainerGraphics(container)

  graphics.beginFill(color, 1)
  graphics.drawCircle(0, 0, radius)
  graphics.endFill()
}
