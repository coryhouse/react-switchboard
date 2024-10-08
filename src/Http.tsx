import HttpCustomResponseForm from "./components/HttpCustomResponseForm";
import Field from "./components/Field";
import Input from "./components/Input";
import Select from "./components/Select";
import { httpDefaults, HttpSettings } from "./useSwitchboard";
import { RequestHandler } from "msw";

type HttpProps = {
  httpSettings: HttpSettings;
  requestHandlers: RequestHandler[];
};

export function Http({ httpSettings, requestHandlers }: Readonly<HttpProps>) {
  const { delay, setDelay, delayChanged, customResponses, setCustomResponses } =
    httpSettings;

  return (
    <details open>
      <summary className="sb-mt-4 sb-font-bold">HTTP</summary>
      <Field>
        <Input
          id="globalDelay"
          width="full"
          changed={delayChanged}
          type="number"
          label="Global Delay"
          value={delay}
          onChange={(e) => setDelay(parseInt(e.target.value))}
        />
      </Field>

      <Field>
        <Select
          width="full"
          label="Customize Request Handler"
          // Value need not change since the selected value disappears once selected.
          value=""
          onChange={(e) => {
            setCustomResponses([
              ...customResponses,
              {
                handler: e.target.value,
                delay: httpDefaults.delay,
                status: httpDefaults.status,
                response: httpDefaults.response,
              },
            ]);
          }}
        >
          <option>Select Handler</option>
          {requestHandlers
            // Filter out handlers that are already customized
            .filter(
              (rh) => !customResponses.some((r) => r.handler === rh.info.header)
            )
            .sort((a, b) => a.info.header.localeCompare(b.info.header))
            .map((rh) => (
              <option key={rh.info.header}>{rh.info.header}</option>
            ))}
        </Select>
      </Field>

      {customResponses.map((setting) => (
        <HttpCustomResponseForm
          key={setting.handler}
          customResponse={setting}
          setCustomResponses={setCustomResponses}
        />
      ))}
    </details>
  );
}
