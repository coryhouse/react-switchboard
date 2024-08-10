import * as React from "react";
import Field from "./components/Field";
import Select from "./components/Select";
import CopySettingsButton from "./components/CopySettingsButton";
import Button from "./components/Button";
import { useSwitchboard } from "./useSwitchboard";
import { Position } from "./switchboard.types";
import Checkbox from "./components/Checkbox";

export default function GeneralSettings() {
  const {
    position,
    setPosition,
    closeViaEscapeKey,
    setCloseViaEscapeKey,
    openByDefault,
    setOpenByDefault,
    closeViaOutsideClick,
    setCloseViaOutsideClick,
    copySettingsUrlToClipboard,
  } = useSwitchboard({});

  return (
    <details className="mt-4" open>
      <summary className="mt-4 font-bold">General</summary>

      <Field>
        <Select
          width="full"
          label="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value as Position)}
        >
          <option value="top-left">Top left</option>
          <option value="top-right">Top Right</option>
          <option value="bottom-left">Bottom left</option>
          <option value="bottom-right">Bottom right</option>
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

      <div className="flex flex-row">
        <Field>
          <CopySettingsButton
            className="mr-2 w-32"
            onClick={copySettingsUrlToClipboard}
          />
        </Field>

        <Field>
          <Button
            className="mr-2"
            onClick={() => {
              // TODO: Only clear devtools-related localStorage.
              localStorage.clear();
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
