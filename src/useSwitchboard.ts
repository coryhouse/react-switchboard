import { useState, useRef } from "react";
import useKeypress from "react-use-keypress";
import useOutsideClick from "./useOutsideClick";
import {
  Position,
  SwitchboardDefaults,
  SwitchboardConfig,
} from "./switchboard.types";
import { writeToClipboard } from "./clipboardUtils";
import { useSwitchboardState } from "./useSwitchboardState";

const maxUrlLength = 2000;

interface KeyboardShortcut {
  key: string | string[];
  alt?: boolean;
  ctrl?: boolean;
}

export interface UseSwitchboardArgs {
  /** Override the built in setting defaults */
  overriddenDefaults?: Partial<SwitchboardDefaults>;

  /** Specify a keyboard shortcut that toggles the window open/closed */
  openKeyboardShortcut?: KeyboardShortcut;
}

/** This component is useful to display custom devtools settings for your project */
export function useSwitchboard({
  openKeyboardShortcut,
  overriddenDefaults,
}: UseSwitchboardArgs) {
  const defaults = getDefaults();
  // These settings use the useSwitchboardState hook so that the settings persist in localStorage and are optionally initialized via the URL
  const [openByDefault, setOpenByDefault] = useSwitchboardState(
    "sb-openByDefault",
    defaults.openByDefault
  );

  const [isOpen, setIsOpen] = useState(openByDefault);

  const [closeViaOutsideClick, setCloseViaOutsideClick] = useSwitchboardState(
    "sb-closeViaOutsideClick",
    defaults.closeViaOutsideClick
  );

  const [closeViaEscapeKey, setCloseViaEscapeKey] = useSwitchboardState(
    "sb-closeViaEscapeKey",
    defaults.closeViaEscapeKey
  );

  const [position, setPosition] = useSwitchboardState<Position>(
    "sb-position",
    defaults.position
  );

  const devToolsWindowRef = useRef<HTMLDivElement>(null);

  // Returns defaults that fallback to hard-coded defaults if the user doesn't specify a preference. These defaults apply if the URL and localStorage don't specify a preference.
  function getDefaults() {
    const defaults: SwitchboardDefaults = {
      closeViaOutsideClick: overriddenDefaults?.closeViaOutsideClick ?? false,
      closeViaEscapeKey: overriddenDefaults?.closeViaEscapeKey ?? true,
      delay: overriddenDefaults?.delay ?? 0,
      openByDefault: overriddenDefaults?.openByDefault ?? true,
      position: overriddenDefaults?.position ?? "top-left",
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

  // Convert the settings to URL search params
  function getSettingsAsQueryParams() {
    const switchboardKeys = getLocalStorageSwitchboardKeys();

    // Encode the settings into search params
    const params = new URLSearchParams();
    switchboardKeys.forEach((key) => {
      params.set(key, localStorage.getItem(key)!);
    });

    return "?" + params.toString();
  }

  async function copySettingsUrlToClipboard() {
    const url = window.location.href + getSettingsAsQueryParams();
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

  return {
    isOpen,
    setIsOpen,
    position,
    setPosition,
    openByDefault,
    setOpenByDefault,
    closeViaOutsideClick,
    setCloseViaOutsideClick,
    closeViaEscapeKey,
    setCloseViaEscapeKey,
    copySettingsUrlToClipboard,
    devToolsWindowRef,
  };
}
