# React Switchboard 🎛

Quickly create custom DevTools for your React app.

[Demo](https://switchboard-beta.vercel.app/) 🚀

## Quick Start

```
npm install react-switchboard
```

Call `Switchboard` in your project root. Pass your app's main component to the `appSlot` prop.

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Switchboard } from "react-switchboard";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<Switchboard appSlot={<App />} />);
```
