import React, { ComponentType, useState } from "react";
import cx from "clsx";
import CloseButton from "./components/CloseButton";
import OpenButton from "./components/OpenButton";
import { SwitchboardDefaults } from "./switchboard.types";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import GeneralSettings from "./GeneralSettings";
import { useSwitchboard } from "./useSwitchboard";
import { Http } from "./Http";
import { RequestHandler } from "msw";
import { StartOptions } from "msw/browser";
import "./index.css";
import DefaultErrorFallback from "./ErrorFallback";

export const customResponseDefaults = {
  delay: 0,
  status: 200,
  response: undefined,
};

interface KeyboardShortcut {
  key: string | string[];
  alt?: boolean;
  ctrl?: boolean;
}

export interface SwitchboardMswSettings {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  requestHandlers: (configRef: React.MutableRefObject<any>) => RequestHandler[];

  /** Optional Mock Service worker start options */
  startOptions?: StartOptions;
}

interface SwitchboardProps {
  /** The app to render */
  appSlot: React.ReactNode;

  /** CSS to apply to the root element. */
  className?: string;

  /** Specify optional default values for various settings */
  defaults?: Partial<SwitchboardDefaults>;

  /** Configure Mock Service Worker request handlers. */
  mswSettings?: SwitchboardMswSettings;

  /** Specify a keyboard shortcut that toggles the window open/closed */
  openKeyboardShortcut?: KeyboardShortcut;

  /** Custom content and settings to render inside the devtools */
  children: React.ReactNode;

  /** Error react-error-boundary fallback component to render if the app's top-level error boundary is hit. If omitted, Switchboard's default error fallback is used. */
  ErrorFallback?: ComponentType<FallbackProps>;
}

/** Display custom devtools settings for your project */
export function Switchboard({
  appSlot,
  children,
  mswSettings,
  openKeyboardShortcut,
  ErrorFallback,
  className,
  defaults,
}: Readonly<SwitchboardProps>) {
  const [isReady, setIsReady] = useState(false);
  const { isOpen, setIsOpen, position, devToolsWindowRef } = useSwitchboard({
    openKeyboardShortcut,
    overriddenDefaults: defaults,
  });

  // TODO: Reimplement
  const hasAppBehaviorChanges = false;

  return (
    <>
      {/* Wrap app in ErrorBoundary so Switchboard continues to display even if the app errors */}
      <ErrorBoundary FallbackComponent={ErrorFallback ?? DefaultErrorFallback}>
        {isReady ? appSlot : <p>Initializing msw...</p>}
      </ErrorBoundary>

      <section
        ref={devToolsWindowRef}
        className={cx(
          "sb-fixed sb-p-4 sb-border sb-shadow-xl sb-max-h-screen sb-overflow-auto sb-bg-white sb-opacity-90",
          {
            "sb-w-16 sb-h-16": !isOpen,
            "sb-bg-yellow-100": !isOpen && hasAppBehaviorChanges,
            "sb-bottom-0": position.includes("bottom"),
            "sb-top-0": position.includes("top"),
            "sb-right-0": position.includes("right"),
            "sb-left-0": position.includes("left"),
          },
          className
        )}
      >
        {isOpen ? (
          <>
            <CloseButton
              aria-label="Close DevTools"
              onClick={() => setIsOpen(!isOpen)}
            />
            {children}

            {mswSettings && (
              <Http
                mswSettings={mswSettings}
                setIsReady={() => setIsReady(true)}
              />
            )}
            <GeneralSettings />
          </>
        ) : (
          <OpenButton
            aria-label="Open DevTools"
            onClick={() => setIsOpen(!isOpen)}
          />
        )}
      </section>
    </>
  );
}
