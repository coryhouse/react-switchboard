import * as React from "react";
import Field from "./components/Field";
import Select from "./components/Select";
import CopySettingsButton from "./components/CopySettingsButton";
import Button from "./components/Button";
import { Position } from "./switchboard.types";
import Checkbox from "./components/Checkbox";
import { getLocalStorageSwitchboardKeys } from "./localStorage.utils";
import { GeneralSettings } from "./useSwitchboard";

interface GeneralSettingsProps {
  settings: GeneralSettings;
  copySettingsUrlToClipboard: () => void;
}

export default function GeneralSettings({
  settings,
  copySettingsUrlToClipboard,
}: Readonly<GeneralSettingsProps>) {
  const {
    position,
    setPosition,
    openByDefault,
    setOpenByDefault,
    closeViaOutsideClick,
    setCloseViaOutsideClick,
    closeViaEscapeKey,
    setCloseViaEscapeKey,
  } = settings;

  return (
    <details className="sb-mt-4" open>
      <summary className="sb-mt-4 sb-font-bold">General</summary>

      <Field>
        <Select
          width="full"
          label="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value as Position)}
        >
          <option value="sb-top-left">Top left</option>
          <option value="sb-top-right">Top Right</option>
          <option value="sb-bottom-left">Bottom left</option>
          <option value="sb-bottom-right">Bottom right</option>
        </Select>
      </Field>

      <Field>
        <Checkbox
          id="openByDefault"
          label="Open by default"
          onChange={() => setOpenByDefault(!openByDefault)}
          checked={openByDefault}
        />
      </Field>

      <Field>
        <Checkbox
          id="closeViaEscapeKey"
          label="Close via escape key"
          onChange={() => setCloseViaEscapeKey(!closeViaEscapeKey)}
          checked={closeViaEscapeKey}
        />
      </Field>

      <Field>
        <Checkbox
          id="closeViaOutsideClick"
          label="Close via outside click"
          onChange={() => {
            setCloseViaOutsideClick(!closeViaOutsideClick);
          }}
          checked={closeViaOutsideClick}
        />
      </Field>

      <div className="sb-flex sb-flex-row">
        <Field>
          <CopySettingsButton
            className="sb-mr-2 sb-w-32"
            onClick={copySettingsUrlToClipboard}
          />
        </Field>

        <Field>
          <Button
            className="sb-mr-2"
            onClick={() => {
              const switchboardKeys = getLocalStorageSwitchboardKeys();
              // Remove Switchboard settings from localStorage and reload
              switchboardKeys.forEach((key) => localStorage.removeItem(key));
              window.location.reload();
            }}
          >
            Clear Settings
          </Button>
        </Field>
      </div>
    </details>
  );
}
