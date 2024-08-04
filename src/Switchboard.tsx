import React, { ComponentType } from "react";
import cx from "clsx";
import CloseButton from "./components/CloseButton";
import OpenButton from "./components/OpenButton";
import { HttpSettings, DevToolsDefaults } from "./types/types";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import GeneralSettings from "./GeneralSettings";
import { useSwitchboard } from "./useSwitchboard";
import { Http } from "./Http";

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

interface SwitchboardProps {
  /** The app to render */
  appSlot: React.ReactNode;

  /** CSS to apply to the root element. */
  className?: string;

  /** Specify optional default values for various settings */
  defaults?: Partial<DevToolsDefaults>;

  /** HTTP settings for mock APIs and HTTP delays */
  httpSettings: HttpSettings;

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
  httpSettings,
  openKeyboardShortcut,
  ErrorFallback,
  className,
  ...rest
}: SwitchboardProps) {
  const {
    isOpen,
    setIsOpen,
    position,
    // customResponses,
    // setCustomResponses,
    // requestHandlers,
    hasAppBehaviorChanges,
    devToolsWindowRef,
  } = useSwitchboard({});
  return (
    <>
      {/* Wrap app in ErrorBoundary so DevTools continue to display upon error */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {/* Passing a key to force the app to completely reinitialize when the userId changes. */}
        {appSlot}
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
            <div className="flex flex-row-reverse">
              <CloseButton
                aria-label="Close DevTools"
                onClick={() => setIsOpen(!isOpen)}
              />
            </div>
            {children}

            <Http />
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
