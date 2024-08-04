import { useRef } from "react";
import { CustomResponse, HttpSettings } from "./types/types";
import { useDevToolsState } from "./useDevToolsState";
import { useWorker } from "./useWorker";

export const httpDefaults = {
  delay: 0,
  status: 200,
  response: undefined,
};

export function useHttp<THandler, TCustomSettings>(
  httpSettings: HttpSettings,
  customSettings: TCustomSettings
) {
  const [delay, setDelay, delayChanged] = useDevToolsState(
    "delay",
    httpDefaults.delay
  );

  // Passing an empty ref since merely invoking here to get the array so we can display the list of handlers in DevTools.
  const requestHandlers = httpSettings.requestHandlers(useRef());

  const [customResponses, setCustomResponses] = useDevToolsState<
    CustomResponse<THandler>[]
  >("customResponses", []);

  const isReady = useWorker(httpSettings, {
    delay,
    setDelay,
    delayChanged,
    customResponses,
    setCustomResponses,
    ...customSettings,
  });

  return {
    isReady,
    delay,
    setDelay,
    delayChanged,
    requestHandlers,
    customResponses,
    setCustomResponses,
  };
}
