import { RequestHandler } from "msw";
import { StartOptions } from "msw/browser";

export type CustomResponse = {
  /** Response handler name */
  handler: string;

  /** Delay the response by a specified number of milliseconds. */
  delay?: number;

  /** HTTP status code to return for this call */
  status?: number;

  /** Optional response. */
  response?: string;
};

/** Base type for RequestHandler config */
export interface RequestHandlerConfigBase {
  /** Global HTTP delay */
  delay: number;

  /** Array of custom responses */
  customResponses: CustomResponse[];
}

export type HttpSettings = {
  /** A function that accepts custom settings and returns an array of Mock Service Worker request handlers */
  // TODO: Eliminate any use here.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  requestHandlers: (configRef: React.MutableRefObject<any>) => RequestHandler[];

  /** Optional Mock Service worker start options */
  startOptions?: StartOptions;
};
