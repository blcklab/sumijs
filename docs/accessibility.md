# Accessibility

ASCII art is visual presentation. Always provide a readable text equivalent when the content communicates a name, heading, status, or instruction.

## HTML labels

```ts
result.toHTML({
  ariaLabel: 'SumiJS',
  accessibleText: 'SumiJS',
})
```

`ariaLabel` labels the generated element. `accessibleText` adds a readable text equivalent for configurations that include the accessibility container.

## Decorative art

When the ASCII is purely decorative, keep the meaningful text elsewhere in the interface and mark the decorative wrapper as hidden from assistive technology.

```html
<div aria-hidden="true">…generated art…</div>
<h1>SumiJS</h1>
```

## SVG

Provide a `title`, and add a `description` when the image conveys more than a short label.

```ts
result.toSVG({
  title: 'SumiJS logo',
  description: 'The word SumiJS rendered with a purple gradient',
})
```

## Color and contrast

Do not rely on gradient or ANSI color alone to communicate state. Test foreground and background combinations in the final environment. Terminal themes vary, and a color that works on a dark terminal may be unreadable on a light one.

## Motion and updates

SumiJS does not animate output. If an application repeatedly replaces ASCII content, manage live-region behavior deliberately so screen readers are not interrupted by decorative updates.
