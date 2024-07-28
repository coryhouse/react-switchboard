import React, { useState, useRef, ComponentType } from "react";
import useKeypress from "react-use-keypress";
import useOutsideClick from "./useOutsideClick";
import { buildUrl } from "./urlUtils";
import {
  CustomResponse,
  HttpSettings,
  DevToolsPosition,
  DevToolsDefaults,
  DevToolsConfigBase,
} from "./types/types";
import { writeToClipboard } from "./clipboardUtils";
import { useDevToolsState } from "./useDevToolsState";
import { useWorker } from "./useWorker";
import { FallbackProps } from "react-error-boundary";

const maxUrlLength = 2000;

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

/** Render devtools, and render your app as a child */
interface DevToolsProps<TCustomSettings> {
  /** The app to render */
  appSlot: React.ReactNode;

  /** CSS to apply to the root element. */
  className?: string;

  /** Values for custom settings specified by the user. These values are passed to the mock API. */
  customSettings: TCustomSettings;

  /** Specify optional default values for various settings */
  defaults?: Partial<DevToolsDefaults>;

  /** HTTP settings for mock APIs and HTTP delays */
  httpSettings: HttpSettings;

  /** Specify a keyboard shortcut that toggles the window open/closed */
  openKeyboardShortcut?: KeyboardShortcut;

  /** Optional custom content and settings to render inside the devtools */
  children?: React.ReactNode;

  /** Component to render when an error occurs in the app root. **/
  ErrorFallback: ComponentType<FallbackProps>;
}

/** This component is useful to display custom devtools settings for your project */
export default function useSwitchboard<TCustomSettings, THandler>({
  appSlot,
  children,
  httpSettings,
  customSettings,
  openKeyboardShortcut,
  className,
  ErrorFallback,
  ...rest
}: DevToolsProps<TCustomSettings>) {
  // Passing an empty ref since merely invoking here to get the array so we can display the list of handlers in DevTools.
  const requestHandlers = httpSettings.requestHandlers(useRef());

  const defaults = getDefaults();
  // These settings use the useDevToolsState hook so that the settings persist in localStorage and are optionally initialized via the URL
  const [openByDefault, setOpenByDefault] = useDevToolsState(
    "openByDefault",
    defaults.openByDefault
  );

  const [isOpen, setIsOpen] = useState(openByDefault);

  const [closeViaOutsideClick, setCloseViaOutsideClick] = useDevToolsState(
    "closeViaOutsideClick",
    defaults.closeViaOutsideClick
  );

  const [closeViaEscapeKey, setCloseViaEscapeKey] = useDevToolsState(
    "closeViaEscapeKey",
    defaults.closeViaEscapeKey
  );

  const [delay, setDelay, delayChanged] = useDevToolsState(
    "delay",
    defaults.delay
  );

  const [position, setPosition] = useDevToolsState<DevToolsPosition>(
    "position",
    defaults.position
  );

  const [customResponses, setCustomResponses] = useDevToolsState<
    CustomResponse<THandler>[]
  >("customResponses", []);

  const devToolsWindowRef = useRef<HTMLDivElement>(null);

  // Returns defaults that fallback to hard-coded defaults if the user doesn't specify a preference.
  // Note that these defaults only apply if the URL and localStorage don't specify a preference.
  function getDefaults() {
    const defaults: DevToolsDefaults = {
      closeViaOutsideClick: rest.defaults?.closeViaOutsideClick ?? false,
      closeViaEscapeKey: rest.defaults?.closeViaEscapeKey ?? true,
      delay: rest.defaults?.delay ?? 0,
      openByDefault: rest.defaults?.openByDefault ?? true,
      position: rest.defaults?.position ?? "top-left",
    };
    return defaults;
  }

  useKeypress("Escape", () => {
    if (closeViaEscapeKey) setIsOpen(false);
  });

  useKeypress(openKeyboardShortcut ? openKeyboardShortcut.key : [], (e) => {
    if (openKeyboardShortcut?.alt && !e.altKey) return;
    if (openKeyboardShortcut?.ctrl && !e.ctrlKey) return;
    setIsOpen((current) => !current);
  });

  useOutsideClick(devToolsWindowRef, () => {
    if (closeViaOutsideClick) setIsOpen(false);
  });

  // Only copy settings to the URL that have been changed from the default.
  // This keeps the URL as short as possible.
  function getChangedSettings() {
    const urlConfig: Partial<DevToolsConfigBase<THandler>> = {};
    if (defaults.position !== position) urlConfig.position = position;
    if (defaults.openByDefault !== openByDefault) {
      urlConfig.openByDefault = openByDefault;
    }
    if (defaults.delay != delay) urlConfig.delay = delay;
    if (customResponses.length > 0) urlConfig.customResponses = customResponses;
    return urlConfig;
  }

  async function copyDevToolsSettingsUrlToClipboard() {
    const urlConfig = getChangedSettings();
    const url = buildUrl(window.location.href, {
      ...urlConfig,
      ...customSettings,
    });
    try {
      await writeToClipboard(url);
      if (url.length > maxUrlLength) {
        alert(
          `Warning: The URL copied to your clipboard may not work in all browsers because it's over ${maxUrlLength} characters. To reduce the length, consider redesigning your settings state to store identifiers (such as recordId=1) instead of specifying raw data.`
        );
      }
    } catch (err) {
      () => alert("Failed to copy settings URL to clipboard");
    }
  }

  const isReady = useWorker(httpSettings, {
    delay,
    customResponses,
    ...customSettings,
  });

  const hasAppBehaviorChanges =
    delay !== defaults.delay || customResponses.length > 0;

  return {
    isOpen,
    setIsOpen,
    delay,
    setDelay,
    delayChanged,
    position,
    setPosition,
    isReady,
    hasAppBehaviorChanges,
    copyDevToolsSettingsUrlToClipboard,
  };
}
