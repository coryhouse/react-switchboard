interface LabelProps extends React.ComponentPropsWithoutRef<"label"> {
  /** Label */
  children: React.ReactNode;
}

export default function Label({ children, htmlFor }: LabelProps) {
  return (
    <label className="block" htmlFor={htmlFor}>
      {children}
    </label>
  );
}
