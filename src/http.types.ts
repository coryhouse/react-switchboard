import { RequestHandler } from "msw";
import { StartOptions } from "msw/browser";

export interface CustomResponse {
  /** Response handler name */
  handler: string;

  /** Delay the response by a specified number of milliseconds. */
  delay?: number;

  /** HTTP status code to return for this call */
  status?: number;

  /** Optional response. */
  response?: string;
}

export interface MswSettings {
  /** A function that accepts custom settings and returns an array of Mock Service Worker request handlers */
  // TODO: Eliminate any use here.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  requestHandlers: (configRef: React.MutableRefObject<any>) => RequestHandler[];

  /** Optional Mock Service worker start options */
  startOptions?: StartOptions;

  /** Global delay in milliseconds */
  delay?: number;

  /** Array of custom responses */
  customResponses: CustomResponse[];
}
