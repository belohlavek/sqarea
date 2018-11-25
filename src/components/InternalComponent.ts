import * as PIXI from 'pixi.js'
import { Component, ComponentAttributes } from 'src/core/Component'

export abstract class InternalComponent<T extends ComponentAttributes> extends Component<T> {
  abstract updateContainer(container: PIXI.Container, graphics: PIXI.Graphics): void
}
