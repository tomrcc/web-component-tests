# Web Components System

This project includes a scalable web components system that automatically discovers and registers all web components.

## How It Works

1. **Automatic Discovery**: The system automatically finds all `.ts` files in `/src/web-components/`
2. **Self-Contained Components**: Each component imports its own template from a corresponding `.html` file
3. **Auto-Registration**: Components are automatically registered when the page loads
4. **Clean Layout**: The Layout.astro file contains no component-specific code

## Adding a New Web Component

To add a new web component, simply create two files in `/src/web-components/`:

### 1. Create the TypeScript file (`my-component.ts`)

```typescript
import templateHTML from "./my-component.html?raw";

export default class MyComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const { shadowRoot } = this;

    // Create template element from imported HTML
    const template = document.createElement("template");
    template.innerHTML = templateHTML;

    const node = document.importNode(template.content, true).cloneNode(true);
    shadowRoot?.appendChild(node);

    // Add your component logic here
  }
}

// Auto-register the component
console.debug("Defining my-component element.");
if (!customElements.get("my-component")) {
  customElements.define("my-component", MyComponent);
}
```

### 2. Create the HTML template (`my-component.html`)

```html
<template id="my-component">
  <style>
    /* Your component styles */
    .my-component {
      /* styles here */
    }
  </style>
  <div class="my-component">
    <slot></slot>
  </div>
</template>
```

### 3. Use the component

```html
<my-component>Your content here</my-component>
```

Or create it dynamically:

```javascript
const myComponent = document.createElement("my-component");
myComponent.textContent = "Dynamic content";
document.body.appendChild(myComponent);
```

## File Structure

```
src/
├── web-components/
│   ├── fade-scroller.ts      ← Component logic
│   ├── fade-scroller.html    ← Component template
│   ├── simple-button.ts      ← Another component
│   └── simple-button.html    ← Another template
├── utils/
│   └── webComponents.ts      ← Auto-discovery system
└── layouts/
    └── Layout.astro          ← Clean, generic layout
```

## Demo

Visit `/web-components-demo` to see examples of both static and dynamic component usage.

## Benefits

- **🧹 Clean Layout**: No component-specific code in Layout.astro
- **📦 Self-Contained**: Each component manages its own template
- **🔄 Auto-Discovery**: No manual registration needed
- **⚡ Scalable**: Add unlimited components without touching the layout
- **🎯 Type-Safe**: Full TypeScript support
