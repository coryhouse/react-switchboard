import Button, { ButtonProps } from "./Button";
import cx from "clsx";

export default function CloseButton(props: ButtonProps) {
  const { className, ...rest } = props;
  return (
    <Button
      className={cx(
        "bg-white border-none p-1 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100",
        className
      )}
      {...rest}
    >
      <span className="sr-only">Copy settings to URL</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
    </Button>
  );
}
