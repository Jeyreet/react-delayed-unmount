# react-delayed-unmount

> Simple React component to delay DOM unmounting for exit animations — without third-party animation libraries.

## ✨ Features

- Zero dependencies
- Native DOM behavior using `MutationObserver`
- Allows exit animations on unmount
- Dead simple API

## 🚀 Installation

Just copy the component `DelayedUnmount.jsx` into your project.  

## 🧠 Usage

```jsx
import { DelayedUnmount } from './DelayedUnmount'
import './your-animation.css'

<DelayedUnmount
  timeout={500}
  {items.map(item => (
    <YourComponent key={item.id} {...item} />
  ))}
</DelayedUnmount>
```

| Prop       | Type     | Default    | Description                                                           |
| ---------- | -------- | ---------- | --------------------------------------------------------------------- |
| `timeout`  | `number` | `0`        | How long (ms) to keep the removed DOM element                         |
| `onRemove` | `func`   | `el => {}` | Callback with the removed element — apply animation classes or styles |

## 📦 How it works

- The component watches for DOM mutations (removed children).
- When a child is removed by React, it is placed back temporarily in the same spot.
- The onRemove callback is triggered, allowing you to animate it out.
- After timeout, the node is removed from the DOM.
