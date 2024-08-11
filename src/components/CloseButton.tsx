import Button, { ButtonProps } from "./Button";

export default function CloseButton(props: ButtonProps) {
  const { variant = "icon", ...rest } = props;
  return (
    <div className="sb-flex sb-flex-row-reverse">
      <Button variant={variant} {...rest}>
        <span className="sb-sr-only">Close menu</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="sb-h-6 sb-w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </Button>
    </div>
  );
}
