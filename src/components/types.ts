export type ComponentType = 'bullet' | 'shape' | 'transform' | '__test__'

export const BOX_SHAPE = 'BOX_SHAPE' as 'BOX_SHAPE'
export const CIRCLE_SHAPE = 'CIRCLE_SHAPE' as 'CIRCLE_SHAPE'

export type ShapeKind = typeof BOX_SHAPE | typeof CIRCLE_SHAPE
