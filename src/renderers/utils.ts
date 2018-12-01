/**
 * Returns an existing PIXI.Graphics if possible, otherwise it creates a new one.
 * @param container
 */
export function getContainerGraphics(container: PIXI.Container): PIXI.Graphics {
  let ref: PIXI.DisplayObject & { isGraphic?: boolean } = container.children[0]
  let graphics: PIXI.Graphics & { isGraphic?: boolean }

  if (!ref || (ref && !ref.isGraphic)) {
    graphics = new PIXI.Graphics()
    graphics['isGraphic'] = true // faster than instanceof

    if (ref) {
      container.removeChildAt(0)
    }

    container.addChild(graphics)
  } else {
    // reuse graphics instance
    graphics = ref as PIXI.Graphics
    graphics.clear()
  }

  return graphics
}
