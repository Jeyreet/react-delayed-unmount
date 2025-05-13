# react-delayed-unmount

> Simple React component to delay DOM unmounting for exit animations — without third-party animation libraries.

## ✨ Features

- Zero dependencies
- Native DOM behavior using `MutationObserver`
- Enables exit animations on unmount
- Dead simple API

## 🚀 Installation

Just copy the `DelayedUnmount.jsx` component into your project.  
(May be published to npm later.)

## 🧠 Usage

```jsx
import { DelayedUnmount } from './DelayedUnmount'
import './your-animation.css'

<DelayedUnmount timeout={500}>
  {items.map(item => (
    <YourComponent key={item.id} {...item} />
  ))}
</DelayedUnmount>
```

```css[data-mounted] {
[data-mounted] {
  animation: fade-in 0.3s ease-out;
}

[data-unmounted] {
  animation: fade-out 0.5s ease-in;
}

@keyframes fade-in {
  from { opacity: 0 }
  to { opacity: 1 }
}

@keyframes fade-out {
  from { opacity: 1 }
  to { opacity: 0 }
}
```

| Prop       | Type     | Default    | Description                                                           |
| ---------- | -------- | ---------- | --------------------------------------------------------------------- |
| `timeout`  | `number` | `0`        | How long (ms) to keep the removed DOM element                         |

## 📦 How it works

- The component watches for DOM mutations using MutationObserver.
- When a child is added, it gets a data-mounted attribute — useful for entry animations.
- When a child is removed by React, it is temporarily restored, given data-unmounted, and deleted after timeout.
- This enables you to animate the removed element before it's actually gone.

## 🧪 Bonus
- Because it uses data- attributes, there's no need to modify class names or styles inside your components when using CSS Modules.
- Doesn't require modifying your inner components.
- You can wrap any layout/component in <DelayedUnmount> and animate entry/exit visually.
