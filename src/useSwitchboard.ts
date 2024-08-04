import { useState, useRef } from "react";
import useKeypress from "react-use-keypress";
import useOutsideClick from "./useOutsideClick";
import { buildUrl } from "./urlUtils";
import {
  DevToolsPosition,
  DevToolsDefaults,
  DevToolsConfigBase,
} from "./types/types";
import { writeToClipboard } from "./clipboardUtils";
import { useDevToolsState } from "./useDevToolsState";

const maxUrlLength = 2000;

interface KeyboardShortcut {
  key: string | string[];
  alt?: boolean;
  ctrl?: boolean;
}

export interface UseSwitchboardArgs {
  /** Override the built in setting defaults */
  defaults?: Partial<DevToolsDefaults>;

  /** Specify a keyboard shortcut that toggles the window open/closed */
  openKeyboardShortcut?: KeyboardShortcut;
}

/** This component is useful to display custom devtools settings for your project */
export function useSwitchboard({
  openKeyboardShortcut,
  ...rest
}: UseSwitchboardArgs) {
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

  const [position, setPosition] = useDevToolsState<DevToolsPosition>(
    "position",
    defaults.position
  );

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
    // if (customResponses.length > 0) urlConfig.customResponses = customResponses;
    return urlConfig;
  }

  // Build a URL that contains a querystring key/value pair for each populated property in the provided config. By convention, each property name is mapped to the querystring's key.
  function buildUrl<TDevToolsConfig>(
    baseUrl: string,
    config: Partial<TDevToolsConfig>
  ) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(config)) {
      params.append(key, JSON.stringify(value));
    }
    return baseUrl + "?" + params.toString();
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

  const hasAppBehaviorChanges = delay !== defaults.delay; // || customResponses.length > 0;

  return {
    isOpen,
    setIsOpen,
    position,
    setPosition,
    openByDefault,
    setOpenByDefault,
    hasAppBehaviorChanges,
    closeViaOutsideClick,
    setCloseViaOutsideClick,
    closeViaEscapeKey,
    setCloseViaEscapeKey,
    copyDevToolsSettingsUrlToClipboard,
    devToolsWindowRef,
  };
}
