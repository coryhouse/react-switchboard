import { CustomResponse } from "./http.types";

export const switchboardPositions = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
] as const;

/** Union of Switchboard window positions */
export type Position = (typeof switchboardPositions)[number];

/** Setting defaults */
export interface SwitchboardDefaults {
  /** Set to true to enable closing Switchboard by clicking outside the window by default */
  closeViaOutsideClick: boolean;

  /** When true, close Switchboard when the escape key is pressed */
  closeViaEscapeKey?: boolean;

  /** The default delay for mock HTTP requests */
  delay: number;

  /** The default window position */
  position: Position;

  /** Set to true to open Switchboard by default */
  openByDefault: boolean;
}

export interface SwitchboardConfig {
  /** Set to true to open the DevTools window by default */
  openByDefault: boolean;

  /** Switchboard window position */
  position: Position;

  /** Global HTTP delay */
  delay: number;

  /** Array of custom responses */
  customResponses: CustomResponse[];
}
