type FieldProps = {
  /** Child elements */
  children: React.ReactNode;
};

export default function Field({ children }: FieldProps) {
  return <div className="mt-4">{children}</div>;
}
