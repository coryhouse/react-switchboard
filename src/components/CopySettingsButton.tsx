import { useState } from "react";
import Button from "./Button";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {}

const labelDefault = "Copy Settings";

const hideCopiedConfirmationAfterXMilliSeconds = 2000;

export default function CopySettingsButton({ onClick, ...rest }: ButtonProps) {
  const [label, setLabel] = useState(labelDefault);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    setLabel("Copied ✅");
    if (onClick) onClick(e);
    setTimeout(() => {
      setLabel(labelDefault);
    }, hideCopiedConfirmationAfterXMilliSeconds);
  }

  return (
    <Button variant="primary" onClick={handleClick} {...rest}>
      {label}
    </Button>
  );
}
