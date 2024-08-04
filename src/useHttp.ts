import { useEffect, useRef, useState } from "react";
import { CustomResponse, HttpSettings } from "./types/types";
import { useDevToolsState } from "./useDevToolsState";
import { SetupWorker, setupWorker } from "msw/browser";

export const httpDefaults = {
  delay: 0,
  status: 200,
  response: undefined,
};

export function useHttp<THandler, TCustomSettings>(
  httpSettings: HttpSettings,
  config: TCustomSettings
) {
  const [delay, setDelay, delayChanged] = useDevToolsState(
    "delay",
    httpDefaults.delay
  );

  const configRef = useRef(config);
  const [isReady, setIsReady] = useState(false);

  // Passing an empty ref since merely invoking here to get the array so we can display the list of handlers in DevTools.
  const requestHandlers = httpSettings.requestHandlers(useRef());

  const [customResponses, setCustomResponses] = useDevToolsState<
    CustomResponse<THandler>[]
  >("customResponses", []);

  // Store the config in a ref so the useEffect below that starts
  // the worker runs only once, yet reads the latest config values
  // as they change in the devtools.
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    const worker = setupWorker(...httpSettings.requestHandlers(configRef));

    const startWorker = async (worker: SetupWorker) => {
      await worker.start(httpSettings.startOptions);
      setIsReady(true);
    };

    startWorker(worker);
    // HACK: These dependencies need to be made stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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