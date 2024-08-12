import { CustomResponse } from "../http.types";
import DeleteButton from "./DeleteButton";
import Input from "./Input";

export const customResponseDefaults = {
  delay: 0,
  status: 200,
  response: undefined,
};

type CustomResponseFormProps = {
  customResponse: CustomResponse;
  setCustomResponses: React.Dispatch<React.SetStateAction<CustomResponse[]>>;
};

export default function HttpCustomResponseForm({
  customResponse,
  setCustomResponses,
}: Readonly<CustomResponseFormProps>) {
  const { handler, delay, status, response } = customResponse;

  // TODO: Support all response properties: https://mswjs.io/docs/api/response#properties
  return (
    <fieldset className="sb-mt-4 sb-border sb-p-2">
      <legend>
        {handler}{" "}
        <DeleteButton
          onClick={() =>
            setCustomResponses((r) => r.filter((e) => e.handler !== handler))
          }
        />
      </legend>
      <div className="sb-flex sb-flex-row">
        <Input
          id={`${handler}-delay`}
          type="number"
          changed={delay !== customResponseDefaults.delay}
          label="Delay"
          className="sb-w-20 sb-mr-4"
          value={delay}
          onChange={(e) =>
            setCustomResponses((r) =>
              r.map((s) =>
                s.handler === handler
                  ? {
                      ...s,
                      delay: parseInt(e.target.value),
                    }
                  : s
              )
            )
          }
        />

        <Input
          id={`${handler}-status`}
          type="number"
          changed={status !== customResponseDefaults.status}
          label="Status"
          className="sb-w-20 sb-mr-4"
          value={status}
          onChange={(e) =>
            setCustomResponses((r) =>
              r.map((s) =>
                s.handler === handler
                  ? {
                      ...s,
                      status: parseInt(e.target.value),
                    }
                  : s
              )
            )
          }
        />

        <Input
          id={`${handler}-custom-response`}
          type="text"
          changed={response !== customResponseDefaults.response}
          label="Response"
          className="sb-w-20"
          value={response}
          placeholder="Default"
          onChange={(e) =>
            setCustomResponses((r) =>
              r.map((s) =>
                s.handler === handler
                  ? {
                      ...s,
                      response: e.target.value,
                    }
                  : s
              )
            )
          }
        />
      </div>
    </fieldset>
  );
}
