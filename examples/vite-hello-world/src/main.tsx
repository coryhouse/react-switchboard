import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "react-switchboard/dist/index.css";
import "./index.css";

const Switchboard = lazy(() => import("react-switchboard"));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {import.meta.env.DEV ? (
      <Suspense fallback="Loading Switchboard...">
        <Switchboard appSlot={<App />} />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>
);
