import { CustomResponse } from "./http.types";

export const devToolsPositions = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
] as const;

/** Union of devTools positions. */
export type DevToolsPosition = (typeof devToolsPositions)[number];

/** Setting defaults */
export type SwitchboardDefaults = {
  /** Set to true to enable closing DevTools by clicking outside the DevTools window by default */
  closeViaOutsideClick: boolean;

  /** When true, close the devtools window when the escape key is pressed */
  closeViaEscapeKey?: boolean;

  /** The default delay for mock HTTP requests */
  delay: number;

  /** The default DevTools window position */
  position: DevToolsPosition;

  /** Set to true to open the DevTools window by default */
  openByDefault: boolean;
};

export interface DevToolsConfigBase {
  /** Set to true to open the DevTools window by default */
  openByDefault: boolean;

  /** DevTools window position */
  position: DevToolsPosition;

  /** Global HTTP delay */
  delay: number;

  /** Array of custom responses */
  customResponses: CustomResponse[];
}
