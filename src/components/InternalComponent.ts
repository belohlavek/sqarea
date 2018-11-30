import * as PIXI from 'pixi.js'
import { Component, ComponentAttributes } from 'src/core/Component'

export abstract class InternalComponent<T extends ComponentAttributes> extends Component<T> {}
