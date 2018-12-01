import { Transform } from 'src/components'

export function renderTransform(container: PIXI.Container, component: Transform) {
  container.x = component.attributes.position.x
  container.y = component.attributes.position.y
  container.rotation = component.attributes.rotation
  container.width = component.attributes.scale.x
  container.height = component.attributes.scale.y
}
