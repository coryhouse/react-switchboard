import HttpCustomResponseForm from "./components/HttpCustomResponseForm";
import Field from "./components/Field";
import Input from "./components/Input";
import Select from "./components/Select";
import { MswSettings } from "./http.types";
import { httpDefaults, useHttp } from "./useHttp";

type HttpProps = {
  mswSettings: MswSettings;
};

export function Http({ mswSettings }: HttpProps) {
  const {
    delay,
    setDelay,
    delayChanged,
    customResponses,
    setCustomResponses,
    requestHandlers,
  } = useHttp(mswSettings);

  return (
    <details open>
      <summary className="mt-4 font-bold">HTTP</summary>
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
