import { useEffect } from "react";
import { setupWorker } from "msw/browser";
import { SwitchboardMswSettings } from "./Switchboard";

/** Configure msw */
export function useHttp(
  setIsReady: () => void,
  mswSettings?: SwitchboardMswSettings
) {
  useEffect(() => {
    if (!mswSettings) {
      setIsReady();
      return;
    }
    const setup = async () => {
      const worker = setupWorker(...mswSettings.requestHandlers());
      await worker.start(mswSettings.startOptions);
      setIsReady();
    };
    setup();
  }, []);

  return {
    requestHandlers: mswSettings?.requestHandlers(),
  };
}
