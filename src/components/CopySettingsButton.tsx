import { useState } from "react";
import Button from "./Button";

// TODO: need this export?
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {}

const labelDefault = "Copy Settings";

export default function CopySettingsButton({ onClick, ...rest }: ButtonProps) {
  const [label, setLabel] = useState(labelDefault);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    setLabel("Copied ✅");
    if (onClick) onClick(e);
    setTimeout(() => {
      setLabel(labelDefault);
    }, 2000);
  }

  return (
    <Button variant="primary" onClick={handleClick} {...rest}>
      {label}
    </Button>
  );
}
