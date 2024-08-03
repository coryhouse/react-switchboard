import clsx from "clsx";
import Label from "./Label";

interface SelectProps extends React.ComponentPropsWithoutRef<"select"> {
  /** Set to true to highlight the label so that it is visually marked as changed from the default. */
  changed?: boolean;

  /** Input label */
  label: string;

  /** Specify select's width */
  width?: "full" | "default";
}

export default function Select(props: SelectProps) {
  const {
    id,
    onChange,
    width = "default",
    changed = false,
    label,
    value,
    ...rest
  } = props;
  return (
    <>
      <Label className="block" htmlFor={id}>
        {label}
      </Label>
      <select
        className={clsx("border-slate-400 border-solid border p-1 rounded", {
          "bg-yellow-100": changed,
          "w-full": width === "full",
        })}
        id={id}
        value={value}
        onChange={onChange}
        {...rest}
      />
    </>
  );
}
