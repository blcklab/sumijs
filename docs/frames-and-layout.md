# Frames and layout

Frames add borders, spacing, and optional titles around a rendered grid before final width alignment is applied.

## Built-in borders

```ts
const result = renderText('SUMI', {
  frame: {
    style: 'rounded',
    padding: 1,
    margin: { top: 1, bottom: 1 },
    title: 'SumiJS',
    titleAlign: 'center',
  },
})
```

Built-in styles are `single`, `double`, `rounded`, and `heavy`.

## Custom borders

```ts
const result = renderText('SUMI', {
  frame: {
    style: {
      topLeft: '+',
      top: '-',
      topRight: '+',
      right: '|',
      bottomRight: '+',
      bottom: '-',
      bottomLeft: '+',
      left: '|',
    },
  },
})
```

Every custom border field must contain one character.

## Padding and margin

Use one number for all sides or an object for independent sides.

```ts
frame: {
  padding: { top: 1, right: 2, bottom: 1, left: 2 },
  margin: 1,
}
```

Spacing values must be non-negative integers.

## Frame titles

Frame titles are placed on the top border and can be aligned left, center, or right. Titles are clipped when the frame is too narrow.

## Width calculation

The frame is applied before `width`, `maxWidth`, and final alignment. When wrapping text, SumiJS subtracts frame borders, padding, and margins before deciding how much source text fits on each logical line.

Choose a width large enough for the border and spacing. An impossible configuration produces `INVALID_DIMENSIONS`.
