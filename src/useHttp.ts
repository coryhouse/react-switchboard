import { useEffect, useRef } from "react";
import { useSwitchboardState } from "./useSwitchboardState";
import { SetupWorker, setupWorker } from "msw/browser";
import { CustomResponse } from "./http.types";
import { SwitchboardMswSettings } from "./Switchboard";

export const httpDefaults = {
  delay: 0,
  status: 200,
  response: undefined,
};

/** Configure msw */
export function useHttp(
  mswSettings: SwitchboardMswSettings,
  setIsReady: () => void
) {
  const [delay, setDelay, delayChanged] = useSwitchboardState(
    "sb-delay",
    httpDefaults.delay
  );

  const configRef = useRef(mswSettings);

  // Passing an empty ref since merely invoking here to get the array so we can display the list of handlers in DevTools.
  const requestHandlers = mswSettings.requestHandlers(useRef());

  const [customResponses, setCustomResponses] = useSwitchboardState<
    CustomResponse[]
  >("sb-customResponses", []);

  // Store mswSettings in a ref so the useEffect below that starts the worker runs only once, yet reads the latest config value as they change in the devtools.
  useEffect(() => {
    configRef.current = mswSettings;
  }, [mswSettings]);

  useEffect(() => {
    const worker = setupWorker(...mswSettings.requestHandlers(configRef));

    const startWorker = async (worker: SetupWorker) => {
      await worker.start(mswSettings.startOptions);
      setIsReady();
    };

    startWorker(worker);
  }, []);

  return {
    delay,
    setDelay,
    delayChanged,
    requestHandlers,
    customResponses,
    setCustomResponses,
  };
}
