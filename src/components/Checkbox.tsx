import { ReactNode } from "react";
import cx from "clsx";

interface CheckboxProps extends React.ComponentPropsWithoutRef<"input"> {
  /** Input label */
  label: ReactNode;

  /** Required for a11y */
  id: string;
}

export default function Checkbox(props: CheckboxProps) {
  const { id, onChange, checked, className, ...rest } = props;
  return (
    <span>
      <input
        className={cx(
          "border-slate-400 border-solid border p-1 rounded",
          className
        )}
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        {...rest}
      />
      <label className="ml-4" htmlFor={id}>
        {props.label}
      </label>
    </span>
  );
}
