import { Camera } from 'src/components/Camera'

export function renderCamera(container: PIXI.Container, component: Camera) {
  const { pivot, viewportWidth, viewportHeight } = component.attributes
  container.pivot.x = pivot.x - viewportWidth / 2
  container.pivot.y = pivot.y - viewportHeight / 2
}
