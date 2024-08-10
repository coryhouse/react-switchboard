import React, { ComponentType, useState } from "react";
import cx from "clsx";
import CloseButton from "./components/CloseButton";
import OpenButton from "./components/OpenButton";
import { SwitchboardDefaults } from "./switchboard.types";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import GeneralSettings from "./GeneralSettings";
import { useSwitchboard } from "./useSwitchboard";
import { Http } from "./Http";
import "./switchboard.css";
import { RequestHandler } from "msw";
import { StartOptions } from "msw/browser";
import { SwitchboardContextProvider } from "./SwitchboardContext";

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

  /** Error fallback to render if the app crashes */
  ErrorFallback: ComponentType<FallbackProps>;
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
    <SwitchboardContextProvider>
      {/* Wrap app in ErrorBoundary so DevTools continue to display upon error */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {isReady ? appSlot : <p>Initializing msw...</p>}
      </ErrorBoundary>

      <section
        ref={devToolsWindowRef}
        className={cx(
          "fixed p-4 border shadow-xl max-h-screen overflow-auto bg-white opacity-90",
          {
            "w-16 h-16": !isOpen,
            "bg-yellow-100": !isOpen && hasAppBehaviorChanges,
            "bottom-0": position.includes("bottom"),
            "top-0": position.includes("top"),
            "right-0": position.includes("right"),
            "left-0": position.includes("left"),
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
    </SwitchboardContextProvider>
  );
}
