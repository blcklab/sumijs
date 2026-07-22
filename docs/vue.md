# Vue 3 integration

Render ASCII content from computed state and avoid regenerating it when unrelated component state changes.

## Text component

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { renderText } from '@blcklab/sumijs/text'
import { block } from '@blcklab/sumijs/fonts/block'

const props = defineProps<{
  text: string
}>()

const html = computed(() =>
  renderText(props.text, {
    font: block,
    style: {
      gradient: ['#6366f1', '#ec4899'],
    },
  }).toHTML({
    includePre: false,
    ariaLabel: props.text,
  }),
)
</script>

<template>
  <pre class="ascii-logo" :aria-label="text" v-html="html" />
</template>
```

The output is escaped by SumiJS. Do not concatenate unrelated untrusted HTML around it before assigning through `v-html`.

## SSR

Text rendering and HTML generation do not depend on browser globals, so the component can render on the server. Ensure the server and client use the same input, options, and package version to avoid hydration differences.

## Browser images

Decode images in `onMounted()` because Canvas APIs are required during decoding.

```ts
import { onMounted, ref } from 'vue'
import { renderImage } from '@blcklab/sumijs/image'
import { createBrowserImageDecoder } from '@blcklab/sumijs/image/browser'

const html = ref('')

onMounted(async () => {
  const result = await renderImage('/logo.png', {
    decoder: createBrowserImageDecoder(),
    width: 60,
  })
  html.value = result.toHTML({ includePre: false, ariaLabel: 'Logo' })
})
```

Handle loading and decoding errors in the component state so a failed asset does not leave an empty interface without explanation.
