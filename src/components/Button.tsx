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
      className={cx(className, "border border-slate-400 p-1 rounded", {
        "bg-blue-600 text-white": variant === "primary",
        "bg-white border-none p-1 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100":
          variant === "icon",
        "absolute inset-0 border-none inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:backdrop-brightness-90":
          variant === "expander",
      })}
      {...rest}
    />
  );
}
