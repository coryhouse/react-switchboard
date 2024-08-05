import { useEffect, useRef, useState } from "react";
import { useDevToolsState } from "./useDevToolsState";
import { SetupWorker, setupWorker } from "msw/browser";
import { CustomResponse } from "./http.types";
import { SwitchboardMswSettings } from "./Switchboard";

export const httpDefaults = {
  delay: 0,
  status: 200,
  response: undefined,
};

/** Configure msw */
export function useHttp(mswSettings: SwitchboardMswSettings) {
  // TODO: Move to URL?
  const [delay, setDelay, delayChanged] = useDevToolsState(
    "delay",
    httpDefaults.delay
  );

  const configRef = useRef(mswSettings);
  const [isReady, setIsReady] = useState(false);

  // Passing an empty ref since merely invoking here to get the array so we can display the list of handlers in DevTools.
  const requestHandlers = mswSettings.requestHandlers(useRef());

  const [customResponses, setCustomResponses] = useDevToolsState<
    CustomResponse[]
  >("customResponses", []);

  // Store mswSettings in a ref so the useEffect below that starts the worker runs only once, yet reads the latest config value as they change in the devtools.
  useEffect(() => {
    configRef.current = mswSettings;
  }, [mswSettings]);

  useEffect(() => {
    const worker = setupWorker(...mswSettings.requestHandlers(configRef));

    const startWorker = async (worker: SetupWorker) => {
      await worker.start(mswSettings.startOptions);
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
