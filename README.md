# React Switchboard 🎛

Quickly create custom DevTools for your React app.

- [Live Demo](https://switchboard-beta.vercel.app/) 🚀
- [Demo repo using Vite](https://github.com/coryhouse/switchboard-with-vite-demo)

## Quick Start

```
npm install react-switchboard -D
```

Call `Switchboard` in your project root. Pass your app's main component to `Switchboard's` `appSlot` prop.

### Vite Example

```tsx
import { lazy } from "react";
import { createRoot } from "react-dom/client";
import "react-switchboard/dist/index.css";

const Switchboard = lazy(() => import("react-switchboard"));

createRoot(document.getElementById("root")!).render(
  import.meta.env.DEV ? (
    <Suspense fallback="Loading Switchboard...">
      <Switchboard appSlot={<App />} />
    </Suspense>
  ) : (
    <App />
  )
);
```

## Headless

The `Switchboard` component accepts children so you can specify what it renders. If you want complete control over the UI, use the `useSwitchboard` and `useSwitchboardState` hooks instead of the `Switchboard` component.

## API

### Components

- `Switchboard` - The main component that renders your app and the Switchboard UI.

### Hooks

- `useSwitchboard` - A hook that contains logic for running Switchboard. Useful to create a custom Switchboard UI.
- `useSwitchboardState` - A hook that contains the state of Switchboard. Useful to extend Switchboard's features with custom settings for your app, or if you want to create a custom Switchboard UI.

## FAQ

- **Why does `Switchboard` render my app?** If you configure Switchboard to force the app to throw an error, Switchboard continues to render so you can change Switchboard's settings.

- **What about lazy loading?** It's recommended to lazy load Switchboard. You can use `React.lazy` and `React.Suspense` to do this.
