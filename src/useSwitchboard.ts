import { useState, useRef } from "react";
import useKeypress from "react-use-keypress";
import useOutsideClick from "./useOutsideClick";
import { Position, SwitchboardDefaults } from "./switchboard.types";
import { writeToClipboard } from "./clipboardUtils";
import { useSwitchboardState } from "./useSwitchboardState";
import { getLocalStorageSwitchboardKeys } from "./localStorage.utils";

const maxUrlLength = 2000;

interface KeyboardShortcut {
  key: string | string[];
  alt?: boolean;
  ctrl?: boolean;
}

export interface GeneralSettings {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  position: Position;
  setPosition: (position: Position) => void;
  openByDefault: boolean;
  setOpenByDefault: (openByDefault: boolean) => void;
  closeViaOutsideClick: boolean;
  setCloseViaOutsideClick: (closeViaOutsideClick: boolean) => void;
  closeViaEscapeKey: boolean;
  setCloseViaEscapeKey: (closeViaEscapeKey: boolean) => void;
}

interface UseSwitchboardArgs {
  /** Override the built in setting defaults */
  overriddenDefaults?: Partial<SwitchboardDefaults>;

  /** Specify a keyboard shortcut that toggles the window open/closed */
  openKeyboardShortcut?: KeyboardShortcut;
}

/** This component is useful to display custom devtools settings for your project */
export function useSwitchboard({
  openKeyboardShortcut,
  overriddenDefaults,
}: UseSwitchboardArgs | undefined = {}) {
  // These settings use the useSwitchboardState hook so that the settings persist in localStorage and are optionally initialized via the URL
  const [openByDefault, setOpenByDefault] = useSwitchboardState(
    "sb-openByDefault",
    overriddenDefaults?.openByDefault ?? true
  );

  const [isOpen, setIsOpen] = useState(openByDefault);

  const [closeViaOutsideClick, setCloseViaOutsideClick] = useSwitchboardState(
    "sb-closeViaOutsideClick",
    overriddenDefaults?.closeViaOutsideClick ?? false
  );

  const [closeViaEscapeKey, setCloseViaEscapeKey] = useSwitchboardState(
    "sb-closeViaEscapeKey",
    overriddenDefaults?.closeViaEscapeKey ?? true
  );

  const [position, setPosition] = useSwitchboardState(
    "sb-position",
    overriddenDefaults?.position ?? "top-left"
  );

  const switchboardWindowRef = useRef<HTMLDivElement>(null);

  useKeypress("Escape", () => {
    if (closeViaEscapeKey) setIsOpen(false);
  });

  useKeypress(openKeyboardShortcut ? openKeyboardShortcut.key : [], (e) => {
    if (openKeyboardShortcut?.alt && !e.altKey) return;
    if (openKeyboardShortcut?.ctrl && !e.ctrlKey) return;
    setIsOpen((current) => !current);
  });

  useOutsideClick(switchboardWindowRef, () => {
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

  const generalSettings: GeneralSettings = {
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
  };

  return {
    generalSettings,
    copySettingsUrlToClipboard,
    switchboardWindowRef,
  };
}
