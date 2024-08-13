# React Switchboard 🎛

Quickly create custom DevTools for your React app.

- [Live Demo](https://switchboard-beta.vercel.app/) 🚀
- [Demo repo using Vite](https://github.com/coryhouse/switchboard-with-vite-demo)

## Quick Start

```
npm install react-switchboard -D
```

### Vite Example

Call `Switchboard` in your project root. Pass your app's main component to `Switchboard's` `appSlot` prop. Import `Switchboard` CSS. Lazy load `Switchboard` via an environment variable so it's excluded from your production bundle.

```tsx
import { lazy } from "react";
import { createRoot } from "react-dom/client";
import "react-switchboard/dist/index.css";

const Switchboard = lazy(() => import("react-switchboard"));

createRoot(document.getElementById("root")!).render(
  import.meta.env.VITE_ENABLE_SWITCHBOARD === "Y" ? (
    <Suspense fallback="Loading Switchboard...">
      <Switchboard appSlot={<App />} />
    </Suspense>
  ) : (
    <App />
  )
);
```

Tweak Vite's dev npm script to set the environment variable:

```bash
"dev": "cross-env VITE_ENABLE_SWITCHBOARD=Y vite",
```

## Headless

The `Switchboard` component accepts children so you can specify what it renders. If you want complete control over the UI, use the `useSwitchboard` and `useSwitchboardState` hooks instead of the `Switchboard` component.

```tsx
function CustomSwitchboard() {
  const { generalSettings, switchboardWindowRef, copySettingsUrlToClipboard } =
    useSwitchboard();

  // Use useSwitchboardState hook for custom settings.
  const [user, setUser] = useSwitchboardState("sb-user", null);

  return {
    /* Your custom JSX to render your desired UI */
  };
}
```

## Why Switchboard?

Code faster.
Reproduce edge cases.
Do real-time demos.
Use Switchboard to configure automated tests.

### Common Uses

- Login / switch users instantly
- Change feature toggles
- Configure mock APIs
- Force errors
- Simulate network slowness for specific requests
- Configure automated test scenarios
- Simulate incoming traffic and write conflicts

More info in this 25 minute conference talk: [Creating Custom Dev Tools for Your React App at React Rally](https://www.youtube.com/live/DGG6xpllTiE?si=vq7z35p3V_2ce68H&t=24527)

## API

### Components

- `Switchboard` - The main component that renders your app and the Switchboard UI.

### Hooks

- `useSwitchboard` - Logic for running Switchboard. Useful to create a custom Switchboard UI.
- `useSwitchboardState` - Declare Switchboard state. This state is automatically initialized from the URL, and written to localStorage so that it persists between sessions. Useful to extend Switchboard's features with custom settings for your app, or if you want to create a custom Switchboard UI.

## FAQ

- **How does mocking work?** Switchboard intercepts fetch requests via [Mock Service Worker](https://mswjs.io/), and displays a UI for configuring the mock responses.
- **Why does `Switchboard` render my app?** If you configure Switchboard to force the app to throw an error, Switchboard continues to render so you can change Switchboard's settings.

- **Why lazy loading?** Lazy load `Switchboard` via `React.lazy` and `Suspense` so that it's excluded your app's prod bundle.

## Acknowledgements

- [Mock Service Worker](https://mswjs.io/) - Switchboard mocks HTTP requests via msw.

## Inspiration

- [React Query Devtools](http://react-query.tanstack.com/devtools)
- [https://github.com/dataarts/dat.gui](https://github.com/dataarts/dat.gui?tab=readme-ov-file)
