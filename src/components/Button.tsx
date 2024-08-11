import cx from "clsx";
export interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  variant?: "primary" | "secondary" | "icon" | "expander";
}

export default function Button({
  className,
  variant = "primary",
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cx(
        className,
        "sb-border sb-border-slate-400 sb-p-1 sb-rounded",
        {
          "sb-bg-blue-600 sb-text-white": variant === "primary",
          "sb-bg-white sb-border-none sb-p-1 sb-inline-flex sb-items-center sb-justify-center sb-text-gray-400 sb-hover:text-gray-500 sb-hover:bg-gray-100":
            variant === "icon",
          "sb-absolute sb-inset-0 sb-border-none sb-inline-flex sb-items-center sb-justify-center sb-text-gray-400 sb-hover:text-gray-500 sb-hover:backdrop-brightness-90":
            variant === "expander",
        }
      )}
      {...rest}
    />
  );
}
