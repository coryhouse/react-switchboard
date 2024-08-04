import { RequestHandler } from "msw";
import { StartOptions } from "msw/browser";

export type HttpSettings = {
  /** A function that accepts custom settings and returns an array of Mock Service Worker request handlers */
  // TODO: Eliminate any use here.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  requestHandlers: (configRef: React.MutableRefObject<any>) => RequestHandler[];

  /** Optional Mock Service worker start options */
  startOptions?: StartOptions;
};

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

export interface DevToolsConfigBase<THandler> {
  /** Set to true to open the DevTools window by default */
  openByDefault: boolean;

  /** DevTools window position */
  position: DevToolsPosition;

  /** Global HTTP delay */
  delay: number;

  /** Array of custom responses */
  customResponses: CustomResponse<THandler>[];
}

export type CustomResponse<THandler> = {
  /** Response handler name */
  handler: THandler;

  /** Delay the response by a specified number of milliseconds. */
  delay?: number;

  /** HTTP status code to return for this call */
  status?: number;

  /** Optional response. */
  response?: string;
};

/** Base type for RequestHandler config */
export interface RequestHandlerConfigBase<THandler> {
  /** Global HTTP delay */
  delay: number;

  /** Array of custom responses */
  customResponses: CustomResponse<THandler>[];
}
