import React, { ComponentType } from "react";
import Button from "./components/Button";
import cx from "clsx";
import CloseButton from "./components/CloseButton";
import OpenButton from "./components/OpenButton";
import Checkbox from "./components/Checkbox";
import Select from "./components/Select";
import Field from "./components/Field";
import {
  CustomResponse,
  HttpSettings,
  DevToolsPosition,
  DevToolsDefaults,
  DevToolsConfigBase,
} from "./types/types";
import Input from "./components/Input";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import HttpSettingForm from "./components/CustomResponseForm";
import CopySettingsButton from "./components/CopySettingsButton";
import GeneralSettings from "./GeneralSettings";
import { useSwitchboard } from "./useSwitchboard";

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
    delayChanged,
    delay,
    setDelay,
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
        // TODO: Support drag and drop position and resizing.
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

            <details open>
              <summary className="mt-4 font-bold">HTTP</summary>
              <Field>
                <Input
                  id="globalDelay"
                  width="full"
                  changed={delayChanged}
                  type="number"
                  label="Global Delay"
                  value={delay}
                  onChange={(e) => setDelay(parseInt(e.target.value))}
                />
              </Field>

              {/* <Field>
                <Select
                  width="full"
                  label="Customize Request Handler"
                  // Value need not change since the selected value disappears once selected.
                  value=""
                  onChange={(e) => {
                    setCustomResponses([
                      ...customResponses,
                      {
                        handler: e.target.value as Handler,
                        delay: customResponseDefaults.delay,
                        status: customResponseDefaults.status,
                        response: customResponseDefaults.response,
                      },
                    ]);
                  }}
                >
                  <option>Select Handler</option>
                  {requestHandlers
                    // Filter out handlers that are already customized
                    .filter(
                      (rh) =>
                        !customResponses.some(
                          (r) => r.handler === rh.info.header
                        )
                    )
                    .sort((a, b) => a.info.header.localeCompare(b.info.header))
                    .map((rh) => (
                      <option key={rh.info.header}>{rh.info.header}</option>
                    ))}
                </Select>
              </Field> */}

              {/* {customResponses.map((setting) => (
                <HttpSettingForm
                  key={setting.handler}
                  customResponse={setting}
                  setCustomResponses={setCustomResponses}
                />
              ))} */}
            </details>

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
