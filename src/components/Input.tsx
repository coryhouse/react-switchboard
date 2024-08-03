import cx from "clsx";
import Label from "./Label";

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  /** Input ID - Specifying here so it's required by TypeScript */
  id: string;

  /** Input label */
  label: string;

  /** Set to true to highlight the label so that it is visually marked as changed from the default. */
  changed?: boolean;

  /** Specify input's width */
  width?: "full" | "default";
}

export default function Input(props: InputProps) {
  const {
    id,
    onChange,
    label,
    value,
    changed = false,
    className,
    width = "default",
    ...rest
  } = props;
  return (
    <span>
      <Label className="block" htmlFor={id}>
        {label}
      </Label>
      <input
        className={cx(
          "border-slate-400 border-solid border rounded p-1",
          { "bg-yellow-100": changed },
          { "w-full": width === "full" },
          className
        )}
        type="text"
        id={id}
        value={value}
        onChange={onChange}
        {...rest}
      />
    </span>
  );
}
